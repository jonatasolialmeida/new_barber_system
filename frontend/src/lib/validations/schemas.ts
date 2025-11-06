/**
 * Validation Schemas - Esquemas de validação com Zod
 *
 * Schemas reutilizáveis para validação de formulários.
 */

import { z } from 'zod';

// ============================================================================
// SCHEMAS BÁSICOS
// ============================================================================

export const emailSchema = z
  .string()
  .min(1, 'Email é obrigatório')
  .email('Email inválido');

export const passwordSchema = z
  .string()
  .min(8, 'Senha deve ter pelo menos 8 caracteres')
  .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
  .regex(/[0-9]/, 'Senha deve conter pelo menos um número');

export const phoneSchema = z
  .string()
  .min(1, 'Telefone é obrigatório')
  .regex(
    /^\(?([0-9]{2})\)?[-. ]?([0-9]{4,5})[-. ]?([0-9]{4})$/,
    'Telefone inválido. Use o formato: (11) 98765-4321'
  );

export const cpfSchema = z
  .string()
  .min(1, 'CPF é obrigatório')
  .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido. Use o formato: 123.456.789-00');

export const cepSchema = z
  .string()
  .min(1, 'CEP é obrigatório')
  .regex(/^\d{5}-?\d{3}$/, 'CEP inválido. Use o formato: 12345-678');

export const nameSchema = z
  .string()
  .min(2, 'Nome deve ter pelo menos 2 caracteres')
  .max(100, 'Nome muito longo');

export const dateSchema = z
  .string()
  .min(1, 'Data é obrigatória')
  .refine((date) => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  }, 'Data inválida');

export const futureeDateSchema = dateSchema.refine((date) => {
  const parsed = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parsed >= today;
}, 'Data deve ser hoje ou futura');

export const urlSchema = z
  .string()
  .url('URL inválida')
  .optional()
  .or(z.literal(''));

// ============================================================================
// SCHEMAS DE FORMULÁRIOS
// ============================================================================

/**
 * Login Form
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Senha é obrigatória'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Register Form
 */
export const registerSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'Você deve aceitar os termos de uso',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Profile Form
 */
export const profileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  cpf: cpfSchema.optional().or(z.literal('')),
  birthDate: dateSchema.optional().or(z.literal('')),
  address: z.object({
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    cep: cepSchema.optional().or(z.literal('')),
  }).optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

/**
 * Appointment Form
 */
export const appointmentSchema = z.object({
  serviceId: z.string().min(1, 'Selecione um serviço'),
  barberId: z.string().min(1, 'Selecione um barbeiro'),
  date: futureeDateSchema,
  time: z.string().min(1, 'Selecione um horário'),
  notes: z.string().max(500, 'Observações muito longas').optional(),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;

/**
 * Service Form (Admin)
 */
export const serviceSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  price: z
    .string()
    .min(1, 'Preço é obrigatório')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Preço inválido',
    }),
  duration: z
    .number()
    .min(15, 'Duração mínima é 15 minutos')
    .max(480, 'Duração máxima é 8 horas'),
  active: z.boolean().default(true),
  imageUrl: urlSchema,
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

/**
 * Contact Form
 */
export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  subject: z.string().min(3, 'Assunto deve ter pelo menos 3 caracteres'),
  message: z
    .string()
    .min(10, 'Mensagem deve ter pelo menos 10 caracteres')
    .max(1000, 'Mensagem muito longa'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

/**
 * Password Reset Form
 */
export const passwordResetSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type PasswordResetFormData = z.infer<typeof passwordResetSchema>;

/**
 * Search Form
 */
export const searchSchema = z.object({
  query: z.string().min(2, 'Digite pelo menos 2 caracteres'),
  category: z.string().optional(),
  dateFrom: dateSchema.optional(),
  dateTo: dateSchema.optional(),
});

export type SearchFormData = z.infer<typeof searchSchema>;

// ============================================================================
// VALIDADORES CUSTOMIZADOS
// ============================================================================

/**
 * Valida CPF brasileiro
 */
export function validateCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]/g, '');

  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(10))) return false;

  return true;
}

/**
 * Schema de CPF com validação completa
 */
export const cpfValidSchema = z
  .string()
  .min(1, 'CPF é obrigatório')
  .refine(validateCPF, 'CPF inválido');
