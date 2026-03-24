'use client';

import { useAuth } from '@/hooks/useAuth';

interface IAuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<IAuthGuardProps> = ({ children }) => {
  const { isLoading, currentUser } = useAuth();

  // Middleware handles redirect, this just shows loading state
  // while fetching user profile
  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0C0E12]">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 mx-auto mb-4 text-[#936BDA]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-[#666] dark:text-[#999]">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
