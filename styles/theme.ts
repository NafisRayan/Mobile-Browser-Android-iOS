export const theme = {
  colors: {
    // Primary Colors
    primary: {
      main: '#3b82f6', // Bright blue
      light: '#60a5fa', // Light blue for accents
      dark: '#2563eb',
    },
    // Neutral Colors - Dark Theme (Black base)
    neutral: {
      50: '#000000',  // Pure black background
      100: '#111111', // Off-black
      200: '#222222', // Borders, dividers
      300: '#333333', // Disabled states
      400: '#555555', // Placeholder text
      500: '#888888', // Secondary text
      600: '#cccccc', // Primary text
      700: '#dddddd', // Headers
      800: '#eeeeee', // Light text
      900: '#ffffff', // Pure white - Brightest text & icons
    },
    // Semantic Colors
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6', // Should this be primary.main or primary.light? Keeping main for now.
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

  // Shadows - Keep as is, shadow color is black, works for both themes
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

  // Light Theme
  light: {
    colors: {
      background: '#ffffff', // Pure white background
      surface: '#f8fafc',   // Slightly off-white for surfaces like cards
      text: '#000000',      // Pure black text
      textSecondary: '#555555', // Dark gray for secondary text
      border: '#e2e8f0',    // Light gray for borders
      primaryAccent: '#60a5fa', // Light blue for accents
      privateBackground: '#f0f0f0', // Very light gray for private mode in light theme
    },
  },

  // Dark Theme (explicitly defined for clarity, though neutral serves this purpose)
  dark: {
    colors: {
      background: '#000000', // Pure black background
      surface: '#111111',   // Off-black for surfaces
      text: '#ffffff',      // Pure white text
      textSecondary: '#bbbbbb', // Light gray for secondary text
      border: '#333333',    // Dark gray for borders
      primaryAccent: '#60a5fa', // Light blue for accents
      privateBackground: '#0a0a0a', // Very dark gray (near black) for private mode in dark theme
    },
  },
} as const;

  // Common styles that can be reused across components
export const commonStyles = (isDarkMode: boolean) => {
  const currentThemeColors = isDarkMode ? theme.dark.colors : theme.light.colors;
  const baseNeutralColors = theme.colors.neutral; // For dark mode specific neutral shades if needed
  const primaryColors = theme.colors.primary;

  return {
    // Add private mode specific styles here if they are common
    privateMode: {
      backgroundColor: currentThemeColors.privateBackground,
      // Potentially other private mode specific styles like text color if needed
      // privateTextColor: isDarkMode ? '#c0c0c0' : '#404040',
    },
    // Container styles
    container: {
      base: {
        flex: 1,
        backgroundColor: currentThemeColors.background,
      },
    },

    // Input styles
    input: {
      base: {
        height: 48,
        backgroundColor: currentThemeColors.surface,
        borderRadius: theme.radius.full,
        paddingHorizontal: theme.spacing.lg,
        fontFamily: theme.typography.families.sans,
        fontSize: theme.typography.sizes.base,
        color: currentThemeColors.text,
        borderColor: currentThemeColors.border,
        borderWidth: 1,
      },
      focused: {
        backgroundColor: isDarkMode ? baseNeutralColors[200] : theme.light.colors.surface, // Darker for dark, same for light
        borderColor: primaryColors.light, // Accent color for focus
        ...theme.shadows.sm, // Subtle shadow on focus
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
        backgroundColor: primaryColors.main,
        // Text color for primary button should contrast with primary.main
        // Assuming white text for primary buttons in both themes for simplicity
        // This might need adjustment based on primary.main's brightness
        color: theme.colors.neutral[900], // White text
      },
      secondary: {
        backgroundColor: currentThemeColors.surface,
        borderColor: currentThemeColors.border,
        borderWidth: 1,
        // Text color for secondary button
        color: currentThemeColors.text,
      },
      accent: { // For buttons that need the light blue accent
        backgroundColor: currentThemeColors.primaryAccent,
        color: isDarkMode ? theme.dark.colors.text : theme.light.colors.text, // Ensure contrast
      }
    },
    // Text styles
    text: {
      primary: {
        color: currentThemeColors.text,
        fontFamily: theme.typography.families.sans,
        fontSize: theme.typography.sizes.base,
      },
      secondary: {
        color: currentThemeColors.textSecondary,
        fontFamily: theme.typography.families.sans,
        fontSize: theme.typography.sizes.sm,
      },
      header: {
        color: currentThemeColors.text,
        fontFamily: theme.typography.families.sansBold,
        fontSize: theme.typography.sizes.xl,
      },
      accent: {
        color: currentThemeColors.primaryAccent,
      }
    },
    // Icon styles
    icon: {
      color: currentThemeColors.text, // Default icon color
    },
    iconAccent: {
      color: currentThemeColors.primaryAccent, // Light blue icon color
    }
  };
};
