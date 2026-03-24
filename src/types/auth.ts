// Types (using T prefix for type aliases)
export type TUserRole = 'admin' | 'member';
export type TInvitationStatus = 'pending' | 'accepted' | 'expired';

// Interfaces (using I prefix for extendable types)
export interface IUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: TUserRole;
  organizationId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface IOrganization {
  id: string;
  name: string;
  slug?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IInvitation {
  id: string;
  email: string;
  role: TUserRole;
  status: TInvitationStatus;
  token: string;
  organizationId: string;
  invitedBy: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISignupRequest {
  email: string;
  password: string;
  organizationName?: string;
  firstName?: string;
  lastName?: string;
  invitationToken?: string;
}

export interface ISignupResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
  organization: IOrganization;
}

export interface ILoginRequest {
  email: string;
  password: string;
  invitationToken?: string;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export interface ICreateInvitationRequest {
  email: string;
  role: TUserRole;
}

export interface ICreateInvitationResponse {
  invitation: IInvitation;
  invitationLink: string;
}

export interface IAcceptInvitationRequest {
  token: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface IAcceptInvitationResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export interface IValidateInvitationResponse {
  valid: boolean;
  invitation: {
    email: string;
    organizationName: string;
    role: TUserRole;
    expiresAt: string;
  } | null;
  userExists: boolean;
  actionRequired: 'signup' | 'login' | null;
  message: string;
}

export interface IAuthState {
  token: string | null;
  currentUser: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
