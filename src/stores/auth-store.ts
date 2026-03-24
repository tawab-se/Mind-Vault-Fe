import { create } from 'zustand';
import Cookies from 'js-cookie';
import { IUser } from '@/types/auth';

interface IAuthStoreState {
  token: string | null;
  currentUser: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isFetchingUser: boolean;
  error: string | null;
  setToken: (token: string | null) => void;
  setCurrentUser: (user: IUser | null) => void;
  setLoading: (loading: boolean) => void;
  setFetchingUser: (fetching: boolean) => void;
  setError: (error: string | null) => void;
  login: (token: string, user: IUser) => void;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<IAuthStoreState>((set) => {
  const token = typeof window !== 'undefined' ? Cookies.get('token') : null;
  return {
    token: token || null,
    currentUser: null,
    isAuthenticated: !!token,
    isLoading: false,
    isFetchingUser: false,
    error: null,

  setToken: (token) => {
    if (token) {
      if (typeof window !== 'undefined') {
        Cookies.set('token', token, {
          expires: 7,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        });
      }
    } else {
      if (typeof window !== 'undefined') {
        Cookies.remove('token');
      }
    }
    set({ token, isAuthenticated: !!token });
  },

  setCurrentUser: (user) => set({ currentUser: user }),

  setLoading: (loading) => set({ isLoading: loading }),

  setFetchingUser: (fetching) => set({ isFetchingUser: fetching }),

  setError: (error) => set({ error }),

  login: (token, user) => {
    if (typeof window !== 'undefined') {
      Cookies.set('token', token, {
        expires: 7,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
    }
    set({
      token,
      currentUser: user,
      isAuthenticated: true,
      error: null,
    });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      Cookies.remove('token');
    }
    set({
      token: null,
      currentUser: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
  };
});
