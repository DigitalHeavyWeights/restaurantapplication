import { create } from 'zustand';
import Cookies from 'js-cookie';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';
import { apiClient } from '../lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: User | null) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.login(credentials);
      const user: User = {
        id: response.email, // Using email as ID for now
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        roles: response.roles,
      };

      // Store token in secure HTTP-only cookie (if your backend supports it)
      // For now, we'll use a regular cookie with secure flags
      Cookies.set('auth-token', response.token, { 
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Login failed',
        isLoading: false 
      });
      throw error;
    }
  },

  register: async (userData: RegisterRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.register(userData);
      const user: User = {
        id: response.email,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        roles: response.roles,
      };

      // Store token in secure cookie
      Cookies.set('auth-token', response.token, { 
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Registration failed',
        isLoading: false 
      });
      throw error;
    }
  },

  logout: () => {
    Cookies.remove('auth-token');
    set({ 
      user: null, 
      isAuthenticated: false, 
      error: null 
    });
  },

  clearError: () => set({ error: null }),
  
  setUser: (user: User | null) => set({ 
    user, 
    isAuthenticated: !!user 
  }),

  // Initialize auth state on app startup
  initializeAuth: () => {
    const token = Cookies.get('auth-token');
    if (token) {
      set({ isLoading: true });
      
      // Verify token and get current user
      apiClient.getCurrentUser()
        .then((response) => {
          const user: User = {
            id: response.email,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            roles: response.roles,
          };
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });
        })
        .catch(() => {
          // Token is invalid or expired
          Cookies.remove('auth-token');
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
        });
    } else {
      set({ isLoading: false });
    }
  },
}));