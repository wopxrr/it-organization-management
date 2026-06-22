import api from './axios';

export const invitationsAPI = {
  invite: (organizationId: number, emails: string[]) =>
    api.post(`/invitations/${organizationId}/invite`, { emails }),

  accept: (token: string) =>
    api.post(`/invitations/accept/${token}`),

  getByToken: (token: string) =>
    api.get(`/invitations/accept/${token}`),

  getByOrganization: (organizationId: number) =>
    api.get(`/invitations/organization/${organizationId}`),
};