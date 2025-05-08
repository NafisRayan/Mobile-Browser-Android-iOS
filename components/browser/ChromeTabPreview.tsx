import { StyleSheet, Text, View, TouchableOpacity, Image, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { theme as staticTheme, commonStyles } from '@/styles/theme'; // Renamed theme, import commonStyles
import { useTheme } from '@/context/ThemeContext'; // Import useTheme
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
  const { isDarkMode } = useTheme();
  const dynamicStyles = commonStyles(isDarkMode);

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
        { backgroundColor: isPrivateMode ? dynamicStyles.privateMode.backgroundColor : dynamicStyles.input.base.backgroundColor },
        isTablet && styles.tabletContainer,
        isDesktop && styles.desktopContainer
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.closeButton, { backgroundColor: (isDarkMode ? staticTheme.dark.colors.surface : staticTheme.light.colors.surface) + 'AA' }]}
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={iconSize} color={dynamicStyles.icon.color} />
        </TouchableOpacity>

        <View style={styles.preview}>
          {/* This would be a thumbnail preview in a real implementation */}
          <View style={[
            styles.thumbnailPlaceholder,
            { backgroundColor: isPrivateMode ? dynamicStyles.privateMode.backgroundColor : dynamicStyles.container.base.backgroundColor }
          ]}>
            <View style={[styles.faviconOverlay, { backgroundColor: (isPrivateMode ? dynamicStyles.privateMode.backgroundColor : dynamicStyles.input.base.backgroundColor) + 'CC' }]}>
              {favicon ? (
                <Image
                  source={{ uri: favicon }}
                  style={styles.favicon}
                />
              ) : (
                <Globe
                  size={iconSize}
                  color={dynamicStyles.text.secondary.color}
                />
              )}
            </View>
            <Text style={[
              styles.domainText,
              { 
                color: dynamicStyles.text.primary.color, 
                backgroundColor: (isPrivateMode ? dynamicStyles.privateMode.backgroundColor : dynamicStyles.input.base.backgroundColor) + 'CC',
                fontSize: domainFontSize 
              }
            ]}>
              {displayUrl}
            </Text>
          </View>
        </View>

        <Text
          style={[
            styles.title,
            { color: dynamicStyles.text.primary.color, fontSize }
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
  container: { // Base styles, dynamic background applied inline
    flex: 1,
    borderRadius: staticTheme.radius.md,
    overflow: 'hidden',
    margin: staticTheme.spacing.xs,
    height: 160, 
    ...staticTheme.shadows.sm,
  } as ViewStyle,
  tabletContainer: { // These could also be made dynamic if needed
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  desktopContainer: { // These could also be made dynamic if needed
    borderRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  // privateContainer removed
  content: {
    flex: 1,
    flexDirection: 'column',
    position: 'relative',
  },
  closeButton: { // Base style, dynamic background applied inline
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    zIndex: 10,
  },
  favicon: {
    width: 16,
    height: 16,
    borderRadius: staticTheme.radius.sm / 2,
  } as ImageStyle,
  preview: {
    flex: 1,
  },
  thumbnailPlaceholder: { // Base style, dynamic background applied inline
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    position: 'relative',
  } as ViewStyle,
  // privateThumbnailPlaceholder removed
  faviconOverlay: { // Base style, dynamic background applied inline
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    borderRadius: staticTheme.radius.full,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  domainText: { // Base style, dynamic color and background applied inline
    textAlign: 'center',
    padding: staticTheme.spacing.sm,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    fontFamily: staticTheme.typography.families.sans,
  } as TextStyle,
  title: { // Base style, dynamic color applied inline
    marginHorizontal: staticTheme.spacing.sm,
    marginBottom: staticTheme.spacing.sm,
    marginTop: staticTheme.spacing.xs,
    fontFamily: staticTheme.typography.families.sansMedium,
    fontSize: staticTheme.typography.sizes.xs, 
  } as TextStyle,
  // privateText removed
});
