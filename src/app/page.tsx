'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0C0E12]">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h1 className="text-5xl font-bold text-[#121212] dark:text-white mb-4">
          Mind Vault
        </h1>
        <p className="text-xl text-[#666] dark:text-[#999] mb-8">
          Secure Knowledge Management for Teams
        </p>
        <p className="text-base text-[#666] dark:text-[#999] mb-12 max-w-lg mx-auto">
          Collaborate, organize, and manage your team&apos;s knowledge with powerful
          authentication and role-based access control.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => router.push('/auth/signup')} size="lg">
            Get Started
          </Button>
          <Button
            onClick={() => router.push('/auth/login')}
            variant="outline"
            size="lg"
          >
            Log In
          </Button>
        </div>
      </div>
    </div>
  );
}
