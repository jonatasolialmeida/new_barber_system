'use client';

import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { colors, borderRadius, shadows } from '@/styles/designTokens';

const MotionButton = motion(MuiButton);

export interface ButtonProps extends MuiButtonProps {
  loading?: boolean;
  gradient?: boolean;
  glow?: boolean;
  icon?: React.ReactNode;
}

/**
 * Button - Componente de botão customizado
 *
 * Features:
 * - Estado de loading com CircularProgress
 * - Variante gradient com gradiente animado
 * - Efeito glow ao hover
 * - Animações suaves com Framer Motion
 * - Suporte a ícone
 *
 * Props:
 * - loading: Mostra loading spinner e desabilita botão
 * - gradient: Aplica gradiente de fundo animado
 * - glow: Adiciona efeito glow ao hover
 * - icon: Ícone a ser exibido antes do texto
 */
export default function Button({
  children,
  loading = false,
  gradient = false,
  glow = false,
  icon,
  disabled,
  startIcon,
  sx,
  ...props
}: ButtonProps) {
  const gradientStyles = gradient
    ? {
        background: colors.gradients.barber,
        color: 'white',
        backgroundSize: '200% 200%',
        animation: 'gradientShift 3s ease infinite',
        '@keyframes gradientShift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        '&:hover': {
          background: colors.gradients.barber,
          boxShadow: `${shadows.lg}, 0 0 30px ${colors.primary[300]}`,
        },
      }
    : {};

  const glowStyles = glow
    ? {
        '&:hover': {
          boxShadow: `${shadows.lg}, 0 0 30px ${colors.primary[300]}`,
        },
      }
    : {};

  return (
    <MotionButton
      {...props}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : icon || startIcon}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      sx={{
        borderRadius: borderRadius.base,
        textTransform: 'none',
        fontWeight: 600,
        boxShadow: shadows.sm,
        ...gradientStyles,
        ...glowStyles,
        ...sx,
      }}
    >
      {children}
    </MotionButton>
  );
}

/**
 * IconButton - Botão circular apenas com ícone
 */
interface IconButtonProps extends Omit<ButtonProps, 'startIcon' | 'endIcon'> {
  icon: React.ReactNode;
  ariaLabel: string;
}

export function IconButton({ icon, ariaLabel, sx, ...props }: IconButtonProps) {
  return (
    <Button
      {...props}
      aria-label={ariaLabel}
      sx={{
        minWidth: 'auto',
        width: 48,
        height: 48,
        borderRadius: '50%',
        padding: 0,
        ...sx,
      }}
    >
      {icon}
    </Button>
  );
}

/**
 * ButtonGroup - Grupo de botões conectados
 */
interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
}

export function ButtonGroup({ children, orientation = 'horizontal' }: ButtonGroupProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: orientation === 'vertical' ? 'column' : 'row',
        gap: 0,
      }}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;

        const isFirst = index === 0;
        const isLast = index === React.Children.count(children) - 1;

        return React.cloneElement(child as React.ReactElement<any>, {
          sx: {
            ...(child.props.sx || {}),
            borderRadius: orientation === 'vertical'
              ? isFirst
                ? `${borderRadius.base} ${borderRadius.base} 0 0`
                : isLast
                ? `0 0 ${borderRadius.base} ${borderRadius.base}`
                : 0
              : isFirst
              ? `${borderRadius.base} 0 0 ${borderRadius.base}`
              : isLast
              ? `0 ${borderRadius.base} ${borderRadius.base} 0`
              : 0,
            ...(orientation === 'vertical' && !isLast ? { marginBottom: '-1px' } : {}),
            ...(orientation === 'horizontal' && !isLast ? { marginRight: '-1px' } : {}),
          },
        });
      })}
    </div>
  );
}
