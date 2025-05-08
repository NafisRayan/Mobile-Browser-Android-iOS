import { StyleSheet, Text, View, TouchableOpacity, Image, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { theme as staticTheme, commonStyles } from '@/styles/theme'; // Renamed theme, import commonStyles
import { useTheme } from '@/context/ThemeContext'; // Import useTheme
import { Globe, X } from 'lucide-react-native';

interface TabPreviewProps {
  title: string;
  url: string;
  isActive: boolean;
  onPress: () => void;
  onClose: () => void;
  favicon?: string;
  isPrivateMode: boolean;
}

export function TabPreview({ 
  title, 
  url, 
  isActive, 
  onPress, 
  onClose, 
  favicon,
  isPrivateMode
}: TabPreviewProps) {
  const { isDarkMode } = useTheme();
  const dynamicStyles = commonStyles(isDarkMode);

  // Format URL for display
  const displayUrl = url
    ? url
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .split('/')[0]
    : '';
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: isPrivateMode ? dynamicStyles.privateMode.backgroundColor : dynamicStyles.input.base.backgroundColor },
        isActive && { borderColor: dynamicStyles.iconAccent.color, borderWidth: 2 }, // Use accent for active border
        // isActive && isPrivateMode && { borderColor: dynamicStyles.iconAccent.color } // Keep accent for private active?
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={[
          styles.iconContainer, 
          { backgroundColor: isPrivateMode ? dynamicStyles.privateMode.backgroundColor : dynamicStyles.container.base.backgroundColor }
        ]}>
          {favicon ? (
            <Image source={{ uri: favicon }} style={styles.favicon} />
          ) : (
            <Globe
              size={20}
              color={dynamicStyles.text.secondary.color}
            />
          )}
        </View>
        <View style={styles.textContainer}>
          <Text 
            style={[
              styles.title,
              { color: dynamicStyles.text.primary.color }
            ]}
            numberOfLines={1}
          >
            {title || 'New Tab'}
          </Text>
          <Text 
            style={[styles.url, { color: dynamicStyles.text.secondary.color }]}
            numberOfLines={1}
          >
            {displayUrl || 'about:blank'}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.closeButton} 
        onPress={onClose}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <X size={16} color={dynamicStyles.text.secondary.color} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { // Base styles, dynamic background applied inline
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: staticTheme.radius.lg,
    padding: staticTheme.spacing.md,
    ...staticTheme.shadows.sm,
  } as ViewStyle,
  // activeContainer removed, handled inline
  // privateContainer removed, handled inline
  // privateActiveContainer removed, handled inline
  content: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center',
  } as ViewStyle,
  iconContainer: { // Base styles, dynamic background applied inline
    width: 36,
    height: 36,
    justifyContent: 'center' as const,
    alignItems: 'center',
    borderRadius: staticTheme.radius.md,
    marginRight: staticTheme.spacing.md,
  } as ViewStyle,
  favicon: {
    width: 20,
    height: 20,
    borderRadius: staticTheme.radius.sm,
  } as ImageStyle,
  textContainer: {
    flex: 1,
  } as ViewStyle,
  title: { // Base style, dynamic color applied inline
    fontFamily: staticTheme.typography.families.sansMedium,
    fontSize: staticTheme.typography.sizes.base,
    marginBottom: staticTheme.spacing.xs,
  } as TextStyle,
  // privateTitle removed
  url: { // Base style, dynamic color applied inline
    fontFamily: staticTheme.typography.families.sans,
    fontSize: staticTheme.typography.sizes.sm,
  } as TextStyle,
  closeButton: {
    padding: staticTheme.spacing.xs,
  } as ViewStyle,
});
