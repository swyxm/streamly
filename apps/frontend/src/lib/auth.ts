import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
}

class AuthService {
  private tokenKey = 'auth_token';

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_BASE_URL}/api/auth/login`,
        credentials
      );

      if (response.data.token) {
        this.setToken(response.data.token);
      }

      return response.data;
    } catch (error) {
      throw new Error('Invalid username or password');
    }
  }

  async register(userData: RegisterRequest): Promise<{ message: string; userId: number; username: string }> {
    try {
      const response = await axios.post<{ message: string; userId: number; username: string }>(
        `${API_BASE_URL}/api/auth/register`,
        userData
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Registration failed');
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.tokenKey, token);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Get authorization header for API requests
  getAuthHeader(): { Authorization: string } | {} {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export const authService = new AuthService();
