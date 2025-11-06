import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import Input, { TextArea, SearchInput } from './Input';
import { Stack } from '@mui/material';

/**
 * Input component with validation icons, password toggle, and glassmorphism variant.
 *
 * ## Features
 * - Three variants: outlined, filled, glass
 * - Password visibility toggle
 * - Validation icons (success/error)
 * - Animated hint text
 * - Glow effect on focus
 */
const meta = {
  title: 'Components/Base/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Customized input component with validation, password toggle, and special effects.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['outlined', 'filled', 'glass'],
      description: 'Input variant',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel'],
      description: 'Input type',
    },
    showPasswordToggle: {
      control: 'boolean',
      description: 'Show password visibility toggle (requires type="password")',
    },
    showValidationIcon: {
      control: 'boolean',
      description: 'Show validation icons',
    },
    success: {
      control: 'boolean',
      description: 'Show success state',
    },
    error: {
      control: 'boolean',
      description: 'Show error state',
    },
    hint: {
      control: 'text',
      description: 'Hint text below input',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable input',
    },
    required: {
      control: 'boolean',
      description: 'Required field',
    },
  },
  args: {
    onChange: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic variants
export const Outlined: Story = {
  args: {
    variant: 'outlined',
    label: 'Email',
    placeholder: 'seu@email.com',
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    label: 'Nome',
    placeholder: 'Digite seu nome',
  },
};

export const Glass: Story = {
  args: {
    variant: 'glass',
    label: 'Username',
    placeholder: 'Digite seu username',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// With validation
export const WithValidationSuccess: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'seu@email.com',
    showValidationIcon: true,
    success: true,
    value: 'user@example.com',
  },
};

export const WithValidationError: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'seu@email.com',
    showValidationIcon: true,
    error: true,
    helperText: 'Email inválido',
    value: 'invalid-email',
  },
};

// Password input
export const Password: Story = {
  args: {
    label: 'Senha',
    type: 'password',
    placeholder: '••••••••',
    showPasswordToggle: true,
  },
};

export const PasswordWithValidation: Story = {
  args: {
    label: 'Senha',
    type: 'password',
    placeholder: '••••••••',
    showPasswordToggle: true,
    showValidationIcon: true,
    success: true,
    hint: 'Senha forte!',
    value: 'MyPassword123!',
  },
};

// With hint
export const WithHint: Story = {
  args: {
    label: 'Senha',
    type: 'password',
    placeholder: '••••••••',
    showPasswordToggle: true,
    hint: 'Mínimo 8 caracteres, com maiúscula, minúscula e número',
  },
};

// States
export const Disabled: Story = {
  args: {
    label: 'Campo desabilitado',
    placeholder: 'Não editável',
    disabled: true,
    value: 'Valor fixo',
  },
};

export const Required: Story = {
  args: {
    label: 'Campo obrigatório',
    placeholder: 'Preencha este campo',
    required: true,
  },
};

// Different types
export const EmailInput: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'seu@email.com',
    showValidationIcon: true,
  },
};

export const PhoneInput: Story = {
  args: {
    label: 'Telefone',
    type: 'tel',
    placeholder: '(11) 98765-4321',
    showValidationIcon: true,
    hint: 'Formato: (11) 98765-4321',
  },
};

export const NumberInput: Story = {
  args: {
    label: 'Idade',
    type: 'number',
    placeholder: '0',
  },
};

// TextArea
export const TextAreaStory: Story = {
  render: () => (
    <TextArea
      label="Observações"
      placeholder="Digite suas observações..."
      rows={4}
    />
  ),
};

export const TextAreaWithValidation: Story = {
  render: () => (
    <TextArea
      label="Mensagem"
      placeholder="Digite sua mensagem..."
      rows={6}
      showValidationIcon
      success
      helperText="Mensagem válida"
      value="Esta é uma mensagem de exemplo para demonstrar a validação."
    />
  ),
};

// SearchInput
export const SearchInputStory: Story = {
  render: () => (
    <SearchInput
      placeholder="Buscar..."
      onSearch={(value) => console.log('Searching:', value)}
    />
  ),
};

// Full form example
export const FormExample: Story = {
  render: () => (
    <Stack spacing={3}>
      <Input
        label="Nome completo"
        placeholder="João Silva"
        showValidationIcon
        success
        required
      />
      <Input
        label="Email"
        type="email"
        placeholder="joao@example.com"
        showValidationIcon
        success
        required
      />
      <Input
        label="Telefone"
        type="tel"
        placeholder="(11) 98765-4321"
        showValidationIcon
        hint="Formato: (11) 98765-4321"
        required
      />
      <Input
        label="Senha"
        type="password"
        placeholder="••••••••"
        showPasswordToggle
        showValidationIcon
        success
        hint="Senha forte!"
        required
      />
      <TextArea
        label="Observações"
        placeholder="Informações adicionais (opcional)"
        rows={4}
      />
    </Stack>
  ),
  parameters: {
    layout: 'padded',
  },
};

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <Stack spacing={3}>
      <Input
        variant="outlined"
        label="Outlined"
        placeholder="Default variant"
      />
      <Input
        variant="filled"
        label="Filled"
        placeholder="Filled variant"
      />
      <Input
        variant="glass"
        label="Glass"
        placeholder="Glassmorphism variant"
      />
    </Stack>
  ),
  parameters: {
    layout: 'padded',
  },
};
