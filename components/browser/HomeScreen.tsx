import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image, ScrollView, ViewStyle, TextStyle } from 'react-native';
import { theme } from '@/styles/theme';
import { Search, Mic, Camera } from 'lucide-react-native';
import { useBrowserContext } from '@/context/BrowserContext';
import { usePrivacyContext } from '@/context/PrivacyContext';
import { useResponsiveSize } from '@/hooks/useResponsiveSize';

interface ShortcutProps {
  title: string;
  url: string;
  icon?: string;
  onPress: () => void;
  isPrivateMode: boolean;
}

function Shortcut({ title, url, icon, onPress, isPrivateMode }: ShortcutProps) {
  return (
    <TouchableOpacity style={styles.shortcutItem} onPress={onPress}>
      <View style={[styles.shortcutIcon, isPrivateMode && styles.privateShortcutIcon]}>
        {icon ? (
          <Image source={{ uri: icon }} style={styles.shortcutIconImage} />
        ) : (
          <Text style={[styles.shortcutIconText, isPrivateMode && styles.privateShortcutIconText]}>
            {title.charAt(0).toUpperCase()}
          </Text>
        )}
      </View>
      <Text 
        style={[styles.shortcutTitle, isPrivateMode && styles.privateText]} 
        numberOfLines={1}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

interface HomeScreenProps {
  onSearch: (query: string) => void;
  onFocusSearch: () => void;
}

export function HomeScreen({ onSearch, onFocusSearch }: HomeScreenProps) {
  const { navigateToUrl, shortcuts } = useBrowserContext();
  const { isPrivateMode } = usePrivacyContext();
  const { isTablet, isDesktop } = useResponsiveSize();

  // Calculate number of columns based on screen size
  const numColumns = isDesktop ? 5 : isTablet ? 4 : 4;

  return (
    <ScrollView 
      style={[styles.container, isPrivateMode && styles.privateContainer]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Google Logo */}
      <View style={styles.logoContainer}>
        <Text style={[styles.logoText, isPrivateMode && styles.privateLogoText]}>Google</Text>
      </View>

      {/* Search Bar */}
      <TouchableOpacity 
        style={[styles.searchBar, isPrivateMode && styles.privateSearchBar]} 
        onPress={onFocusSearch}
        activeOpacity={0.8}
      >
        <Search size={20} color={theme.colors.neutral[500]} />
        <Text style={[styles.searchPlaceholder, isPrivateMode && styles.privateSearchPlaceholder]}>
          Search or type URL
        </Text>
        <View style={styles.searchBarRight}>
          <Mic size={20} color={theme.colors.neutral[500]} style={styles.searchIcon} />
          <Camera size={20} color={theme.colors.neutral[500]} />
        </View>
      </TouchableOpacity>

      {/* Shortcuts */}
      <View style={styles.shortcutsContainer}>
        <View style={styles.shortcutsGrid}>
          {shortcuts.slice(0, 8).map((shortcut, index) => (
            <Shortcut
              key={index}
              title={shortcut.title}
              url={shortcut.url}
              icon={shortcut.favicon}
              onPress={() => navigateToUrl(shortcut.url)}
              isPrivateMode={isPrivateMode}
            />
          ))}
        </View>
      </View>

      {/* Discover Section */}
      <View style={[styles.discoverSection, isPrivateMode && styles.privateDiscoverSection]}>
        <View style={styles.discoverHeader}>
          <Text style={[styles.discoverTitle, isPrivateMode && styles.privateText]}>
            Discover
          </Text>
          <TouchableOpacity>
            <Text style={[styles.discoverMore, isPrivateMode && styles.privateText]}>•••</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.discoverContent}>
          <Text style={[styles.discoverMessage, isPrivateMode && styles.privateText]}>
            Can't refresh Discover
          </Text>
          <Text style={[styles.discoverSubtext, isPrivateMode && styles.privateSubtext]}>
            Check back later for new stories
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral[50],
  },
  privateContainer: {
    backgroundColor: theme.dark.colors.background,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 24,
  },
  logoText: {
    fontSize: theme.typography.sizes['4xl'],
    fontFamily: theme.typography.families.sansBold,
    color: theme.colors.neutral[700],
  },
  privateLogoText: {
    color: theme.dark.colors.text,
  },
  searchBar: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.radius.full,
    marginHorizontal: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing['2xl'],
    ...theme.shadows.sm,
  },
  privateSearchBar: {
    backgroundColor: theme.dark.colors.surface,
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: theme.spacing.md,
    color: theme.colors.neutral[500],
    fontFamily: theme.typography.families.sans,
  },
  privateSearchPlaceholder: {
    color: theme.dark.colors.textSecondary,
  },
  searchBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: 16,
  },
  shortcutsContainer: {
    marginBottom: 24,
  },
  shortcutsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  shortcutItem: {
    width: 80,
    alignItems: 'center',
    marginBottom: 16,
  },
  shortcutIcon: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.neutral[100],
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  privateShortcutIcon: {
    backgroundColor: theme.dark.colors.surface,
  },
  shortcutIconImage: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  shortcutIconText: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: theme.typography.families.sansBold,
    color: theme.colors.neutral[600],
  } as TextStyle,
  privateShortcutIconText: {
    color: theme.colors.neutral[700],
  } as TextStyle,
  shortcutTitle: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.neutral[600],
    textAlign: 'center',
    fontFamily: theme.typography.families.sans,
  } as TextStyle,
  privateText: {
    color: theme.colors.neutral[700],
  } as TextStyle,
  discoverSection: {
    marginHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    ...theme.shadows.sm,
  } as ViewStyle,
  privateDiscoverSection: {
    backgroundColor: theme.colors.neutral[200],
  } as ViewStyle,
  discoverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  discoverTitle: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.neutral[700],
    fontFamily: theme.typography.families.sansMedium,
  } as TextStyle,
  discoverMore: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.neutral[600],
  } as TextStyle,
  discoverContent: {
    padding: 16,
    paddingTop: 0,
  },
  discoverMessage: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.neutral[700],
    marginBottom: theme.spacing.xs,
    fontFamily: theme.typography.families.sans,
  } as TextStyle,
  discoverSubtext: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.neutral[600],
    fontFamily: theme.typography.families.sans,
  } as TextStyle,
  privateSubtext: {
    color: theme.colors.neutral[500],
  } as TextStyle,
});
