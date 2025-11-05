'use client';

import { Toaster } from 'react-hot-toast';
import { colors } from '@/styles/designTokens';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // Styling padrão
        duration: 4000,
        style: {
          background: colors.white,
          color: colors.gray[900],
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          padding: '16px 20px',
          fontSize: '14px',
          fontWeight: 500,
        },

        // Success toast
        success: {
          duration: 3000,
          iconTheme: {
            primary: colors.success[600],
            secondary: colors.white,
          },
          style: {
            background: colors.success[50],
            color: colors.success[900],
            border: `1px solid ${colors.success[200]}`,
          },
        },

        // Error toast
        error: {
          duration: 5000,
          iconTheme: {
            primary: colors.error[600],
            secondary: colors.white,
          },
          style: {
            background: colors.error[50],
            color: colors.error[900],
            border: `1px solid ${colors.error[200]}`,
          },
        },

        // Loading toast
        loading: {
          iconTheme: {
            primary: colors.primary[600],
            secondary: colors.white,
          },
        },
      }}
    />
  );
}
