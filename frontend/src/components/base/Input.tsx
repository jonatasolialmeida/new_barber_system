'use client';

import React, { useState } from 'react';
import {
  TextField,
  TextFieldProps,
  InputAdornment,
  IconButton,
  Box,
  Typography,
  alpha,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  Error,
  InfoOutlined,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { colors, borderRadius, shadows } from '@/styles/designTokens';

const MotionBox = motion(Box);

export interface InputProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'glass';
  showPasswordToggle?: boolean;
  showValidationIcon?: boolean;
  hint?: string;
  success?: boolean;
}

/**
 * Input - Componente de input customizado
 *
 * Features:
 * - Variantes: outlined, filled, glass (glassmorphism)
 * - Toggle de visibilidade para senha
 * - Ícones de validação (sucesso/erro)
 * - Hint text animado
 * - Efeito glow no focus
 * - Animações suaves
 *
 * Props:
 * - variant: Estilo do input
 * - showPasswordToggle: Mostra botão de toggle para senha
 * - showValidationIcon: Mostra ícone de validação
 * - hint: Texto de dica abaixo do input
 * - success: Estado de sucesso (ícone verde)
 */
export default function Input({
  variant = 'outlined',
  showPasswordToggle = false,
  showValidationIcon = false,
  hint,
  success = false,
  error = false,
  type = 'text',
  InputProps,
  sx,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const getValidationIcon = () => {
    if (!showValidationIcon) return null;

    if (success) {
      return (
        <InputAdornment position="end">
          <CheckCircle sx={{ color: colors.success[500] }} />
        </InputAdornment>
      );
    }

    if (error) {
      return (
        <InputAdornment position="end">
          <Error sx={{ color: colors.error[500] }} />
        </InputAdornment>
      );
    }

    return null;
  };

  const getPasswordToggle = () => {
    if (!isPassword || !showPasswordToggle) return null;

    return (
      <InputAdornment position="end">
        <IconButton
          aria-label="toggle password visibility"
          onClick={() => setShowPassword(!showPassword)}
          edge="end"
          size="small"
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    );
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'filled':
        return {
          '& .MuiFilledInput-root': {
            borderRadius: borderRadius.base,
            backgroundColor: (theme: any) =>
              theme.palette.mode === 'dark'
                ? alpha(colors.gray[800], 0.5)
                : alpha(colors.gray[100], 0.5),
            '&:hover': {
              backgroundColor: (theme: any) =>
                theme.palette.mode === 'dark'
                  ? alpha(colors.gray[800], 0.7)
                  : alpha(colors.gray[100], 0.7),
            },
            '&.Mui-focused': {
              backgroundColor: (theme: any) =>
                theme.palette.mode === 'dark'
                  ? alpha(colors.gray[800], 0.9)
                  : alpha(colors.gray[50], 0.9),
              boxShadow: isFocused ? shadows.primaryGlow : 'none',
            },
          },
        };

      case 'glass':
        return {
          '& .MuiOutlinedInput-root': {
            borderRadius: borderRadius.base,
            backgroundColor: (theme: any) =>
              theme.palette.mode === 'dark'
                ? 'rgba(26, 32, 39, 0.5)'
                : 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(10px)',
            border: '1px solid',
            borderColor: (theme: any) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.05)',
            '& fieldset': {
              border: 'none',
            },
            '&:hover': {
              backdropFilter: 'blur(15px)',
            },
            '&.Mui-focused': {
              backdropFilter: 'blur(20px)',
              boxShadow: isFocused ? shadows.primaryGlow : 'none',
              borderColor: colors.primary[500],
            },
          },
        };

      case 'outlined':
      default:
        return {
          '& .MuiOutlinedInput-root': {
            borderRadius: borderRadius.base,
            transition: 'all 0.2s ease',
            '&:hover fieldset': {
              borderColor: colors.primary[400],
            },
            '&.Mui-focused': {
              boxShadow: isFocused ? shadows.primaryGlow : 'none',
            },
          },
        };
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        {...props}
        type={inputType}
        error={error}
        variant={variant === 'glass' ? 'outlined' : variant}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        InputProps={{
          ...InputProps,
          endAdornment: (
            <>
              {getValidationIcon()}
              {getPasswordToggle()}
              {InputProps?.endAdornment}
            </>
          ),
        }}
        sx={{
          width: '100%',
          ...getVariantStyles(),
          ...sx,
        }}
      />

      {/* Hint text animado */}
      <AnimatePresence>
        {hint && (
          <MotionBox
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            <InfoOutlined sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {hint}
            </Typography>
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
}

/**
 * TextArea - Input multilinha
 */
export function TextArea({ rows = 4, ...props }: InputProps & { rows?: number }) {
  return <Input {...props} multiline rows={rows} />;
}

/**
 * SearchInput - Input de busca com ícone
 */
interface SearchInputProps extends InputProps {
  onSearch?: (value: string) => void;
}

export function SearchInput({ onSearch, ...props }: SearchInputProps) {
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onSearch?.(newValue);
  };

  return (
    <Input
      {...props}
      value={value}
      onChange={handleChange}
      placeholder="Buscar..."
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Box component="span" sx={{ fontSize: 20 }}>
              🔍
            </Box>
          </InputAdornment>
        ),
      }}
    />
  );
}
