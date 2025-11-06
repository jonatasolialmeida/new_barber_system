'use client';

import React, { useEffect, useRef } from 'react';

interface FocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
  onEscape?: () => void;
}

/**
 * FocusTrap - Componente para trapear foco dentro de modais/dialogs
 *
 * Features:
 * - Mantém foco dentro do container
 * - Suporta Tab e Shift+Tab
 * - Callback para tecla Escape
 * - Restaura foco ao desmontar
 *
 * @example
 * ```tsx
 * <FocusTrap active={isModalOpen} onEscape={() => closeModal()}>
 *   <Modal>...</Modal>
 * </FocusTrap>
 * ```
 */
export default function FocusTrap({ children, active = true, onEscape }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    // Salvar elemento com foco atual
    previouslyFocusedRef.current = document.activeElement as HTMLElement;

    // Focar primeiro elemento focável
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    // Restaurar foco ao desmontar
    return () => {
      previouslyFocusedRef.current?.focus();
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC key
      if (e.key === 'Escape' && onEscape) {
        onEscape();
        return;
      }

      // TAB key
      if (e.key === 'Tab') {
        const focusableElements = getFocusableElements();
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Shift + Tab
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        }
        // Tab
        else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [active, onEscape]);

  const getFocusableElements = (): HTMLElement[] => {
    if (!containerRef.current) return [];

    const selector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const elements = containerRef.current.querySelectorAll<HTMLElement>(selector);

    return Array.from(elements).filter(
      (element) => !element.hasAttribute('disabled') && element.offsetParent !== null
    );
  };

  return (
    <div ref={containerRef} style={{ outline: 'none' }}>
      {children}
    </div>
  );
}
