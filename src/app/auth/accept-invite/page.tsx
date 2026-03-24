import React, { Suspense } from 'react';
import { AcceptInvitationForm } from '@/components/forms/AcceptInvitationForm';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';

function AcceptInviteContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0C0E12] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center text-[#121212] dark:text-white">
            Accept Invitation
          </h1>
          <p className="text-sm text-center text-[#666] dark:text-[#999] mt-2">
            Complete your profile to join the team
          </p>
        </CardHeader>
        <CardBody>
          <AcceptInvitationForm />
        </CardBody>
      </Card>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AcceptInviteContent />
    </Suspense>
  );
}
