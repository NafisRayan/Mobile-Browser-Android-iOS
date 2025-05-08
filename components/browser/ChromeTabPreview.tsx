import { StyleSheet, Text, View, TouchableOpacity, Image, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { theme } from '@/styles/theme';
import { Globe, X } from 'lucide-react-native';
import { useResponsiveSize } from '@/hooks/useResponsiveSize';

interface ChromeTabPreviewProps {
  title: string;
  url: string;
  isActive: boolean;
  onPress: () => void;
  onClose: () => void;
  favicon?: string;
  isPrivateMode: boolean;
}

export function ChromeTabPreview({
  title,
  url,
  isActive,
  onPress,
  onClose,
  favicon,
  isPrivateMode
}: ChromeTabPreviewProps) {
  const { isTablet, isDesktop, getIconSize, getFontSize } = useResponsiveSize();

  // Format URL for display
  const displayUrl = url
    ? url
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .split('/')[0]
    : '';

  // Get responsive values
  const iconSize = getIconSize(16);
  const fontSize = getFontSize(14);
  const domainFontSize = getFontSize(14);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isPrivateMode && styles.privateContainer,
        isTablet && styles.tabletContainer,
        isDesktop && styles.desktopContainer
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={iconSize} color={isPrivateMode ? theme.colors.neutral[700] : theme.colors.neutral[600]} />
        </TouchableOpacity>

        <View style={styles.preview}>
          {/* This would be a thumbnail preview in a real implementation */}
          <View style={[
            styles.thumbnailPlaceholder,
            isPrivateMode && styles.privateThumbnailPlaceholder
          ]}>
            <View style={styles.faviconOverlay}>
              {favicon ? (
                <Image
                  source={{ uri: favicon }}
                  style={styles.favicon}
                />
              ) : (
                <Globe
                  size={iconSize}
                  color={isPrivateMode ? theme.colors.neutral[700] : theme.colors.neutral[600]}
                />
              )}
            </View>
            <Text style={[
              styles.domainText,
              isPrivateMode && styles.privateText,
              { fontSize: domainFontSize }
            ]}>
              {displayUrl}
            </Text>
          </View>
        </View>

        <Text
          style={[
            styles.title,
            isPrivateMode && styles.privateText,
            { fontSize }
          ]}
          numberOfLines={1}
        >
          {title || 'New Tab'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral[100], // Use theme color
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    margin: theme.spacing.xs,
    height: 160, // Consider making this responsive if needed
    ...theme.shadows.sm,
  } as ViewStyle,
  tabletContainer: {
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  desktopContainer: {
    borderRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  privateContainer: {
    backgroundColor: theme.colors.neutral[200], // Slightly lighter for private
  } as ViewStyle,
  content: {
    flex: 1,
    flexDirection: 'column',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: theme.colors.neutral[500] + '40', // Semi-transparent dark
    zIndex: 10,
  },
  favicon: {
    width: 16,
    height: 16,
    borderRadius: theme.radius.sm / 2,
  } as ImageStyle,
  preview: {
    flex: 1,
  },
  thumbnailPlaceholder: {
    flex: 1,
    backgroundColor: theme.colors.neutral[50], // Darker background for placeholder
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    position: 'relative',
  } as ViewStyle,
  privateThumbnailPlaceholder: {
    backgroundColor: theme.colors.neutral[100],
  } as ViewStyle,
  faviconOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    backgroundColor: theme.colors.neutral[200] + 'CC', // Semi-transparent light dark
    borderRadius: theme.radius.full,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  domainText: {
    color: theme.colors.neutral[600],
    textAlign: 'center',
    padding: theme.spacing.sm,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.neutral[200] + 'CC', // Semi-transparent light dark
    fontFamily: theme.typography.families.sans,
  } as TextStyle,
  title: {
    color: theme.colors.neutral[700],
    marginHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.xs,
    fontFamily: theme.typography.families.sansMedium,
    fontSize: theme.typography.sizes.xs, // Adjusted size
  } as TextStyle,
  privateText: {
    color: theme.colors.neutral[600],
  } as TextStyle,
});
