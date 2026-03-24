import BaseApi from './base-api';
import {
  ICreateInvitationRequest,
  ICreateInvitationResponse,
  IAcceptInvitationRequest,
  IAcceptInvitationResponse,
  IInvitation,
  IValidateInvitationResponse,
} from '@/types/auth';

class InvitationsApi extends BaseApi {
  async createInvitation(data: ICreateInvitationRequest): Promise<ICreateInvitationResponse> {
    return this.post<ICreateInvitationResponse>('/invitations', data);
  }

  async acceptInvitation(data: IAcceptInvitationRequest): Promise<IAcceptInvitationResponse> {
    const response = await this.post<IAcceptInvitationResponse>('/invitations/accept', data);
    this.setToken(response.accessToken);
    return response;
  }

  async getInvitation(token: string): Promise<IInvitation> {
    return this.get<IInvitation>(`/invitations/${token}`);
  }

  async validateInvitation(token: string): Promise<IValidateInvitationResponse> {
    return this.get<IValidateInvitationResponse>(`/invitations/validate?token=${token}`);
  }

  async listInvitations(): Promise<IInvitation[]> {
    return this.get<IInvitation[]>('/invitations');
  }

  async listInvitationsByOrganization(organizationId: string): Promise<IInvitation[]> {
    return this.get<IInvitation[]>(`/invitations/organization/${organizationId}`);
  }
}

export const invitationsApi = new InvitationsApi();
