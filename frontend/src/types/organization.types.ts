export interface Organization {
  id: number;
  name: string;
  description?: string;
  created_by: number;
  creator?: {
    id: number;
    name: string;
    email: string;
  };
  role?: 'OWNER' | 'MEMBER';
  memberCount?: number;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: number;
  organization_id: number;
  user_id: number;
  role: 'OWNER' | 'MEMBER';
  user?: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Invitation {
  id: number;
  email: string;
  token: string;
  status: 'PENDING' | 'ACCEPTED';
  organization_id: number;
  organization?: Organization;
  created_at: string;
  updated_at: string;
}

export interface CreateOrganizationData {
  name: string;
  description?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}