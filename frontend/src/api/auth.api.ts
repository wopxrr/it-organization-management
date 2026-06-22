import api from './axios';
import type { AuthResponse, LoginCredentials, RegisterData, ProfileResponse } from '../types';

export const authAPI = {
  register: (data: RegisterData) => 
    api.post<AuthResponse>('/auth/register', data),
  
  login: (data: LoginCredentials) => 
    api.post<AuthResponse>('/auth/login', data),
  
  getProfile: () => 
    api.get<ProfileResponse>('/auth/profile'),
};