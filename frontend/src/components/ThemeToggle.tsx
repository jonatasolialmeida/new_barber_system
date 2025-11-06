'use client';

import React from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useThemeMode } from '@/contexts/ThemeContext';

const MotionIconButton = motion(IconButton);

interface ThemeToggleProps {
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

/**
 * ThemeToggle - Componente para alternar entre tema claro e escuro
 *
 * Features:
 * - Animação suave de rotação ao trocar tema
 * - Persiste preferência no localStorage
 * - Detecta preferência do sistema operacional
 * - Tooltip informativo
 * - Suporte a diferentes tamanhos
 */
export default function ThemeToggle({ size = 'medium', showLabel = false }: ThemeToggleProps) {
  const { mode, toggleTheme } = useThemeMode();
  const isDark = mode === 'dark';

  return (
    <Tooltip title={isDark ? 'Tema Claro' : 'Tema Escuro'} arrow>
      <Box display="inline-flex" alignItems="center" gap={1}>
        <MotionIconButton
          onClick={toggleTheme}
          color="inherit"
          size={size}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            rotate: isDark ? 180 : 0,
          }}
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
          }}
        >
          {isDark ? <Brightness7 /> : <Brightness4 />}
        </MotionIconButton>
        {showLabel && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ fontSize: '0.875rem' }}
          >
            {isDark ? 'Claro' : 'Escuro'}
          </motion.span>
        )}
      </Box>
    </Tooltip>
  );
}
