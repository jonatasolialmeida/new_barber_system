'use client';

import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Snackbar, Typography, Stack } from '@mui/material';
import { Close, GetApp } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

/**
 * PWAInstallPrompt - Prompt para instalação do PWA
 *
 * Features:
 * - Detecta suporte a PWA
 * - Mostra prompt customizado
 * - Salva preferência do usuário
 * - Animações suaves
 *
 * @example
 * ```tsx
 * // No layout.tsx
 * <PWAInstallPrompt />
 * ```
 */
export default function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verificar se já está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Verificar se o usuário já rejeitou
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed === 'true') {
      return;
    }

    // Capturar evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);

      // Mostrar prompt após 30 segundos
      setTimeout(() => {
        setShowPrompt(true);
      }, 30000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detectar quando for instalado
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setInstallPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('PWA installation accepted');
      } else {
        console.log('PWA installation dismissed');
      }

      setShowPrompt(false);
      setInstallPrompt(null);
    } catch (error) {
      console.error('Error installing PWA:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (isInstalled || !installPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <Snackbar
          open={showPrompt}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          sx={{ bottom: { xs: 80, sm: 24 } }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <Box
              sx={{
                bgcolor: 'background.paper',
                color: 'text.primary',
                borderRadius: 2,
                boxShadow: 6,
                p: 2,
                maxWidth: 400,
                minWidth: 300,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 1.5,
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <GetApp sx={{ color: 'white', fontSize: 28 }} />
                </Box>

                <Box flex={1}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Instalar Aplicativo
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Acesse offline e receba notificações
                  </Typography>
                </Box>

                <IconButton size="small" onClick={handleDismiss} aria-label="Fechar">
                  <Close fontSize="small" />
                </IconButton>
              </Stack>

              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  size="small"
                  fullWidth
                  onClick={handleInstall}
                  startIcon={<GetApp />}
                >
                  Instalar
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleDismiss}
                >
                  Agora não
                </Button>
              </Stack>
            </Box>
          </motion.div>
        </Snackbar>
      )}
    </AnimatePresence>
  );
}

/**
 * PWAUpdatePrompt - Prompt para atualização do PWA
 *
 * Notifica o usuário quando uma nova versão está disponível.
 */
export function PWAUpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);

        // Detectar updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setShowPrompt(true);
              }
            });
          }
        });
      });
    }
  }, []);

  const handleUpdate = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <Snackbar
          open={showPrompt}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{ top: { xs: 80, sm: 24 } }}
        >
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <Box
              sx={{
                bgcolor: 'info.main',
                color: 'white',
                borderRadius: 2,
                boxShadow: 6,
                p: 2,
                maxWidth: 400,
              }}
            >
              <Stack spacing={2}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Nova versão disponível!
                </Typography>
                <Typography variant="body2">
                  Uma nova versão do aplicativo está disponível. Atualize para obter os recursos mais recentes.
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleUpdate}
                  sx={{
                    bgcolor: 'white',
                    color: 'info.main',
                    '&:hover': {
                      bgcolor: 'grey.100',
                    },
                  }}
                >
                  Atualizar Agora
                </Button>
              </Stack>
            </Box>
          </motion.div>
        </Snackbar>
      )}
    </AnimatePresence>
  );
}
