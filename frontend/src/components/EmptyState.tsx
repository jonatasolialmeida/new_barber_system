'use client';

import React from 'react';
import { Box, Typography, Stack, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import {
  SearchOff,
  EventBusy,
  Inbox,
  ErrorOutline,
  CloudOff,
  FolderOff,
  ContentCutOutlined,
  PersonOff,
  CalendarMonth,
  AttachMoney,
  Assessment,
  NotificationsNone,
} from '@mui/icons-material';
import Button from '@/components/base/Button';
import Card from '@/components/base/Card';
import { colors } from '@/styles/designTokens';

const MotionBox = motion(Box);

// ============================================================================
// EmptyState Base Component
// ============================================================================

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  illustration?: 'search' | 'appointments' | 'inbox' | 'error' | 'offline' | 'folder' | 'notifications';
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'card' | 'minimal';
}

/**
 * EmptyState - Componente de estado vazio
 *
 * Features:
 * - Ilustrações animadas
 * - Múltiplas variantes visuais
 * - Ações primária e secundária
 * - Tamanhos configuráveis
 * - Animações suaves
 *
 * @example
 * ```tsx
 * <EmptyState
 *   illustration="appointments"
 *   title="Nenhum agendamento encontrado"
 *   description="Você ainda não tem agendamentos. Crie seu primeiro!"
 *   action={{
 *     label: "Novo Agendamento",
 *     onClick: () => router.push('/appointments/new')
 *   }}
 * />
 * ```
 */
export default function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  illustration,
  size = 'medium',
  variant = 'default',
}: EmptyStateProps) {
  const getIllustration = () => {
    if (icon) return icon;

    const iconMap = {
      search: <SearchOff />,
      appointments: <EventBusy />,
      inbox: <Inbox />,
      error: <ErrorOutline />,
      offline: <CloudOff />,
      folder: <FolderOff />,
      notifications: <NotificationsNone />,
    };

    return illustration ? iconMap[illustration] : <Inbox />;
  };

  const getSizeStyles = () => {
    const sizes = {
      small: {
        iconSize: 60,
        titleSize: 'h6',
        descSize: 'body2',
        padding: 4,
      },
      medium: {
        iconSize: 80,
        titleSize: 'h5',
        descSize: 'body1',
        padding: 6,
      },
      large: {
        iconSize: 120,
        titleSize: 'h4',
        descSize: 'body1',
        padding: 8,
      },
    };

    return sizes[size];
  };

  const styles = getSizeStyles();

  const content = (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={3}
      sx={{
        py: styles.padding,
        px: 4,
        textAlign: 'center',
      }}
    >
      {/* Ícone animado */}
      <MotionBox
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
          delay: 0.1,
        }}
      >
        <Box
          sx={{
            width: styles.iconSize,
            height: styles.iconSize,
            borderRadius: '50%',
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? alpha(colors.primary[500], 0.1)
                : alpha(colors.primary[50], 0.5),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '& svg': {
              fontSize: styles.iconSize * 0.5,
              color: colors.primary[500],
            },
          }}
        >
          {getIllustration()}
        </Box>
      </MotionBox>

      {/* Textos */}
      <MotionBox
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Typography variant={styles.titleSize as any} fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        {description && (
          <Typography variant={styles.descSize as any} color="text.secondary" sx={{ maxWidth: 400 }}>
            {description}
          </Typography>
        )}
      </MotionBox>

      {/* Ações */}
      {(action || secondaryAction) && (
        <MotionBox
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Stack direction="row" spacing={2}>
            {action && (
              <Button
                variant="contained"
                onClick={action.onClick}
                startIcon={action.icon}
                size={size === 'small' ? 'small' : 'medium'}
              >
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                variant="outlined"
                onClick={secondaryAction.onClick}
                size={size === 'small' ? 'small' : 'medium'}
              >
                {secondaryAction.label}
              </Button>
            )}
          </Stack>
        </MotionBox>
      )}
    </Stack>
  );

  if (variant === 'card') {
    return <Card variant="outlined">{content}</Card>;
  }

  if (variant === 'minimal') {
    return <Box sx={{ py: 4 }}>{content}</Box>;
  }

  return content;
}

// ============================================================================
// Pre-configured Empty States
// ============================================================================

interface PreConfiguredEmptyStateProps {
  onAction?: () => void;
  actionLabel?: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * NoAppointments - Estado vazio para agendamentos
 */
export function NoAppointments({
  onAction,
  actionLabel = 'Novo Agendamento',
  size = 'medium',
}: PreConfiguredEmptyStateProps) {
  return (
    <EmptyState
      icon={<CalendarMonth />}
      title="Nenhum agendamento encontrado"
      description="Você ainda não tem agendamentos. Agende seu horário agora mesmo!"
      size={size}
      action={
        onAction
          ? {
              label: actionLabel,
              onClick: onAction,
            }
          : undefined
      }
    />
  );
}

/**
 * NoSearchResults - Estado vazio para busca
 */
export function NoSearchResults({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  return (
    <EmptyState
      icon={<SearchOff />}
      title="Nenhum resultado encontrado"
      description="Tente ajustar sua busca ou use outros termos"
      size={size}
      variant="minimal"
    />
  );
}

/**
 * NoServices - Estado vazio para serviços
 */
export function NoServices({
  onAction,
  actionLabel = 'Adicionar Serviço',
  size = 'medium',
}: PreConfiguredEmptyStateProps) {
  return (
    <EmptyState
      icon={<ContentCutOutlined />}
      title="Nenhum serviço cadastrado"
      description="Adicione serviços para que os clientes possam agendar"
      size={size}
      action={
        onAction
          ? {
              label: actionLabel,
              onClick: onAction,
            }
          : undefined
      }
    />
  );
}

/**
 * NoBarbers - Estado vazio para barbeiros
 */
export function NoBarbers({
  onAction,
  actionLabel = 'Adicionar Barbeiro',
  size = 'medium',
}: PreConfiguredEmptyStateProps) {
  return (
    <EmptyState
      icon={<PersonOff />}
      title="Nenhum barbeiro cadastrado"
      description="Adicione barbeiros à sua equipe"
      size={size}
      action={
        onAction
          ? {
              label: actionLabel,
              onClick: onAction,
            }
          : undefined
      }
    />
  );
}

/**
 * NoRevenue - Estado vazio para receita
 */
export function NoRevenue({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  return (
    <EmptyState
      icon={<AttachMoney />}
      title="Nenhuma receita registrada"
      description="Complete agendamentos para começar a gerar receita"
      size={size}
      variant="minimal"
    />
  );
}

/**
 * NoReports - Estado vazio para relatórios
 */
export function NoReports({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  return (
    <EmptyState
      icon={<Assessment />}
      title="Nenhum dado disponível"
      description="Dados insuficientes para gerar relatórios. Continue usando o sistema!"
      size={size}
      variant="minimal"
    />
  );
}

/**
 * ErrorState - Estado de erro
 */
interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  size?: 'small' | 'medium' | 'large';
}

export function ErrorState({
  title = 'Algo deu errado',
  description = 'Ocorreu um erro ao carregar os dados. Tente novamente.',
  onRetry,
  retryLabel = 'Tentar Novamente',
  size = 'medium',
}: ErrorStateProps) {
  return (
    <EmptyState
      icon={<ErrorOutline />}
      title={title}
      description={description}
      size={size}
      variant="card"
      action={
        onRetry
          ? {
              label: retryLabel,
              onClick: onRetry,
            }
          : undefined
      }
    />
  );
}

/**
 * OfflineState - Estado offline
 */
export function OfflineState({
  onRetry,
  size = 'medium',
}: {
  onRetry?: () => void;
  size?: 'small' | 'medium' | 'large';
}) {
  return (
    <EmptyState
      icon={<CloudOff />}
      title="Você está offline"
      description="Verifique sua conexão com a internet e tente novamente"
      size={size}
      variant="card"
      action={
        onRetry
          ? {
              label: 'Reconectar',
              onClick: onRetry,
            }
          : undefined
      }
    />
  );
}
