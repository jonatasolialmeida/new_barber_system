'use client';

import React from 'react';
import { Card as MuiCard, CardProps as MuiCardProps, Box, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { colors, borderRadius, shadows } from '@/styles/designTokens';

const MotionCard = motion(MuiCard);

export interface CardProps extends Omit<MuiCardProps, 'variant'> {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'gradient' | 'glass' | 'hover';
  interactive?: boolean;
  gradient?: string;
  glowColor?: string;
}

/**
 * Card - Componente de Card customizado
 *
 * Variantes:
 * - elevated: Card com sombra elevada (padrão)
 * - outlined: Card com borda
 * - gradient: Card com gradiente de fundo
 * - glass: Card com efeito glassmorphism
 * - hover: Card com efeito de hover intenso
 *
 * Props:
 * - interactive: Adiciona cursor pointer e animação scale no hover
 * - gradient: Gradiente personalizado (requer variant="gradient")
 * - glowColor: Cor do glow ao hover
 */
export default function Card({
  children,
  variant = 'elevated',
  interactive = false,
  gradient,
  glowColor,
  sx,
  ...props
}: CardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'outlined':
        return {
          border: `1px solid`,
          borderColor: 'divider',
          boxShadow: 'none',
          '&:hover': interactive
            ? {
                borderColor: 'primary.main',
                boxShadow: shadows.md,
              }
            : {},
        };

      case 'gradient':
        return {
          background: gradient || colors.gradients.barber,
          color: 'white',
          boxShadow: shadows.lg,
          '&:hover': interactive
            ? {
                boxShadow: shadows['2xl'],
                transform: 'translateY(-4px)',
              }
            : {},
        };

      case 'glass':
        return {
          background: (theme: any) =>
            theme.palette.mode === 'dark'
              ? 'rgba(26, 32, 39, 0.7)'
              : 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid',
          borderColor: (theme: any) =>
            theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.05)',
          boxShadow: shadows.base,
          '&:hover': interactive
            ? {
                backdropFilter: 'blur(30px) saturate(200%)',
                boxShadow: shadows.lg,
              }
            : {},
        };

      case 'hover':
        return {
          borderRadius: borderRadius.xl,
          boxShadow: shadows.base,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: gradient || colors.gradients.barber,
            opacity: 0,
            transition: 'opacity 0.3s ease',
            zIndex: 0,
          },
          '&:hover': {
            boxShadow: `${shadows['2xl']}, 0 0 40px ${glowColor || alpha(colors.primary[500], 0.3)}`,
            transform: 'translateY(-8px)',
            '&::before': {
              opacity: 0.05,
            },
          },
          '& > *': {
            position: 'relative',
            zIndex: 1,
          },
        };

      case 'elevated':
      default:
        return {
          borderRadius: borderRadius.lg,
          boxShadow: shadows.base,
          '&:hover': interactive
            ? {
                boxShadow: shadows.lg,
                transform: 'translateY(-4px)',
              }
            : {},
        };
    }
  };

  if (interactive) {
    return (
      <MotionCard
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        sx={{
          cursor: 'pointer',
          ...getVariantStyles(),
          ...sx,
        }}
        {...props}
      >
        {children}
      </MotionCard>
    );
  }

  return (
    <MuiCard
      sx={{
        ...getVariantStyles(),
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiCard>
  );
}
