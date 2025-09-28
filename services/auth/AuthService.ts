import { ApiClient } from '../api/ApiClient';
import { LoginCredentials, RegisterData, ResetPasswordData, NewPasswordData, AuthResult } from '../../types/auth';

export class AuthService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      const response = await this.apiClient.post('/login', credentials);
      
      if (!response.data.data?.user || !response.data.data?.token) {
        throw new Error('Invalid response format from server');
      }
      
      this.storeAuthData(response.data.data);
      
      return {
        user: response.data.data.user,
        token: response.data.data.token,
        refreshToken: response.data.data.refreshToken,
      };
    } catch (error: any) {
      throw this.handleApiError(error);
    }
  }

  async register(userData: RegisterData): Promise<AuthResult> {
    try {
      const registerPayload = {
        name: userData.name,
        username: userData.email.split('@')[0],
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.confirmPassword,
      };

      const response = await this.apiClient.post('/register', registerPayload);
      
      if (!response.data.data?.user || !response.data.data?.token) {
        throw new Error('Invalid response format from server');
      }
      
      this.storeAuthData(response.data.data);
      
      return {
        user: response.data.data.user,
        token: response.data.data.token,
        refreshToken: response.data.data.refreshToken,
      };
    } catch (error: any) {
      throw this.handleApiError(error);
    }
  }

  async forgotPassword(data: ResetPasswordData): Promise<string> {
    try {
      const response = await this.apiClient.post('/password-email', { email: data.email });
      return response.data.message || 'Password reset link sent to your email';
    } catch (error: any) {
      throw this.handleApiError(error);
    }
  }

  async resetPassword(data: NewPasswordData): Promise<string> {
    try {
      const resetPayload = {
        token: data.token,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword,
      };

      const response = await this.apiClient.post('/reset-password', resetPayload);
      return response.data.message || 'Password has been reset successfully';
    } catch (error: any) {
      throw this.handleApiError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.apiClient.post('/logout');
    } catch (error) {
    } finally {
      this.clearAuthData();
    }
  }

  private storeAuthData(authResult: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userToken', authResult.token);
    }
  }

  private clearAuthData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userToken');
    }
  }

  private handleApiError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    
    if (error.response?.data?.errors) {
      const firstError = Object.values(error.response.data.errors)[0];
      const errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
      return new Error(errorMessage as string);
    }
    
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      return new Error(`Network error. Please check your internet connection and ensure the backend server is running.`);
    }
    
    return new Error('An unexpected error occurred. Please try again.');
  }
}
