'use client';

import { Box, Container } from '@mui/material';
import { OfflineState } from '@/components/EmptyState';
import { colors } from '@/styles/designTokens';

/**
 * Offline Page - Fallback quando o usuário está offline
 *
 * Esta página é exibida pelo Service Worker quando:
 * 1. O usuário está offline
 * 2. A página solicitada não está no cache
 * 3. Não há conexão de rede disponível
 */
export default function OfflinePage() {
  const handleRetry = () => {
    // Tenta recarregar a página
    window.location.reload();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: colors.gradients.barber,
      }}
    >
      <Container maxWidth="sm">
        <OfflineState onRetry={handleRetry} size="large" />
      </Container>
    </Box>
  );
}
