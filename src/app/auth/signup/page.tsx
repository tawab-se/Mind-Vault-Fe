import React from 'react';
import { SignupForm } from '@/components/forms/SignupForm';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0C0E12] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center text-[#121212] dark:text-white">
            Create Your Account
          </h1>
          <p className="text-sm text-center text-[#666] dark:text-[#999] mt-2">
            Get started with Mind Vault
          </p>
        </CardHeader>
        <CardBody>
          <SignupForm />
        </CardBody>
      </Card>
    </div>
  );
}
