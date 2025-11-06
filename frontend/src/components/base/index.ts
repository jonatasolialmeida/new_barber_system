/**
 * Base Components - Componentes base customizados
 *
 * Exporta todos os componentes base customizados para fácil importação.
 *
 * Uso:
 * ```tsx
 * import { Card, Button, Input } from '@/components/base';
 * ```
 */

export { default as Card } from './Card';
export type { CardProps } from './Card';

export { default as Button, IconButton, ButtonGroup } from './Button';
export type { ButtonProps } from './Button';

export { default as Input, TextArea, SearchInput } from './Input';
export type { InputProps } from './Input';
