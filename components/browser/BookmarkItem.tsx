import { StyleSheet, Text, View, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { theme } from '@/styles/theme';
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
        isPrivateMode && styles.privateContainer
      ]}
    >
      <TouchableOpacity 
        style={styles.content}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Globe
            size={20}
            color={isPrivateMode ? theme.dark.colors.textSecondary : theme.colors.neutral[500]}
          />
        </View>
        <View style={styles.textContainer}>
          <Text 
            style={[
              styles.title,
              isPrivateMode && styles.privateText
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text 
            style={styles.url}
            numberOfLines={1}
          >
            {displayUrl}
          </Text>
        </View>
        <ExternalLink size={16} color={theme.colors.neutral[500]} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={onDelete}
      >
        <Trash size={16} color={theme.colors.error} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    backgroundColor: theme.colors.neutral[50],
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  } as ViewStyle,
  privateContainer: {
    backgroundColor: theme.dark.colors.surface,
  } as ViewStyle,
  content: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center',
    padding: theme.spacing.md,
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
  textContainer: {
    flex: 1,
    marginRight: theme.spacing.sm,
  } as ViewStyle,
  title: {
    fontFamily: theme.typography.families.sansMedium,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing.xs,
  } as TextStyle,
  privateText: {
    color: theme.dark.colors.text,
  } as TextStyle,
  url: {
    fontFamily: theme.typography.families.sans,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.neutral[500],
  } as TextStyle,
  deleteButton: {
    padding: theme.spacing.lg,
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.neutral[200],
  } as ViewStyle,
});
