import api from './axios';
import type { ApiResponse, Organization, CreateOrganizationData } from '../types';

export const organizationsAPI = {
  create: (data: CreateOrganizationData) =>
    api.post<ApiResponse<Organization>>('/organizations', data),

  getAll: () =>
    api.get<ApiResponse<Organization[]>>('/organizations'),

  getById: (id: number) =>
    api.get<ApiResponse<Organization>>(`/organizations/${id}`),

  getMembers: (id: number) =>
    api.get<ApiResponse<any[]>>(`/organizations/${id}/members`),
};