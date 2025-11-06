'use client';

import { useState, useEffect, useCallback } from 'react';

interface AnnouncementOptions {
  politeness?: 'polite' | 'assertive';
  clearAfter?: number; // ms
}

/**
 * useAnnouncement - Hook para announcements de leitores de tela
 *
 * Permite anunciar mensagens dinamicamente para tecnologias assistivas.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { announce, message, politeness } = useAnnouncement();
 *
 *   const handleSave = async () => {
 *     await saveData();
 *     announce('Dados salvos com sucesso', { politeness: 'assertive' });
 *   };
 *
 *   return (
 *     <>
 *       <button onClick={handleSave}>Salvar</button>
 *       <LiveRegion politeness={politeness}>{message}</LiveRegion>
 *     </>
 *   );
 * }
 * ```
 */
export function useAnnouncement() {
  const [message, setMessage] = useState('');
  const [politeness, setPoliteness] = useState<'polite' | 'assertive'>('polite');

  const announce = useCallback((
    text: string,
    options: AnnouncementOptions = {}
  ) => {
    const { politeness: p = 'polite', clearAfter = 5000 } = options;

    setPoliteness(p);
    setMessage(text);

    if (clearAfter > 0) {
      setTimeout(() => setMessage(''), clearAfter);
    }
  }, []);

  const clear = useCallback(() => {
    setMessage('');
  }, []);

  return {
    announce,
    clear,
    message,
    politeness,
  };
}

/**
 * useKeyboardShortcut - Hook para atalhos de teclado acessíveis
 *
 * @example
 * ```tsx
 * useKeyboardShortcut({
 *   key: 's',
 *   ctrl: true,
 *   callback: () => saveData(),
 *   description: 'Salvar dados',
 * });
 * ```
 */
interface KeyboardShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  callback: () => void;
  description?: string;
  enabled?: boolean;
}

export function useKeyboardShortcut(config: KeyboardShortcutConfig) {
  const {
    key,
    ctrl = false,
    shift = false,
    alt = false,
    callback,
    enabled = true,
  } = config;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const matches =
        e.key.toLowerCase() === key.toLowerCase() &&
        e.ctrlKey === ctrl &&
        e.shiftKey === shift &&
        e.altKey === alt;

      if (matches) {
        e.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, ctrl, shift, alt, callback, enabled]);
}

/**
 * useFocusManagement - Hook para gerenciar foco
 *
 * @example
 * ```tsx
 * const { focusElement, saveFocus, restoreFocus } = useFocusManagement();
 *
 * const openModal = () => {
 *   saveFocus();
 *   setModalOpen(true);
 * };
 *
 * const closeModal = () => {
 *   setModalOpen(false);
 *   restoreFocus();
 * };
 * ```
 */
export function useFocusManagement() {
  const [savedFocus, setSavedFocus] = useState<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    setSavedFocus(document.activeElement as HTMLElement);
  }, []);

  const restoreFocus = useCallback(() => {
    if (savedFocus) {
      savedFocus.focus();
      setSavedFocus(null);
    }
  }, [savedFocus]);

  const focusElement = useCallback((selector: string) => {
    const element = document.querySelector<HTMLElement>(selector);
    if (element) {
      element.focus();
    }
  }, []);

  const focusFirstInteractive = useCallback((container?: HTMLElement) => {
    const root = container || document.body;
    const selector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const element = root.querySelector<HTMLElement>(selector);
    if (element) {
      element.focus();
    }
  }, []);

  return {
    saveFocus,
    restoreFocus,
    focusElement,
    focusFirstInteractive,
  };
}

/**
 * useMediaQuery - Hook para detectar media queries (acessibilidade)
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
 * const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
 * const prefersHighContrast = useMediaQuery('(prefers-contrast: high)');
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/**
 * usePrefersReducedMotion - Hook para detectar preferência de movimento reduzido
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = usePrefersReducedMotion();
 *
 * <motion.div
 *   animate={prefersReducedMotion ? {} : { scale: [1, 1.2, 1] }}
 * >
 *   Conteúdo
 * </motion.div>
 * ```
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
