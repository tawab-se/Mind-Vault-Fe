'use client';

import React, { useState } from 'react';
import { invitationsApi } from '@/services/invitations-api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';

export const InviteForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    role: 'member' as 'admin' | 'member',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [invitationLink, setInvitationLink] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setInvitationLink(null);

    if (!validate()) return;

    try {
      setIsLoading(true);
      const response = await invitationsApi.createInvitation(formData);
      setSuccess('Invitation sent successfully!');
      setInvitationLink(response.invitationLink);
      setFormData({ email: '', role: 'member' });
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { detail?: string } }; message?: string })?.response?.data
          ?.detail ||
        (err as { message?: string })?.message ||
        'Failed to send invitation';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (invitationLink) {
      navigator.clipboard.writeText(invitationLink);
      alert('Invitation link copied to clipboard!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert type="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert type="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {invitationLink && (
        <div className="p-4 bg-[#f5f5f5] dark:bg-[#1a1d23] rounded-md">
          <p className="text-sm text-[#666] dark:text-[#999] mb-2">Invitation Link:</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={invitationLink}
              readOnly
              className="flex-1 px-3 py-2 text-sm bg-white dark:bg-[#0C0E12] border border-[#e5e5e5] dark:border-[#2a2d35] rounded"
            />
            <Button type="button" onClick={copyToClipboard} size="sm">
              Copy
            </Button>
          </div>
        </div>
      )}

      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={formErrors.email}
        placeholder="colleague@example.com"
        required
      />

      <div>
        <label className="block text-sm font-medium mb-1 text-[#121212] dark:text-white">
          Role
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md border font-inter bg-white dark:bg-[#0C0E12] text-[#121212] dark:text-white border-[#e5e5e5] dark:border-[#2a2d35] focus:outline-none focus:ring-2 focus:ring-[#936BDA] focus:border-transparent"
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <Button type="submit" isLoading={isLoading} className="w-full">
        Send Invitation
      </Button>
    </form>
  );
};
