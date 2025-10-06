import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, LoginRequest, RegisterRequest, User } from '@/lib/auth';

interface AuthState {
  user: {
    id?: number;
    username?: string;
    email?: string;
    displayName?: string;
    avatarUrl?: string;
    isVerified?: boolean;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });

        try {
          await authService.login(credentials);
          set({
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          set({
            isAuthenticated: false,
            isLoading: false,
            error: error.message || 'Login failed'
          });
          throw error;
        }
      },

      register: async (userData: RegisterRequest) => {
        set({ isLoading: true, error: null });

        try {
          await authService.register(userData);
          try {
            await get().login(userData);
            // toast.success('Successfully logged in!');
            // reset();
          } catch (error) {
            // toast.error('Login failed. Please check your credentials.');
          } finally {
            set({
              isLoading: false,
              error: null
            });
          }
        } catch (error) {
          set({
            isLoading: false,
            error: (error as Error).message || 'Registration failed'
          });
          throw error;
        }
      },

      logout: () => {
        authService.logout();
        set({
          user: null,
          isAuthenticated: false,
          error: null
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user
      }),
    }
  )
);
