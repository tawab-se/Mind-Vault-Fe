'use client';
import { InviteForm } from '@/components/forms/InviteForm';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { AuthGuard } from '@/components/guards/AuthGuard';
import { AdminGuard } from '@/components/guards/AdminGuard';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

function InviteContent() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0C0E12] p-8">
      <div className="max-w-md mx-auto">
        <div className="mb-4">
          <Button onClick={() => router.push('/dashboard')} variant="outline">
            ← Back to Dashboard
          </Button>
        </div>
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold text-center text-[#121212] dark:text-white">
              Invite Team Member
            </h1>
            <p className="text-sm text-center text-[#666] dark:text-[#999] mt-2">
              Send an invitation to join your organization
            </p>
          </CardHeader>
          <CardBody>
            <InviteForm />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default function InvitePage() {
  return (
    <AuthGuard>
      <AdminGuard>
        <InviteContent />
      </AdminGuard>
    </AuthGuard>
  );
}
