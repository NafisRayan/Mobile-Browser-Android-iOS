import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, StyleSheet } from 'react-native';

/**
 * A hook that provides safe area insets and styles for proper device edge handling
 * 
 * @returns Object with insets and utility styles
 */
export function useSafeArea() {
  // Get safe area insets from react-native-safe-area-context
  const insets = useSafeAreaInsets();
  
  // Create styles for safe area padding
  const styles = StyleSheet.create({
    // Safe area padding for the entire screen
    safeArea: {
      flex: 1,
      // Only apply padding to the areas with insets
      paddingTop: insets.top > 0 ? insets.top : 0,
      paddingBottom: insets.bottom > 0 ? insets.bottom : 0,
      paddingLeft: insets.left > 0 ? insets.left : 0,
      paddingRight: insets.right > 0 ? insets.right : 0,
    },
    // Safe area padding for just the top (status bar)
    safeAreaTop: {
      paddingTop: insets.top > 0 ? insets.top : 0,
    },
    // Safe area padding for just the bottom (home indicator/navigation bar)
    safeAreaBottom: {
      paddingBottom: insets.bottom > 0 ? insets.bottom : 0,
    },
    // Safe area padding for the sides (for notched devices)
    safeAreaHorizontal: {
      paddingLeft: insets.left > 0 ? insets.left : 0,
      paddingRight: insets.right > 0 ? insets.right : 0,
    },
    // Safe area margin for the top
    safeAreaMarginTop: {
      marginTop: insets.top > 0 ? insets.top : 0,
    },
    // Safe area margin for the bottom
    safeAreaMarginBottom: {
      marginBottom: insets.bottom > 0 ? insets.bottom : 0,
    },
    // Edge-to-edge container that respects safe areas
    edgeToEdgeContainer: {
      flex: 1,
      // No padding, content will go edge-to-edge
    },
    // Content that should be positioned below the status bar
    contentBelowStatusBar: {
      marginTop: insets.top,
    },
    // Content that should be positioned above the bottom navigation bar/home indicator
    contentAboveNavBar: {
      marginBottom: insets.bottom,
    },
  });
  
  return {
    insets,
    styles,
    // Helper function to get dynamic safe area styles
    getSafeAreaStyle: (options: { 
      top?: boolean; 
      bottom?: boolean; 
      horizontal?: boolean;
      addTop?: number;
      addBottom?: number;
    } = {}) => {
      const { top = true, bottom = true, horizontal = true, addTop = 0, addBottom = 0 } = options;
      
      return {
        paddingTop: top ? (insets.top + addTop) : addTop,
        paddingBottom: bottom ? (insets.bottom + addBottom) : addBottom,
        paddingLeft: horizontal ? insets.left : 0,
        paddingRight: horizontal ? insets.right : 0,
      };
    },
    // Helper to check if device has a notch
    hasNotch: insets.top > 20,
    // Helper to check if device has a home indicator or navigation bar
    hasHomeIndicator: insets.bottom > 0,
  };
}
