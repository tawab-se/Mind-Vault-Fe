'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/guards/AuthGuard';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

function DashboardContent() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  const handleInvite = () => {
    router.push('/auth/invite');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0C0E12] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#121212] dark:text-white">
            Dashboard
          </h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold text-[#121212] dark:text-white">
              Welcome, {currentUser?.firstName || currentUser?.email}!
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              <p className="text-[#666] dark:text-[#999]">
                <span className="font-medium">Email:</span> {currentUser?.email}
              </p>
              <p className="text-[#666] dark:text-[#999]">
                <span className="font-medium">Role:</span> {currentUser?.role}
              </p>
            </div>
          </CardBody>
        </Card>

        {currentUser?.role === 'admin' && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-[#121212] dark:text-white">
                Admin Actions
              </h2>
            </CardHeader>
            <CardBody>
              <Button onClick={handleInvite} className="w-full">
                Invite Team Member
              </Button>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
