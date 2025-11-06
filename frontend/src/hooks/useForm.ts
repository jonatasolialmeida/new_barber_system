/**
 * useForm - Hook customizado para formulários
 *
 * Integra React Hook Form com Zod para validação.
 */

import { useForm as useHookForm, UseFormProps, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

interface UseFormOptions<T extends z.ZodType<any, any>> extends Omit<UseFormProps<z.infer<T>>, 'resolver'> {
  schema: T;
  onSubmit: (data: z.infer<T>) => Promise<void> | void;
  onSuccess?: (data: z.infer<T>) => void;
  onError?: (error: any) => void;
  successMessage?: string;
  errorMessage?: string;
}

/**
 * Hook customizado para gerenciamento de formulários
 *
 * Features:
 * - Validação automática com Zod
 * - Toast de sucesso/erro
 * - Estado de loading
 * - Reset após sucesso (opcional)
 *
 * @example
 * ```tsx
 * const form = useForm({
 *   schema: loginSchema,
 *   onSubmit: async (data) => {
 *     await api.login(data);
 *   },
 *   successMessage: 'Login realizado com sucesso!',
 * });
 *
 * return (
 *   <form onSubmit={form.handleSubmit}>
 *     <Input {...form.register('email')} error={form.errors.email} />
 *     <Button type="submit" loading={form.isSubmitting}>Entrar</Button>
 *   </form>
 * );
 * ```
 */
export function useForm<T extends z.ZodType<any, any>>({
  schema,
  onSubmit,
  onSuccess,
  onError,
  successMessage,
  errorMessage,
  ...options
}: UseFormOptions<T>): UseFormReturn<z.infer<T>> & {
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
} {
  const form = useHookForm<z.infer<T>>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    ...options,
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await onSubmit(data);

      if (successMessage) {
        toast.success(successMessage);
      }

      onSuccess?.(data);

      // Reset form após sucesso (opcional)
      if (options.defaultValues) {
        form.reset(options.defaultValues);
      }
    } catch (error: any) {
      console.error('Form submission error:', error);

      const message = errorMessage || error?.response?.data?.message || 'Erro ao enviar formulário';
      toast.error(message);

      onError?.(error);
    }
  });

  return {
    ...form,
    onSubmit: handleSubmit,
  };
}

/**
 * Hook para formulários com múltiplas etapas
 */
interface UseMultiStepFormOptions<T extends z.ZodType<any, any>> extends UseFormOptions<T> {
  steps: number;
}

export function useMultiStepForm<T extends z.ZodType<any, any>>({
  steps,
  ...options
}: UseMultiStepFormOptions<T>) {
  const form = useForm(options);
  const [currentStep, setCurrentStep] = React.useState(0);

  const nextStep = () => {
    if (currentStep < steps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < steps) {
      setCurrentStep(step);
    }
  };

  return {
    ...form,
    currentStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps - 1,
    progress: ((currentStep + 1) / steps) * 100,
    nextStep,
    prevStep,
    goToStep,
  };
}

// Re-export do React para uso sem import adicional
import React from 'react';
