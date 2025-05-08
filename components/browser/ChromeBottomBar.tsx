import { StyleSheet, View, TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import { theme as staticTheme, commonStyles } from '@/styles/theme'; // Renamed theme, imported commonStyles
import { useTheme } from '@/context/ThemeContext'; // Import useTheme
import {
  Home,
  Bookmark, // Changed from Layers
  Search,   // Added Search icon
  Layers,   // Kept for Tabs
  RefreshCw
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useResponsiveSize } from '@/hooks/useResponsiveSize';

interface ChromeBottomBarProps {
  refreshPage: () => void;
  onSearchPress: () => void; // Added for search button
  onBookmarksPress: () => void; // Added for bookmarks button
  isPrivateMode: boolean;
  tabsCount: number;
  onLongPressRefresh?: () => void;
}

export function ChromeBottomBar({
  refreshPage,
  onSearchPress,
  onBookmarksPress,
  isPrivateMode,
  tabsCount,
  onLongPressRefresh
}: ChromeBottomBarProps) {
  const router = useRouter();
  const { isTablet, isDesktop, getIconSize, getFontSize, getResponsivePadding } = useResponsiveSize();
  const { isDarkMode } = useTheme(); // Get theme status
  const dynamicStyles = commonStyles(isDarkMode); // Get dynamic styles

  const navigateToTabs = () => {
    router.navigate('/tabs');
  };

  const navigateHome = () => {
    router.navigate('/');
  };

  const iconSize = getIconSize(24);
  const fontSize = getFontSize(12);
  const containerHeight = isDesktop ? 64 : isTablet ? 60 : 56;

  return (
    <View
      style={[
        styles.container,
        { 
          backgroundColor: isPrivateMode ? dynamicStyles.privateMode.backgroundColor : dynamicStyles.container.base.backgroundColor,
          borderTopColor: isPrivateMode ? (isDarkMode ? staticTheme.colors.neutral[300] : staticTheme.colors.neutral[200]) : dynamicStyles.button.secondary.borderColor, // Adjust private border
        },
        { height: containerHeight },
        isTablet && styles.tabletContainer,
        isDesktop && styles.desktopContainer
      ]}
    >
      {/* Home Button */}
      <TouchableOpacity
        style={[styles.button, isTablet && styles.tabletButton, isDesktop && styles.desktopButton]}
        onPress={navigateHome}
      >
        <Home size={iconSize} color={dynamicStyles.icon.color} />
      </TouchableOpacity>

      {/* Bookmarks Button */}
      <TouchableOpacity
        style={[styles.button, isTablet && styles.tabletButton, isDesktop && styles.desktopButton]}
        onPress={onBookmarksPress}
      >
        <Bookmark size={iconSize} color={dynamicStyles.icon.color} />
      </TouchableOpacity>

      {/* Search Button */}
      <TouchableOpacity
        style={[styles.button, isTablet && styles.tabletButton, isDesktop && styles.desktopButton]}
        onPress={onSearchPress}
      >
        <Search size={iconSize} color={dynamicStyles.icon.color} />
      </TouchableOpacity>
      
      {/* Tabs Button */}
      <TouchableOpacity
        style={[styles.tabButton, isTablet && styles.tabletButton, isDesktop && styles.desktopButton]}
        onPress={navigateToTabs}
      >
        <Layers size={iconSize} color={dynamicStyles.icon.color} />
        <View style={[
            styles.tabCountBadge, 
            { backgroundColor: staticTheme.colors.primary.main }, // Keeping original badge color
            isTablet && styles.tabletBadge, 
            isDesktop && styles.desktopBadge
        ]}>
          <Text style={[
              styles.tabCountText, 
              { color: staticTheme.colors.neutral[900], fontSize: fontSize * 0.7 } // Keeping original badge text color
          ]}>
            {tabsCount}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Refresh Button */}
      <TouchableOpacity
        style={[styles.button, isTablet && styles.tabletButton, isDesktop && styles.desktopButton]}
        onPress={refreshPage}
        onLongPress={onLongPressRefresh}
        delayLongPress={500}
      >
        <RefreshCw size={iconSize} color={dynamicStyles.icon.color} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { // Base styles, dynamic ones applied inline
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: staticTheme.spacing.sm,
    paddingHorizontal: staticTheme.spacing.sm,
    borderTopWidth: 1,
  } as ViewStyle,
  tabletContainer: {
    paddingHorizontal: staticTheme.spacing.lg,
    paddingVertical: staticTheme.spacing.md,
  } as ViewStyle,
  desktopContainer: {
    paddingHorizontal: staticTheme.spacing['2xl'],
    paddingVertical: staticTheme.spacing.md,
    justifyContent: 'center',
  } as ViewStyle,
  // privateContainer removed, handled inline
  button: {
    padding: staticTheme.spacing.md,
    borderRadius: staticTheme.radius.full,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: 'transparent',
  } as ViewStyle,
  tabletButton: {
    padding: staticTheme.spacing.lg,
  } as ViewStyle,
  desktopButton: {
    padding: staticTheme.spacing.xl,
  } as ViewStyle,
  tabButton: {
    padding: staticTheme.spacing.md,
    borderRadius: staticTheme.radius.full,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: 'transparent',
    position: 'relative',
  } as ViewStyle,
  tabCountBadge: { // Base styles, dynamic background and text color applied inline
    position: 'absolute',
    top: staticTheme.spacing.xs,
    right: staticTheme.spacing.xs,
    borderRadius: staticTheme.radius.full,
    minWidth: 20,
    height: 20,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: staticTheme.spacing.xs,
  } as ViewStyle,
  tabletBadge: {
    top: staticTheme.spacing.sm,
    right: staticTheme.spacing.sm,
    minWidth: 22,
    height: 22,
  } as ViewStyle,
  desktopBadge: {
    top: staticTheme.spacing.md,
    right: staticTheme.spacing.md,
    minWidth: 24,
    height: 24,
  } as ViewStyle,
  tabCountText: { // Base style, dynamic color applied inline
    fontSize: staticTheme.typography.sizes.xs, // Base size, overridden inline for badge
    fontFamily: staticTheme.typography.families.sansBold,
  } as TextStyle,
});
