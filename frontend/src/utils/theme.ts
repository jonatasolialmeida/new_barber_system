import { createTheme, ThemeOptions } from '@mui/material/styles';
import { colors, typography, borderRadius, shadows, transitions } from '@/styles/designTokens';

// Configuração do tema claro
const lightThemeConfig: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary[600],
      light: colors.primary[400],
      dark: colors.primary[800],
      contrastText: colors.white,
    },
    secondary: {
      main: colors.secondary[600],
      light: colors.secondary[400],
      dark: colors.secondary[800],
      contrastText: colors.white,
    },
    success: {
      main: colors.success[600],
      light: colors.success[400],
      dark: colors.success[800],
    },
    error: {
      main: colors.error[600],
      light: colors.error[400],
      dark: colors.error[800],
    },
    warning: {
      main: colors.warning[600],
      light: colors.warning[400],
      dark: colors.warning[800],
    },
    info: {
      main: colors.info[600],
      light: colors.info[400],
      dark: colors.info[800],
    },
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
    text: {
      primary: colors.gray[900],
      secondary: colors.gray[700],
      disabled: colors.gray[500],
    },
    divider: colors.gray[200],
    grey: colors.gray,
  },

  typography: {
    fontFamily: typography.fontFamily.primary,
    fontSize: 16,

    h1: {
      fontSize: typography.fontSize['5xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: typography.fontSize['4xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: typography.fontSize['3xl'],
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.tight,
    },
    h4: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.normal,
    },
    h5: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.normal,
    },
    h6: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.normal,
    },
    subtitle1: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.lineHeight.relaxed,
    },
    subtitle2: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.lineHeight.normal,
    },
    body1: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.regular,
      lineHeight: typography.lineHeight.relaxed,
    },
    body2: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.regular,
      lineHeight: typography.lineHeight.normal,
    },
    button: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
      textTransform: 'none',  // Sem uppercase automático
      letterSpacing: '0.02em',
    },
    caption: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.regular,
      lineHeight: typography.lineHeight.normal,
    },
    overline: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.semibold,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
  },

  shape: {
    borderRadius: parseFloat(borderRadius.base.replace('rem', '')) * 16,  // 8px
  },

  shadows: [
    'none',
    shadows.xs,
    shadows.sm,
    shadows.base,
    shadows.base,
    shadows.md,
    shadows.md,
    shadows.lg,
    shadows.lg,
    shadows.xl,
    shadows.xl,
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
  ],

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.base,
          padding: '10px 24px',
          fontSize: typography.fontSize.base,
          fontWeight: typography.fontWeight.medium,
          textTransform: 'none',
          boxShadow: 'none',
          transition: `all ${transitions.duration.fast} ${transitions.easing.smooth}`,
          '&:hover': {
            boxShadow: shadows.md,
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: shadows.lg,
          },
        },
        sizeLarge: {
          padding: '14px 32px',
          fontSize: typography.fontSize.lg,
        },
        sizeSmall: {
          padding: '6px 16px',
          fontSize: typography.fontSize.sm,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.lg,
          boxShadow: shadows.base,
          transition: `all ${transitions.duration.normal} ${transitions.easing.smooth}`,
          '&:hover': {
            boxShadow: shadows.lg,
            transform: 'translateY(-4px)',
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.base,
        },
        elevation1: {
          boxShadow: shadows.sm,
        },
        elevation2: {
          boxShadow: shadows.base,
        },
        elevation3: {
          boxShadow: shadows.md,
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: borderRadius.base,
            transition: `all ${transitions.duration.fast} ${transitions.easing.smooth}`,
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.primary[400],
              },
            },
            '&.Mui-focused': {
              boxShadow: shadows.primaryGlow,
            },
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.md,
          fontWeight: typography.fontWeight.medium,
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.base,
        },
        standardSuccess: {
          backgroundColor: colors.success[50],
          color: colors.success[900],
        },
        standardError: {
          backgroundColor: colors.error[50],
          color: colors.error[900],
        },
        standardWarning: {
          backgroundColor: colors.warning[50],
          color: colors.warning[900],
        },
        standardInfo: {
          backgroundColor: colors.info[50],
          color: colors.info[900],
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: shadows.sm,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: borderRadius.base,
          padding: '8px 12px',
          fontSize: typography.fontSize.sm,
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: borderRadius.lg,
        },
      },
    },

    MuiBackdrop: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(4px)',
        },
      },
    },
  },
};

const theme = createTheme(lightThemeConfig);

export default theme;

// Export também um tema dark para uso futuro
export const darkTheme = createTheme({
  ...lightThemeConfig,
  palette: {
    ...lightThemeConfig.palette,
    mode: 'dark',
    background: {
      default: colors.background.dark,
      paper: colors.background.darkPaper,
    },
    text: {
      primary: colors.gray[100],
      secondary: colors.gray[400],
      disabled: colors.gray[600],
    },
    divider: colors.gray[800],
  },
});
