'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, authService, streamService, Stream, StreamResponse, StreamsResponse } from '@/lib/api';

const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  currentStream: Stream | null;
  generateStreamKey: () => Promise<StreamResponse>;
  stopStream: () => Promise<void>;
  refreshStreams: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStream, setCurrentStream] = useState<Stream | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getAuthToken();
      if (storedToken) {
        try {
          const userData = await authService.getCurrentUser(storedToken);
          setUser(userData);
          setToken(storedToken);
          try {
            const streamsData = await streamService.getUserStreams(storedToken);
            const activeStream = streamsData.streams.find(s => s.status === 'active');
            if (activeStream) {
              setCurrentStream(activeStream);
            } else {
              setCurrentStream(null);
            }
          } catch (streamError) {
            console.error('Failed to fetch streams', streamError);
            setCurrentStream(null);
          }
        } catch (err) {
          console.error('Failed to fetch user', err);
          setAuthToken(null);
          setUser(null);
          setToken(null);
          setCurrentStream(null);
        }
      } else {
        setCurrentStream(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.login(email, password);
      setAuthToken(data.token);
      setToken(data.token);

      if (data.token) {
        try {
          const userData = await authService.getCurrentUser(data.token);
          setUser(userData);
        } catch (err) {
          console.error('Failed to fetch user data after login', err);
          setUser(null);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.register(userData);
      setAuthToken(data.token);
      setToken(data.token);
      if (data.token) {
        try {
          const userDataResponse = await authService.getCurrentUser(data.token);
          setUser(userDataResponse);
        } catch (err) {
          console.error('Failed to fetch user data after registration', err);
          setUser(null);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setToken(null);
    setCurrentStream(null);
  };

  const generateStreamKey = async (): Promise<StreamResponse> => {
    if (!token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await streamService.generateStreamKey(token);
      if (response.stream.status === 'active') {
        setCurrentStream(response.stream);
      }
      return response;
    } catch (err) {
      throw err;
    }
  };

  const stopStream = async (): Promise<void> => {
    const authenticated = !!user && !!token;
    if (!token || !authenticated) {
      setCurrentStream(null);
      throw new Error('You must be logged in to stop streaming. Please log in and try again.');
    }

    try {
      await streamService.stopStream(token);
      setCurrentStream(null);
    } catch (err) {
      if (err instanceof Error && (err.message.includes('Failed to stop stream') || err.message.includes('Not authenticated'))) {
        setCurrentStream(null);
      }
      throw err;
    }
  };

  const refreshStreams = async (): Promise<void> => {
    const authenticated = !!user && !!token;
    if (!token || !authenticated) {
      setCurrentStream(null);
      return;
    }

    try {
      const streamsData = await streamService.getUserStreams(token);
      const activeStream = streamsData.streams.find(s => s.status === 'active');
      setCurrentStream(activeStream || null);
    } catch (err) {
      console.error('Failed to refresh streams', err);
      setCurrentStream(null);
    }
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        register,
        logout,
        loading,
        error,
        currentStream,
        generateStreamKey,
        stopStream,
        refreshStreams,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
