'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '../services/auth/AuthService';
import { AuthState, User, AuthError, LoginCredentials, RegisterData, ResetPasswordData, NewPasswordData } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  forgotPassword: (data: ResetPasswordData) => Promise<string>;
  resetPassword: (data: NewPasswordData) => Promise<string>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  const authService = new AuthService();

  useEffect(() => {
    checkAuthStatus();
    
    // Listen for 401 unauthorized events
    const handleUnauthorized = () => {
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
      
      // Show error toast
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('toast:show', {
          detail: {
            message: 'Session expired. Please log in again.',
            type: 'error',
            duration: 3000
          }
        }));
      }
      
      // Redirect to login using Next.js router
      router.push('/login');
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('auth:unauthorized', handleUnauthorized);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('auth:unauthorized', handleUnauthorized);
      }
    };
  }, [router]);

  const checkAuthStatus = async (): Promise<void> => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('userToken');
      
      if (token) {
        try {
          const response = await authService.getCurrentUser();
          setAuthState({
            user: response,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          // Try to use stored user data as fallback
          const storedUserData = localStorage.getItem('userData');
          if (storedUserData) {
            try {
              const userData = JSON.parse(storedUserData);
              setAuthState({
                user: userData,
                token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
            } catch (parseError) {
              localStorage.removeItem('userToken');
              localStorage.removeItem('userData');
              setAuthState({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
              });
            }
          } else {
            localStorage.removeItem('userToken');
            setAuthState({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        }
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
        }));
      }
    }
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await authService.login(credentials);
      
      setAuthState({
        user: result.user,
        token: result.token,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: {
          message: error.message,
          code: 'LOGIN_FAILED',
        },
      }));
      throw error;
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await authService.register(userData);
      
      setAuthState({
        user: result.user,
        token: result.token,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: {
          message: error.message,
          code: 'REGISTRATION_FAILED',
        },
      }));
      throw error;
    }
  };

  const forgotPassword = async (data: ResetPasswordData): Promise<string> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const message = await authService.forgotPassword(data);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return message;
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: {
          message: error.message,
          code: 'FORGOT_PASSWORD_FAILED',
        },
      }));
      throw error;
    }
  };

  const resetPassword = async (data: NewPasswordData): Promise<string> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const message = await authService.resetPassword(data);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return message;
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: {
          message: error.message,
          code: 'RESET_PASSWORD_FAILED',
        },
      }));
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await authService.logout();
    } catch (error) {
    } finally {
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    }
  };

  const clearError = (): void => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
