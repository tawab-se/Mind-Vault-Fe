'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';

export const SignupForm: React.FC = () => {
  const router = useRouter();
  const { signup, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    organizationName: '',
    firstName: '',
    lastName: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (!formData.organizationName) {
      errors.organizationName = 'Organization name is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validate()) return;

    try {
      await signup(formData);
      router.push('/dashboard');
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert type="error" onClose={clearError}>
          {error}
        </Alert>
      )}

      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={formErrors.email}
        placeholder="you@example.com"
        required
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

      <Input
        label="Organization Name"
        name="organizationName"
        type="text"
        value={formData.organizationName}
        onChange={handleChange}
        error={formErrors.organizationName}
        placeholder="Acme Corp"
        required
      />

      <Input
        label="First Name (Optional)"
        name="firstName"
        type="text"
        value={formData.firstName}
        onChange={handleChange}
        placeholder="John"
      />

      <Input
        label="Last Name (Optional)"
        name="lastName"
        type="text"
        value={formData.lastName}
        onChange={handleChange}
        placeholder="Doe"
      />

      <Button type="submit" isLoading={isLoading} className="w-full">
        Sign Up
      </Button>

      <p className="text-center text-sm text-[#666] dark:text-[#999]">
        Already have an account?{' '}
        <a href="/auth/login" className="text-[#936BDA] hover:underline">
          Log in
        </a>
      </p>
    </form>
  );
};
