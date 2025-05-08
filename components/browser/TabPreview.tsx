import { StyleSheet, Text, View, TouchableOpacity, Image, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { theme } from '@/styles/theme';
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
        isActive && styles.activeContainer,
        isPrivateMode && styles.privateContainer,
        isActive && isPrivateMode && styles.privateActiveContainer
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          {favicon ? (
            <Image source={{ uri: favicon }} style={styles.favicon} />
          ) : (
            <Globe
              size={20}
              color={isPrivateMode ? theme.dark.colors.textSecondary : theme.colors.neutral[500]}
            />
          )}
        </View>
        <View style={styles.textContainer}>
          <Text 
            style={[
              styles.title,
              isPrivateMode && styles.privateTitle
            ]}
            numberOfLines={1}
          >
            {title || 'New Tab'}
          </Text>
          <Text 
            style={styles.url}
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
        <X size={16} color={isPrivateMode ? theme.dark.colors.textSecondary : theme.colors.neutral[500]} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.neutral[50],
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  } as ViewStyle,
  activeContainer: {
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
  } as ViewStyle,
  privateContainer: {
    backgroundColor: theme.dark.colors.surface,
  } as ViewStyle,
  privateActiveContainer: {
    borderColor: theme.colors.success,
  } as ViewStyle,
  content: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center',
  } as ViewStyle,
  iconContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center' as const,
    alignItems: 'center',
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.radius.md,
    marginRight: theme.spacing.md,
  } as ViewStyle,
  favicon: {
    width: 20,
    height: 20,
    borderRadius: theme.radius.sm,
  } as ImageStyle,
  textContainer: {
    flex: 1,
  } as ViewStyle,
  title: {
    fontFamily: theme.typography.families.sansMedium,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing.xs,
  } as TextStyle,
  privateTitle: {
    color: theme.dark.colors.text,
  } as TextStyle,
  url: {
    fontFamily: theme.typography.families.sans,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.neutral[500],
  } as TextStyle,
  closeButton: {
    padding: theme.spacing.xs,
  } as ViewStyle,
});
