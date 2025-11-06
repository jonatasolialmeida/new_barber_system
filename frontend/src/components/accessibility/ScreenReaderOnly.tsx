'use client';

import React from 'react';
import { Box } from '@mui/material';

interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  as?: React.ElementType;
}

/**
 * ScreenReaderOnly - Conteúdo visível apenas para leitores de tela
 *
 * Esconde visualmente o conteúdo mas mantém acessível para
 * tecnologias assistivas.
 *
 * @example
 * ```tsx
 * <ScreenReaderOnly>
 *   Este texto é lido por leitores de tela mas não aparece na tela
 * </ScreenReaderOnly>
 * ```
 */
export default function ScreenReaderOnly({ children, as = 'span' }: ScreenReaderOnlyProps) {
  return (
    <Box
      component={as}
      sx={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {children}
    </Box>
  );
}

/**
 * LiveRegion - Região para announcements dinâmicos
 *
 * Anuncia mudanças de conteúdo para leitores de tela.
 *
 * @example
 * ```tsx
 * <LiveRegion politeness="assertive">
 *   {errorMessage}
 * </LiveRegion>
 * ```
 */
interface LiveRegionProps {
  children: React.ReactNode;
  politeness?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
}

export function LiveRegion({
  children,
  politeness = 'polite',
  atomic = true,
}: LiveRegionProps) {
  return (
    <Box
      role="status"
      aria-live={politeness}
      aria-atomic={atomic}
      sx={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {children}
    </Box>
  );
}
