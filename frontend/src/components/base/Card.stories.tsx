import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import Card from './Card';
import { CardContent, Typography, Box } from '@mui/material';
import { colors } from '@/styles/designTokens';

/**
 * Card component with multiple variants and interactive animations.
 *
 * ## Variants
 * - **elevated**: Default with shadow elevation
 * - **outlined**: Simple border without shadow
 * - **gradient**: Gradient background (customizable)
 * - **glass**: Glassmorphism effect with backdrop blur
 * - **hover**: Intense hover effect with glow
 */
const meta = {
  title: 'Components/Base/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Customized card component with variants including glassmorphism and gradient effects.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['elevated', 'outlined', 'gradient', 'glass', 'hover'],
      description: 'Card variant style',
    },
    interactive: {
      control: 'boolean',
      description: 'Enable interactive animations (scale on hover/tap)',
    },
    gradient: {
      control: 'text',
      description: 'Custom gradient (requires variant="gradient")',
    },
    glowColor: {
      control: 'color',
      description: 'Glow color for hover variant',
    },
  },
  args: {
    onClick: fn(),
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: 400, maxWidth: '100%' }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

const SampleContent = () => (
  <CardContent>
    <Typography variant="h5" gutterBottom>
      Card Title
    </Typography>
    <Typography variant="body2" color="text.secondary">
      This is a sample card with some content. It demonstrates the card styling and layout.
    </Typography>
  </CardContent>
);

// Variants
export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: <SampleContent />,
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: <SampleContent />,
  },
};

export const Gradient: Story = {
  args: {
    variant: 'gradient',
    gradient: colors.gradients.barber,
    children: (
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
          Gradient Card
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
          This card has an animated gradient background.
        </Typography>
      </CardContent>
    ),
  },
};

export const Glass: Story = {
  args: {
    variant: 'glass',
    children: <SampleContent />,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const Hover: Story = {
  args: {
    variant: 'hover',
    glowColor: colors.primary[300],
    children: <SampleContent />,
  },
};

// Interactive
export const Interactive: Story = {
  args: {
    variant: 'elevated',
    interactive: true,
    children: (
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Interactive Card
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Hover and click to see animations
        </Typography>
      </CardContent>
    ),
  },
};

export const InteractiveGlass: Story = {
  args: {
    variant: 'glass',
    interactive: true,
    children: <SampleContent />,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// Custom gradients
export const GradientSunset: Story = {
  args: {
    variant: 'gradient',
    gradient: colors.gradients.sunset,
    children: (
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
          Sunset Gradient
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
          Custom sunset gradient background
        </Typography>
      </CardContent>
    ),
  },
};

export const GradientOcean: Story = {
  args: {
    variant: 'gradient',
    gradient: colors.gradients.ocean,
    children: (
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
          Ocean Gradient
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
          Custom ocean gradient background
        </Typography>
      </CardContent>
    ),
  },
};

// Complex content
export const WithComplexContent: Story = {
  args: {
    variant: 'elevated',
    interactive: true,
    children: (
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            Dashboard Card
          </Typography>
          <Typography variant="h3" color="primary">
            42
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Total users this month
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold' }}>
            ↑ 12.5%
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            vs last month
          </Typography>
        </Box>
      </CardContent>
    ),
  },
};

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 400 }}>
      <Card variant="elevated">
        <CardContent>
          <Typography variant="h6">Elevated</Typography>
          <Typography variant="body2" color="text.secondary">
            Default card with shadow
          </Typography>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6">Outlined</Typography>
          <Typography variant="body2" color="text.secondary">
            Card with border
          </Typography>
        </CardContent>
      </Card>

      <Card variant="gradient" gradient={colors.gradients.barber}>
        <CardContent>
          <Typography variant="h6" sx={{ color: 'white' }}>Gradient</Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
            Animated gradient background
          </Typography>
        </CardContent>
      </Card>

      <Card variant="glass">
        <CardContent>
          <Typography variant="h6">Glass</Typography>
          <Typography variant="body2" color="text.secondary">
            Glassmorphism effect
          </Typography>
        </CardContent>
      </Card>

      <Card variant="hover">
        <CardContent>
          <Typography variant="h6">Hover</Typography>
          <Typography variant="body2" color="text.secondary">
            Intense hover effect with glow
          </Typography>
        </CardContent>
      </Card>
    </Box>
  ),
  parameters: {
    layout: 'padded',
  },
};
