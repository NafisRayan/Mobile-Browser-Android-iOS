import { StyleSheet, View, TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import { theme } from '@/styles/theme';
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
        isPrivateMode && styles.privateContainer,
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
        <Home size={iconSize} color={theme.colors.neutral[600]} />
      </TouchableOpacity>

      {/* Bookmarks Button */}
      <TouchableOpacity
        style={[styles.button, isTablet && styles.tabletButton, isDesktop && styles.desktopButton]}
        onPress={onBookmarksPress}
      >
        <Bookmark size={iconSize} color={theme.colors.neutral[600]} />
      </TouchableOpacity>

      {/* Search Button */}
      <TouchableOpacity
        style={[styles.button, isTablet && styles.tabletButton, isDesktop && styles.desktopButton]}
        onPress={onSearchPress}
      >
        <Search size={iconSize} color={theme.colors.neutral[600]} />
      </TouchableOpacity>
      
      {/* Tabs Button */}
      <TouchableOpacity
        style={[styles.tabButton, isTablet && styles.tabletButton, isDesktop && styles.desktopButton]}
        onPress={navigateToTabs}
      >
        <Layers size={iconSize} color={theme.colors.neutral[600]} />
        <View style={[styles.tabCountBadge, isTablet && styles.tabletBadge, isDesktop && styles.desktopBadge]}>
          <Text style={[styles.tabCountText, { fontSize: fontSize * 0.7 }]}>
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
        <RefreshCw size={iconSize} color={theme.colors.neutral[600]} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral[50], // Dark blue
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral[200],
  } as ViewStyle,
  tabletContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  } as ViewStyle,
  desktopContainer: {
    paddingHorizontal: theme.spacing['2xl'],
    paddingVertical: theme.spacing.md,
    justifyContent: 'center',
  } as ViewStyle,
  privateContainer: {
    backgroundColor: theme.colors.neutral[100], // Slightly lighter dark blue
    borderTopColor: theme.colors.neutral[300],
  } as ViewStyle,
  button: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.full,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: 'transparent',
  } as ViewStyle,
  tabletButton: {
    padding: theme.spacing.lg,
  } as ViewStyle,
  desktopButton: {
    padding: theme.spacing.xl,
  } as ViewStyle,
  tabButton: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.full,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: 'transparent',
    position: 'relative',
  } as ViewStyle,
  tabCountBadge: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs,
    backgroundColor: theme.colors.primary.dark,
    borderRadius: theme.radius.full,
    minWidth: 20,
    height: 20,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: theme.spacing.xs,
  } as ViewStyle,
  tabletBadge: {
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    minWidth: 22,
    height: 22,
  } as ViewStyle,
  desktopBadge: {
    top: theme.spacing.md,
    right: theme.spacing.md,
    minWidth: 24,
    height: 24,
  } as ViewStyle,
  tabCountText: {
    color: theme.colors.neutral[800],
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.typography.families.sansBold,
  } as TextStyle,
});
