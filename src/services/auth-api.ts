import BaseApi from './base-api';
import {
  ISignupRequest,
  ISignupResponse,
  ILoginRequest,
  ILoginResponse,
  IUser,
} from '@/types/auth';

class AuthApi extends BaseApi {
  async signup(data: ISignupRequest): Promise<ISignupResponse> {
    // Step 1: Create user and organization
    type SignupResponseWithoutTokens = Omit<ISignupResponse, 'accessToken' | 'refreshToken'> & Partial<Pick<ISignupResponse, 'accessToken' | 'refreshToken'>>;
    const signupResponse = await this.post<SignupResponseWithoutTokens>('/auth/signup', data);

    // Step 2: Check if accessToken is in response (future-proof for when backend adds it)
    if (signupResponse.accessToken && signupResponse.refreshToken) {
      this.setToken(signupResponse.accessToken);
      return signupResponse as ISignupResponse;
    }

    // Step 3: If no token, auto-login to get token (workaround for current backend)
    const loginResponse = await this.post<ILoginResponse>('/auth/login', {
      email: data.email,
      password: data.password,
    });

    // Step 4: Store token and return combined response
    this.setToken(loginResponse.accessToken);
    return {
      accessToken: loginResponse.accessToken,
      refreshToken: loginResponse.refreshToken,
      user: signupResponse.user,
      organization: signupResponse.organization,
    };
  }

  async login(data: ILoginRequest): Promise<ILoginResponse> {
    const response = await this.post<ILoginResponse>('/auth/login', data);
    this.setToken(response.accessToken);
    return response;
  }

  async getCurrentUser(): Promise<IUser> {
    return this.get<IUser>('/auth/me');
  }

  async logout(): Promise<void> {
    this.removeToken();
  }
}

export const authApi = new AuthApi();
