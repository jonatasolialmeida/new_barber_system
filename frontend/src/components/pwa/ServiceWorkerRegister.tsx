'use client';

import { useEffect } from 'react';

/**
 * ServiceWorkerRegister - Componente para registrar o Service Worker
 *
 * Registra o SW e gerencia o ciclo de vida.
 * Deve ser adicionado no layout raiz.
 *
 * @example
 * ```tsx
 * // No app/layout.tsx
 * <ServiceWorkerRegister />
 * ```
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('[SW] Service Worker registered:', registration);

          // Verificar updates a cada hora
          setInterval(() => {
            registration.update();
          }, 1000 * 60 * 60); // 1 hora
        })
        .catch((error) => {
          console.error('[SW] Service Worker registration failed:', error);
        });

      // Listener para controle do SW
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }, []);

  return null;
}

/**
 * useOnlineStatus - Hook para detectar status online/offline
 *
 * @example
 * ```tsx
 * const isOnline = useOnlineStatus();
 *
 * return (
 *   <div>
 *     {isOnline ? '🟢 Online' : '🔴 Offline'}
 *   </div>
 * );
 * ```
 */
import { useState, useEffect as useEffectHook } from 'react';

export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffectHook(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

/**
 * OnlineStatusBanner - Banner para mostrar status offline
 *
 * @example
 * ```tsx
 * <OnlineStatusBanner />
 * ```
 */
import { Box, Typography, Slide } from '@mui/material';
import { CloudOff, CloudDone } from '@mui/icons-material';

export function OnlineStatusBanner() {
  const isOnline = useOnlineStatus();
  const [showOffline, setShowOffline] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffectHook(() => {
    if (!isOnline) {
      setShowOffline(true);
      setWasOffline(true);
    } else if (wasOffline) {
      // Mostrar banner de reconexão por 3 segundos
      setShowOffline(false);
      setTimeout(() => setWasOffline(false), 3000);
    }
  }, [isOnline, wasOffline]);

  return (
    <>
      {/* Offline Banner */}
      <Slide direction="down" in={showOffline} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bgcolor: 'error.main',
            color: 'white',
            py: 1,
            px: 2,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <CloudOff fontSize="small" />
          <Typography variant="body2" fontWeight="medium">
            Você está offline. Algumas funcionalidades podem não estar disponíveis.
          </Typography>
        </Box>
      </Slide>

      {/* Reconnected Banner */}
      <Slide direction="down" in={!isOnline && wasOffline && isOnline} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bgcolor: 'success.main',
            color: 'white',
            py: 1,
            px: 2,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <CloudDone fontSize="small" />
          <Typography variant="body2" fontWeight="medium">
            Reconectado! Todas as funcionalidades estão disponíveis.
          </Typography>
        </Box>
      </Slide>
    </>
  );
}
