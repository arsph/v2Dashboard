
'use client';

import * as React from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter(); // Keep router for potential direct use if needed

  React.useEffect(() => {
    // AuthProvider already handles redirection based on isLoading, isAuthenticated, and pathname.
    // This component mainly decides whether to render children or a loading/alternative state.
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-foreground">Loading application...</p>
      </div>
    );
  }

  if (!isAuthenticated && pathname !== '/login') {
    // AuthProvider handles redirection. This state should be brief.
    // Return null or a loading indicator until redirection completes.
     return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-foreground">Redirecting to login...</p>
      </div>
    );
  }

  if (isAuthenticated && pathname === '/login') {
    // User is authenticated and on login page, AuthProvider should redirect to '/'
    // This state should be brief.
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-foreground">Already logged in, redirecting...</p>
      </div>
    );
  }
  
  // If on the login page and not authenticated, LoginPage itself will be the children
  // If authenticated and not on login page, render the main app layout (children)
  return <>{children}</>;
}
