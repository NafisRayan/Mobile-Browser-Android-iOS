import { StyleSheet, Text, View, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { theme as staticTheme, commonStyles } from '@/styles/theme'; // Renamed theme, import commonStyles
import { useTheme } from '@/context/ThemeContext'; // Import useTheme
import { Globe, Trash, ExternalLink } from 'lucide-react-native';

interface BookmarkItemProps {
  title: string;
  url: string;
  onPress: () => void;
  onDelete: () => void;
  isPrivateMode: boolean;
}

export function BookmarkItem({ 
  title, 
  url, 
  onPress, 
  onDelete,
  isPrivateMode
}: BookmarkItemProps) {
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
    <View 
      style={[
        styles.container,
        { backgroundColor: isPrivateMode ? dynamicStyles.privateMode.backgroundColor : dynamicStyles.input.base.backgroundColor },
        // Potentially add a border to distinguish items if backgrounds are too similar to main page bg
        // { borderColor: dynamicStyles.button.secondary.borderColor, borderWidth: 1 } 
      ]}
    >
      <TouchableOpacity 
        style={styles.content}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={[
          styles.iconContainer, 
          // Use a slightly different shade for icon background, e.g., main container background if item is surface
          { backgroundColor: isPrivateMode ? dynamicStyles.privateMode.backgroundColor : dynamicStyles.container.base.backgroundColor } 
        ]}>
          <Globe
            size={20}
            color={dynamicStyles.text.secondary.color}
          />
        </View>
        <View style={styles.textContainer}>
          <Text 
            style={[
              styles.title,
              { color: dynamicStyles.text.primary.color }
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text 
            style={[styles.url, { color: dynamicStyles.text.secondary.color }]}
            numberOfLines={1}
          >
            {displayUrl}
          </Text>
        </View>
        <ExternalLink size={16} color={dynamicStyles.text.secondary.color} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.deleteButton, { borderLeftColor: dynamicStyles.button.secondary.borderColor }]}
        onPress={onDelete}
      >
        <Trash size={16} color={staticTheme.colors.error} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { // Base styles, dynamic background applied inline
    flexDirection: 'row' as const,
    alignItems: 'center',
    borderRadius: staticTheme.radius.lg,
    marginBottom: staticTheme.spacing.md,
    ...staticTheme.shadows.sm,
  } as ViewStyle,
  // privateContainer removed
  content: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center',
    padding: staticTheme.spacing.md,
  } as ViewStyle,
  iconContainer: { // Base styles, dynamic background applied inline
    width: 36,
    height: 36,
    justifyContent: 'center' as const,
    alignItems: 'center',
    borderRadius: staticTheme.radius.md,
    marginRight: staticTheme.spacing.md,
  } as ViewStyle,
  textContainer: {
    flex: 1,
    marginRight: staticTheme.spacing.sm,
  } as ViewStyle,
  title: { // Base style, dynamic color applied inline
    fontFamily: staticTheme.typography.families.sansMedium,
    fontSize: staticTheme.typography.sizes.base,
    marginBottom: staticTheme.spacing.xs,
  } as TextStyle,
  // privateText removed
  url: { // Base style, dynamic color applied inline
    fontFamily: staticTheme.typography.families.sans,
    fontSize: staticTheme.typography.sizes.sm,
  } as TextStyle,
  deleteButton: { // Base style, dynamic border color applied inline
    padding: staticTheme.spacing.lg,
    borderLeftWidth: 1,
  } as ViewStyle,
});
