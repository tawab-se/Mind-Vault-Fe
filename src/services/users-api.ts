import BaseApi from './base-api';
import { IUser } from '@/types/auth';

class UsersApi extends BaseApi {
  async getUser(userId: string): Promise<IUser> {
    return this.get<IUser>(`/users/${userId}`);
  }

  async updateUser(userId: string, data: Partial<IUser>): Promise<IUser> {
    return this.patch<IUser>(`/users/${userId}`, data);
  }

  async listUsers(): Promise<IUser[]> {
    return this.get<IUser[]>('/users');
  }

  async getUsersByOrganization(organizationId: string): Promise<IUser[]> {
    return this.get<IUser[]>(`/users/organization/${organizationId}`);
  }
}

export const usersApi = new UsersApi();
