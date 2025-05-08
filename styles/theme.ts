export const theme = {
  colors: {
    // Primary Colors
    primary: {
      main: '#3b82f6', // Bright blue
      light: '#60a5fa',
      dark: '#2563eb',
    },
    // Neutral Colors with Dark Blue Base
    neutral: {
      50: '#1e1e2e',  // Dark blue background
      100: '#252538', // Light dark blue
      200: '#2c2c42', // Borders, dividers
      300: '#383852', // Disabled states
      400: '#6e6e89', // Placeholder text
      500: '#8f8fa3', // Secondary text
      600: '#bfbfd4', // Primary text
      700: '#dcdcec', // Headers
      800: '#e8e8f5', // Light text
      900: '#f8f8ff', // Brightest text
    },
    // Semantic Colors
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  // Typography
  typography: {
    families: {
      sans: 'Inter-Regular',
      sansMedium: 'Inter-Medium',
      sansBold: 'Inter-Bold',
    },
    sizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },
  },

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
  },

  // Border Radius
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    full: 9999,
  },

  // Shadows
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 6,
    },
  },

  // Light Mode (now acting as alternate theme)
  dark: {
    colors: {
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#1e1e2e',
      textSecondary: '#6e6e89',
      border: '#e2e8f0',
    },
  },
} as const;

  // Common styles that can be reused across components
export const commonStyles = {
  // Container styles
  container: {
    base: {
      flex: 1,
      backgroundColor: theme.colors.neutral[50], // Dark blue background
    },
    dark: {
      backgroundColor: theme.dark.colors.background, // Light mode
    },
  },

  // Input styles
  input: {
    base: {
      height: 48,
      backgroundColor: theme.colors.neutral[100], // Slightly lighter dark blue
      borderRadius: theme.radius.full,
      paddingHorizontal: theme.spacing.lg,
      fontFamily: theme.typography.families.sans,
      fontSize: theme.typography.sizes.base,
      color: theme.colors.neutral[700], // Light text
    },
    dark: {
      backgroundColor: theme.dark.colors.surface,
      color: theme.dark.colors.text,
    },
    focused: {
      backgroundColor: theme.colors.neutral[200], // Even lighter dark blue when focused
      ...theme.shadows.md,
    },
    darkFocused: {
      backgroundColor: theme.dark.colors.background,
    },
  },

  // Button styles
  button: {
    base: {
      height: 48,
      borderRadius: theme.radius.full,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xl,
    },
    primary: {
      backgroundColor: theme.colors.primary.main,
    },
    secondary: {
      backgroundColor: theme.colors.neutral[200], // Slightly lighter dark blue
    },
  },
};
