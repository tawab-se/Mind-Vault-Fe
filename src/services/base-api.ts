import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

const toSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

const convertKeysToCamelCase = (obj: unknown): unknown => {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(convertKeysToCamelCase);
  if (typeof obj !== 'object') return obj;

  return Object.keys(obj as Record<string, unknown>).reduce((acc: Record<string, unknown>, key: string) => {
    const camelKey = toCamelCase(key);
    acc[camelKey] = convertKeysToCamelCase((obj as Record<string, unknown>)[key]);
    return acc;
  }, {});
};

const convertKeysToSnakeCase = (obj: unknown): unknown => {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(convertKeysToSnakeCase);
  if (typeof obj !== 'object') return obj;

  return Object.keys(obj as Record<string, unknown>).reduce((acc: Record<string, unknown>, key: string) => {
    const snakeKey = toSnakeCase(key);
    acc[snakeKey] = convertKeysToSnakeCase((obj as Record<string, unknown>)[key]);
    return acc;
  }, {});
};

class BaseApi {
  protected api: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:8000/api/v1') {
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        if (config.data && typeof config.data === 'object') {
          config.data = convertKeysToSnakeCase(config.data);
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        if (response.data && typeof response.data === 'object') {
          response.data = convertKeysToCamelCase(response.data);
        }
        return response;
      },
      (error) => {
        if (error.response?.data && typeof error.response.data === 'object') {
          error.response.data = convertKeysToCamelCase(error.response.data);
        }
        return Promise.reject(error);
      }
    );
  }

  protected getToken(): string | null {
    if (typeof window !== 'undefined') {
      return Cookies.get('token') || null;
    }
    return null;
  }

  protected setToken(token: string): void {
    if (typeof window !== 'undefined') {
      // Set cookie with 7 days expiration
      // secure: true in production, sameSite: 'lax' for CSRF protection
      Cookies.set('token', token, {
        expires: 7,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
    }
  }

  protected removeToken(): void {
    if (typeof window !== 'undefined') {
      Cookies.remove('token');
    }
  }

  protected async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.get<T>(url, config);
    return response.data;
  }

  protected async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.post<T>(url, data, config);
    return response.data;
  }

  protected async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.put<T>(url, data, config);
    return response.data;
  }

  protected async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.patch<T>(url, data, config);
    return response.data;
  }

  protected async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.delete<T>(url, config);
    return response.data;
  }
}

export default BaseApi;
