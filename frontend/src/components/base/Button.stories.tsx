import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import Button, { IconButton, ButtonGroup } from './Button';
import { AddCircle, Delete, Edit } from '@mui/icons-material';

/**
 * Button component with loading states, gradient effects, and glow animations.
 *
 * ## Features
 * - Loading state with CircularProgress
 * - Gradient variant with animated background
 * - Glow effect on hover
 * - Framer Motion animations
 * - Multiple sizes and variants
 */
const meta = {
  title: 'Components/Base/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Customized button component with enhanced visual effects and loading states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['contained', 'outlined', 'text'],
      description: 'Button variant',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Button size',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'error', 'info', 'warning'],
      description: 'Button color',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading spinner',
    },
    gradient: {
      control: 'boolean',
      description: 'Apply animated gradient background',
    },
    glow: {
      control: 'boolean',
      description: 'Add glow effect on hover',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable button',
    },
  },
  args: {
    onClick: fn(),
    children: 'Click me',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic variants
export const Primary: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'contained',
    color: 'secondary',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
  },
};

export const Text: Story = {
  args: {
    variant: 'text',
  },
};

// Sizes
export const Small: Story = {
  args: {
    size: 'small',
    variant: 'contained',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
    variant: 'contained',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    variant: 'contained',
  },
};

// States
export const Loading: Story = {
  args: {
    loading: true,
    variant: 'contained',
    children: 'Loading...',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    variant: 'contained',
  },
};

// Special effects
export const WithGradient: Story = {
  args: {
    gradient: true,
    variant: 'contained',
    children: 'Gradient Button',
  },
};

export const WithGlow: Story = {
  args: {
    glow: true,
    variant: 'contained',
    children: 'Glow Effect',
  },
};

export const GradientAndGlow: Story = {
  args: {
    gradient: true,
    glow: true,
    variant: 'contained',
    children: 'Gradient + Glow',
  },
};

// With icon
export const WithIcon: Story = {
  args: {
    icon: <AddCircle />,
    variant: 'contained',
    children: 'Add Item',
  },
};

export const WithStartIcon: Story = {
  args: {
    startIcon: <Edit />,
    variant: 'contained',
    children: 'Edit',
  },
};

// Icon Button
export const IconButtonStory: Story = {
  render: () => (
    <IconButton
      icon={<Delete />}
      ariaLabel="Delete"
      color="error"
    />
  ),
};

// Button Group
export const ButtonGroupHorizontal: Story = {
  render: () => (
    <ButtonGroup orientation="horizontal">
      <Button variant="outlined">Left</Button>
      <Button variant="outlined">Center</Button>
      <Button variant="outlined">Right</Button>
    </ButtonGroup>
  ),
};

export const ButtonGroupVertical: Story = {
  render: () => (
    <ButtonGroup orientation="vertical">
      <Button variant="outlined">Top</Button>
      <Button variant="outlined">Middle</Button>
      <Button variant="outlined">Bottom</Button>
    </ButtonGroup>
  ),
};

// Full width
export const FullWidth: Story = {
  args: {
    fullWidth: true,
    variant: 'contained',
    gradient: true,
    glow: true,
    children: 'Full Width Button',
  },
  parameters: {
    layout: 'padded',
  },
};

// Colors showcase
export const AllColors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Button variant="contained" color="primary">Primary</Button>
      <Button variant="contained" color="secondary">Secondary</Button>
      <Button variant="contained" color="success">Success</Button>
      <Button variant="contained" color="error">Error</Button>
      <Button variant="contained" color="info">Info</Button>
      <Button variant="contained" color="warning">Warning</Button>
    </div>
  ),
};
