import api from './api';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  trustScore: number;
  contributionCount: number;
  isVerified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    const { user, token } = response.data;
    
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    const { user, token } = response.data;
    
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },

  async getProfile(): Promise<{ user: User }> {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }
};