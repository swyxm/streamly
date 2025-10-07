const API_BASE_URL = 'http://localhost:8080/api';
const STREAM_API_BASE_URL = 'http://localhost:8082/api';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  user?: User;
  message?: string;
  userId?: number;
}

export interface Stream {
  id: number;
  stream_key: string;
  status: string;
  created_at: string;
  updated_at?: string;
  expires_at?: string;
  rtmp_url: string;
  hls_url: string;
}

export interface StreamResponse {
  message: string;
  stream: Stream;
}

export interface StreamsResponse {
  streams: Stream[];
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  },

  async register(userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    return response.json();
  },

  async getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return response.json();
  },
};

export const streamService = {
  async generateStreamKey(token: string): Promise<StreamResponse> {
    const response = await fetch(`${STREAM_API_BASE_URL}/streams/generate-key`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate stream key');
    }

    return response.json();
  },

  async stopStream(token: string): Promise<{ message: string; stream_id: number; stream_key: string }> {
    const response = await fetch(`${STREAM_API_BASE_URL}/streams/stop`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to stop stream');
    }

    return response.json();
  },

  async getUserStreams(token: string): Promise<StreamsResponse> {
    const response = await fetch(`${STREAM_API_BASE_URL}/streams`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch streams');
    }

    return response.json();
  },
};

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};
