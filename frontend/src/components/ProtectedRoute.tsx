'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Container, Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireAuth?: boolean;
}

export default function ProtectedRoute({
  children,
  allowedRoles = [],
  requireAuth = true
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // If auth is required and user is not logged in
      if (requireAuth && !user) {
        router.push('/login');
        return;
      }

      // If specific roles are required and user doesn't have the right role
      if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        router.push('/dashboard');
        return;
      }
    }
  }, [user, loading, requireAuth, allowedRoles, router]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <Container>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // If auth is required and user is not logged in, don't render content
  if (requireAuth && !user) {
    return null;
  }

  // If specific roles are required and user doesn't have the right role, don't render content
  if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
