'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { invitationsApi } from '@/services/invitations-api';
import { authApi } from '@/services/auth-api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { useAuthStore } from '@/stores/auth-store';
import type { IValidateInvitationResponse } from '@/types/auth';

type TFormMode = 'loading' | 'signup' | 'login' | 'error' | 'expired';

export const AcceptInvitationForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { login: setLogin } = useAuthStore();

  const [mode, setMode] = useState<TFormMode>('loading');
  const [invitationData, setInvitationData] = useState<IValidateInvitationResponse | null>(null);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Validate invitation on mount
  useEffect(() => {
    if (!token) {
      setMode('error');
      setError('Invalid invitation link. Token is missing.');
      return;
    }

    const validateToken = async () => {
      try {
        const response = await invitationsApi.validateInvitation(token);

        if (!response.valid) {
          setMode('expired');
          setError(response.message || 'This invitation is no longer valid.');
          return;
        }

        setInvitationData(response);

        // Set mode based on action required
        if (response.actionRequired === 'signup') {
          setMode('signup');
        } else if (response.actionRequired === 'login') {
          setMode('login');
        } else {
          setMode('error');
          setError('Invalid invitation state.');
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error
          ? err.message
          : 'Failed to validate invitation';
        setError(errorMessage);
        setMode('error');
      }
    };

    validateToken();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (mode === 'signup') {
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token || !invitationData?.invitation) {
      setError('Invalid invitation data');
      return;
    }

    if (!validate()) return;

    try {
      setIsSubmitting(true);

      if (mode === 'signup') {
        // Step 2A: Signup with invitation token
        const response = await authApi.signup({
          email: invitationData.invitation.email,
          password: formData.password,
          invitationToken: token,
        });
        setLogin(response.accessToken, response.user);
      } else if (mode === 'login') {
        // Step 2B: Login with invitation token
        const response = await authApi.login({
          email: invitationData.invitation.email,
          password: formData.password,
          invitationToken: token,
        });
        setLogin(response.accessToken, response.user);
      }

      // Step 3: Redirect to dashboard
      router.push('/dashboard');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? err.message
        : 'Failed to accept invitation';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (mode === 'loading') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 mx-auto mb-4 text-[#936BDA]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-[#666] dark:text-[#999]">Validating invitation...</p>
        </div>
      </div>
    );
  }

  // Error or expired state
  if (mode === 'error' || mode === 'expired') {
    return (
      <div className="space-y-4">
        <Alert type="error">
          {error || 'An error occurred'}
        </Alert>
        <Button onClick={() => router.push('/auth/login')} className="w-full">
          Go to Login
        </Button>
      </div>
    );
  }

  // Signup or Login form
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert type="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {invitationData?.invitation && (
        <div className="bg-[#936BDA]/10 border border-[#936BDA]/20 rounded-lg p-4 mb-4">
          <p className="text-sm text-[#666] dark:text-[#999] mb-2">
            You&apos;ve been invited to join
          </p>
          <p className="font-semibold text-[#121212] dark:text-white mb-1">
            {invitationData.invitation.organizationName}
          </p>
          <p className="text-sm text-[#666] dark:text-[#999]">
            as {invitationData.invitation.role}
          </p>
        </div>
      )}

      <Input
        label="Email"
        name="email"
        type="email"
        value={invitationData?.invitation?.email || ''}
        disabled
        readOnly
      />

      <Input
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        error={formErrors.password}
        placeholder="••••••••"
        required
      />

      {mode === 'signup' && (
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={formErrors.confirmPassword}
          placeholder="••••••••"
          required
        />
      )}

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        {mode === 'signup' ? 'Create Account & Join' : 'Login & Join'}
      </Button>

      <p className="text-center text-sm text-[#666] dark:text-[#999]">
        {mode === 'signup'
          ? 'By creating an account, you accept the invitation to join this organization.'
          : 'By logging in, you accept the invitation to join this organization.'}
      </p>
    </form>
  );
};
