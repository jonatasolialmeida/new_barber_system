'use client';

import React from 'react';
import { Box, Link } from '@mui/material';
import { colors } from '@/styles/designTokens';

interface SkipLink {
  id: string;
  label: string;
}

interface SkipLinksProps {
  links?: SkipLink[];
}

const defaultLinks: SkipLink[] = [
  { id: 'main-content', label: 'Pular para o conteúdo principal' },
  { id: 'main-navigation', label: 'Pular para a navegação' },
  { id: 'footer', label: 'Pular para o rodapé' },
];

/**
 * SkipLinks - Links de atalho para navegação por teclado
 *
 * Permite que usuários de leitores de tela pulem diretamente
 * para seções importantes da página.
 *
 * Features:
 * - Visível apenas ao receber foco (Tab)
 * - Posição fixa no topo
 * - Alto contraste
 * - Z-index elevado
 *
 * @example
 * ```tsx
 * // No layout.tsx
 * <SkipLinks />
 * <Navbar id="main-navigation" />
 * <main id="main-content">...</main>
 * <footer id="footer">...</footer>
 * ```
 */
export default function SkipLinks({ links = defaultLinks }: SkipLinksProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Box
      component="nav"
      aria-label="Skip links"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10000,
        pointerEvents: 'none',
      }}
    >
      {links.map((link) => (
        <Link
          key={link.id}
          href={`#${link.id}`}
          onClick={(e) => handleClick(e, link.id)}
          sx={{
            position: 'absolute',
            top: -100,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: colors.primary[600],
            color: colors.white,
            padding: '12px 24px',
            borderRadius: '0 0 8px 8px',
            fontWeight: 'bold',
            textDecoration: 'none',
            pointerEvents: 'auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            transition: 'top 0.2s ease',
            '&:focus': {
              top: 0,
              outline: `3px solid ${colors.warning[500]}`,
              outlineOffset: '2px',
            },
          }}
        >
          {link.label}
        </Link>
      ))}
    </Box>
  );
}
