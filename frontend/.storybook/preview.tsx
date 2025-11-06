import type { Preview } from '@storybook/react';
import React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryProvider } from '@/components/QueryProvider';
import { ToastProvider } from '@/components/ToastProvider';
import ErrorBoundary from '@/components/ErrorBoundary';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#F5F7FA',
        },
        {
          name: 'dark',
          value: '#0A1929',
        },
      ],
    },
  },
  decorators: [
    (Story) => (
      <ErrorBoundary>
        <QueryProvider>
          <ThemeProvider>
            <ToastProvider />
            <div style={{ padding: '2rem' }}>
              <Story />
            </div>
          </ThemeProvider>
        </QueryProvider>
      </ErrorBoundary>
    ),
  ],
};

export default preview;
