'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { authApi } from '@/services/auth-api';
import {
  ISignupRequest,
  ILoginRequest,
  ISignupResponse,
  ILoginResponse,
} from '@/types/auth';

// Singleton flag to prevent multiple simultaneous profile fetches
let isCurrentlyFetchingProfile = false;

export const useAuth = () => {
  const {
    token,
    currentUser,
    isAuthenticated,
    isLoading,
    isFetchingUser,
    error,
    login: setLogin,
    logout: setLogout,
    setCurrentUser,
    setLoading,
    setFetchingUser,
    setError,
    clearError,
  } = useAuthStore();

  const signup = async (data: ISignupRequest): Promise<ISignupResponse> => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.signup(data);
      setLogin(response.accessToken, response.user);
      return response;
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { detail?: string } }; message?: string })?.response?.data
          ?.detail ||
        (err as { message?: string })?.message ||
        'Signup failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: ILoginRequest): Promise<ILoginResponse> => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.login(data);
      setLogin(response.accessToken, response.user);
      return response;
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { detail?: string } }; message?: string })?.response?.data
          ?.detail ||
        (err as { message?: string })?.message ||
        'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
      setLogout();
    } catch (err: unknown) {
      console.error('Logout error:', err);
    }
  };

  const refreshProfile = async (): Promise<void> => {
    // Check singleton flag first (atomic check across all component instances)
    if (!token || isFetchingUser || isCurrentlyFetchingProfile) return;

    try {
      // Set singleton flag immediately (before any async operations)
      isCurrentlyFetchingProfile = true;
      setFetchingUser(true);
      setLoading(true);
      const user = await authApi.getCurrentUser();
      setCurrentUser(user);
    } catch (err: unknown) {
      console.error('Failed to fetch user profile:', err);
      if ((err as { response?: { status?: number } })?.response?.status === 401) {
        setLogout();
      }
    } finally {
      setLoading(false);
      setFetchingUser(false);
      // Clear singleton flag
      isCurrentlyFetchingProfile = false;
    }
  };

  // Track if this hook instance has already triggered a fetch
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Only fetch if:
    // 1. We have a token
    // 2. No current user
    // 3. Not currently fetching (Zustand state)
    // 4. Not currently fetching (singleton flag)
    // 5. This hook instance hasn't already triggered a fetch
    if (
      token &&
      !currentUser &&
      !isFetchingUser &&
      !isCurrentlyFetchingProfile &&
      !hasFetchedRef.current
    ) {
      hasFetchedRef.current = true;
      refreshProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, currentUser, isFetchingUser]);

  return {
    token,
    currentUser,
    isAuthenticated,
    isLoading,
    error,
    signup,
    login,
    logout,
    refreshProfile,
    clearError,
  };
};
