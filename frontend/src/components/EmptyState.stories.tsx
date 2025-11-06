import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import EmptyState, {
  NoAppointments,
  NoSearchResults,
  NoServices,
  NoBarbers,
  NoRevenue,
  NoReports,
  ErrorState,
  OfflineState,
} from './EmptyState';
import { AddCircle } from '@mui/icons-material';

/**
 * EmptyState component for displaying empty list states with actions.
 *
 * ## Features
 * - Multiple pre-configured states
 * - 8 illustration types
 * - 3 variants (default, card, minimal)
 * - 3 sizes (small, medium, large)
 * - Primary and secondary actions
 * - Animated icons with spring physics
 */
const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Display empty states with illustrations, descriptions, and call-to-action buttons.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    illustration: {
      control: 'select',
      options: ['search', 'appointments', 'inbox', 'error', 'offline', 'folder', 'notifications'],
      description: 'Pre-defined illustration',
    },
    variant: {
      control: 'select',
      options: ['default', 'card', 'minimal'],
      description: 'Visual variant',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Icon and text size',
    },
  },
  args: {
    title: 'No items found',
    description: 'Try adjusting your search or filters',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 600, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic usage
export const Default: Story = {
  args: {
    illustration: 'inbox',
    title: 'No items found',
    description: 'Try adjusting your search or filters',
    size: 'medium',
  },
};

// With action
export const WithAction: Story = {
  args: {
    illustration: 'appointments',
    title: 'No appointments yet',
    description: 'Create your first appointment to get started',
    action: {
      label: 'New Appointment',
      onClick: fn(),
      icon: <AddCircle />,
    },
  },
};

// With two actions
export const WithTwoActions: Story = {
  args: {
    illustration: 'search',
    title: 'No results found',
    description: 'We couldn\'t find what you\'re looking for',
    action: {
      label: 'Clear Filters',
      onClick: fn(),
    },
    secondaryAction: {
      label: 'Go Back',
      onClick: fn(),
    },
  },
};

// Variants
export const VariantDefault: Story = {
  args: {
    illustration: 'inbox',
    title: 'Default variant',
    description: 'No container, just content',
    variant: 'default',
  },
};

export const VariantCard: Story = {
  args: {
    illustration: 'inbox',
    title: 'Card variant',
    description: 'Wrapped in a Card component',
    variant: 'card',
  },
};

export const VariantMinimal: Story = {
  args: {
    illustration: 'inbox',
    title: 'Minimal variant',
    description: 'Simplified styling',
    variant: 'minimal',
  },
};

// Sizes
export const SizeSmall: Story = {
  args: {
    illustration: 'inbox',
    title: 'Small size',
    description: 'Compact empty state',
    size: 'small',
  },
};

export const SizeMedium: Story = {
  args: {
    illustration: 'inbox',
    title: 'Medium size',
    description: 'Default size for most use cases',
    size: 'medium',
  },
};

export const SizeLarge: Story = {
  args: {
    illustration: 'inbox',
    title: 'Large size',
    description: 'For prominent empty states',
    size: 'large',
  },
};

// Pre-configured states
export const NoAppointmentsStory: Story = {
  render: () => <NoAppointments onAction={fn()} />,
};

export const NoSearchResultsStory: Story = {
  render: () => <NoSearchResults />,
};

export const NoServicesStory: Story = {
  render: () => <NoServices onAction={fn()} />,
};

export const NoBarbersStory: Story = {
  render: () => <NoBarbers onAction={fn()} />,
};

export const NoRevenueStory: Story = {
  render: () => <NoRevenue />,
};

export const NoReportsStory: Story = {
  render: () => <NoReports />,
};

export const ErrorStateStory: Story = {
  render: () => (
    <ErrorState
      title="Something went wrong"
      description="We encountered an error loading the data"
      onRetry={fn()}
    />
  ),
};

export const OfflineStateStory: Story = {
  render: () => <OfflineState onRetry={fn()} />,
};

// All illustrations
export const AllIllustrations: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
      <EmptyState illustration="search" title="Search" size="small" variant="card" />
      <EmptyState illustration="appointments" title="Appointments" size="small" variant="card" />
      <EmptyState illustration="inbox" title="Inbox" size="small" variant="card" />
      <EmptyState illustration="error" title="Error" size="small" variant="card" />
      <EmptyState illustration="offline" title="Offline" size="small" variant="card" />
      <EmptyState illustration="folder" title="Folder" size="small" variant="card" />
      <EmptyState illustration="notifications" title="Notifications" size="small" variant="card" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// Real world examples
export const AppointmentsList: Story = {
  render: () => (
    <NoAppointments
      onAction={fn()}
      actionLabel="Schedule Appointment"
      size="medium"
    />
  ),
};

export const SearchPage: Story = {
  render: () => (
    <EmptyState
      illustration="search"
      title="No results found for 'haircut'"
      description="Try different keywords or check your spelling"
      variant="minimal"
      action={{
        label: 'Clear Search',
        onClick: fn(),
      }}
      secondaryAction={{
        label: 'Browse All',
        onClick: fn(),
      }}
    />
  ),
};

export const ErrorPage: Story = {
  render: () => (
    <ErrorState
      title="Failed to load appointments"
      description="We couldn't fetch your appointments. Please try again."
      onRetry={fn()}
      retryLabel="Retry"
      size="large"
    />
  ),
};
