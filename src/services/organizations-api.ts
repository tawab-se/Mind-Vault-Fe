import BaseApi from './base-api';
import { IOrganization } from '@/types/auth';

class OrganizationsApi extends BaseApi {
  async getOrganization(organizationId: string): Promise<IOrganization> {
    return this.get<IOrganization>(`/organizations/${organizationId}`);
  }

  async updateOrganization(organizationId: string, data: Partial<IOrganization>): Promise<IOrganization> {
    return this.patch<IOrganization>(`/organizations/${organizationId}`, data);
  }
}

export const organizationsApi = new OrganizationsApi();
