export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResult {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface NewPasswordData {
  token: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthError {
  message: string;
  code?: string;
  field?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: AuthError | null;
}
