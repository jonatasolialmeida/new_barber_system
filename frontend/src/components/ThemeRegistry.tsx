'use client';

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryProvider } from '@/components/QueryProvider';
import { ToastProvider } from '@/components/ToastProvider';
import ErrorBoundary from '@/components/ErrorBoundary';
import theme from '@/utils/theme';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ToastProvider />
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}
