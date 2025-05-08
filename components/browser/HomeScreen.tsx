import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image, ScrollView, ViewStyle, TextStyle } from 'react-native';
import { theme as staticTheme, commonStyles } from '@/styles/theme'; // Renamed theme, import commonStyles
import { useTheme } from '@/context/ThemeContext'; // Import useTheme
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

// Shortcut component needs to useTheme as well if its styles are complex enough
// For simplicity, we'll pass dynamicStyles down or make Shortcut styles more basic
function Shortcut({ title, url, icon, onPress, isPrivateMode }: ShortcutProps) {
  const { isDarkMode } = useTheme(); // Shortcut now uses theme
  const dynamicStyles = commonStyles(isDarkMode); // Get dynamic styles for Shortcut

  return (
    <TouchableOpacity style={styles.shortcutItem} onPress={onPress}>
      <View style={[
        styles.shortcutIcon, 
        { backgroundColor: isPrivateMode ? dynamicStyles.privateMode.backgroundColor : dynamicStyles.input.base.backgroundColor }
      ]}>
        {icon ? (
          <Image source={{ uri: icon }} style={styles.shortcutIconImage} />
        ) : (
          <Text style={[
            styles.shortcutIconText, 
            { color: isPrivateMode ? dynamicStyles.text.primary.color : dynamicStyles.text.primary.color }
          ]}>
            {title.charAt(0).toUpperCase()}
          </Text>
        )}
      </View>
      <Text 
        style={[
          styles.shortcutTitle, 
          { color: isPrivateMode ? dynamicStyles.text.secondary.color : dynamicStyles.text.secondary.color }
        ]} 
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
  const { isDarkMode } = useTheme(); // Get theme status
  const dynamicStyles = commonStyles(isDarkMode); // Get dynamic styles

  // Calculate number of columns based on screen size
  const numColumns = isDesktop ? 5 : isTablet ? 4 : 4;

  return (
    <ScrollView 
      style={[
        styles.container, 
        { backgroundColor: isPrivateMode ? dynamicStyles.privateMode.backgroundColor : dynamicStyles.container.base.backgroundColor }
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Google Logo */}
      <View style={styles.logoContainer}>
        <Text style={[styles.logoText, { color: dynamicStyles.text.primary.color }]}>Google</Text>
      </View>

      {/* Search Bar */}
      <TouchableOpacity 
        style={[
          styles.searchBar, 
          { backgroundColor: isPrivateMode ? dynamicStyles.privateMode.backgroundColor : dynamicStyles.input.base.backgroundColor }
        ]} 
        onPress={onFocusSearch}
        activeOpacity={0.8}
      >
        <Search size={20} color={dynamicStyles.text.secondary.color} />
        <Text style={[styles.searchPlaceholder, { color: dynamicStyles.text.secondary.color }]}>
          Search or type URL
        </Text>
        <View style={styles.searchBarRight}>
          <Mic size={20} color={dynamicStyles.text.secondary.color} style={styles.searchIcon} />
          <Camera size={20} color={dynamicStyles.text.secondary.color} />
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
              isPrivateMode={isPrivateMode} // Pass isPrivateMode
            />
          ))}
        </View>
      </View>

      {/* Discover Section */}
      <View style={[
        styles.discoverSection, 
        { backgroundColor: isPrivateMode ? dynamicStyles.privateMode.backgroundColor : dynamicStyles.input.base.backgroundColor }
      ]}>
        <View style={styles.discoverHeader}>
          <Text style={[styles.discoverTitle, { color: dynamicStyles.text.primary.color }]}>
            Discover
          </Text>
          <TouchableOpacity>
            <Text style={[styles.discoverMore, { color: dynamicStyles.text.secondary.color }]}>•••</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.discoverContent}>
          <Text style={[styles.discoverMessage, { color: dynamicStyles.text.primary.color }]}>
            Can't refresh Discover
          </Text>
          <Text style={[styles.discoverSubtext, { color: dynamicStyles.text.secondary.color }]}>
            Check back later for new stories
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { // Base style, background handled inline
    flex: 1,
  },
  // privateContainer removed
  contentContainer: {
    paddingBottom: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 24,
  },
  logoText: { // Color handled inline
    fontSize: staticTheme.typography.sizes['4xl'],
    fontFamily: staticTheme.typography.families.sansBold,
  },
  // privateLogoText removed
  searchBar: { // Base style, background handled inline
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    borderRadius: staticTheme.radius.full,
    marginHorizontal: staticTheme.spacing.lg,
    paddingHorizontal: staticTheme.spacing.lg,
    paddingVertical: staticTheme.spacing.md,
    marginBottom: staticTheme.spacing['2xl'],
    ...staticTheme.shadows.sm,
  },
  // privateSearchBar removed
  searchPlaceholder: { // Color handled inline
    flex: 1,
    marginLeft: staticTheme.spacing.md,
    fontFamily: staticTheme.typography.families.sans,
  },
  // privateSearchPlaceholder removed
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
  shortcutIcon: { // Base style, background handled inline
    width: 56,
    height: 56,
    borderRadius: staticTheme.radius.full,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: staticTheme.spacing.sm,
    ...staticTheme.shadows.sm,
  },
  // privateShortcutIcon removed
  shortcutIconImage: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  shortcutIconText: { // Color handled inline
    fontSize: staticTheme.typography.sizes.xl,
    fontFamily: staticTheme.typography.families.sansBold,
  } as TextStyle,
  // privateShortcutIconText removed
  shortcutTitle: { // Color handled inline
    fontSize: staticTheme.typography.sizes.xs,
    textAlign: 'center',
    fontFamily: staticTheme.typography.families.sans,
  } as TextStyle,
  // privateText removed (styles applied directly or via dynamicStyles)
  discoverSection: { // Base style, background handled inline
    marginHorizontal: staticTheme.spacing.lg,
    borderRadius: staticTheme.radius.lg,
    overflow: 'hidden',
    ...staticTheme.shadows.sm,
  } as ViewStyle,
  // privateDiscoverSection removed
  discoverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  discoverTitle: { // Color handled inline
    fontSize: staticTheme.typography.sizes.base,
    fontFamily: staticTheme.typography.families.sansMedium,
  } as TextStyle,
  discoverMore: { // Color handled inline
    fontSize: staticTheme.typography.sizes.base,
  } as TextStyle,
  discoverContent: {
    padding: 16,
    paddingTop: 0,
  },
  discoverMessage: { // Color handled inline
    fontSize: staticTheme.typography.sizes.sm,
    marginBottom: staticTheme.spacing.xs,
    fontFamily: staticTheme.typography.families.sans,
  } as TextStyle,
  discoverSubtext: { // Color handled inline
    fontSize: staticTheme.typography.sizes.sm,
    fontFamily: staticTheme.typography.families.sans,
  } as TextStyle,
  // privateSubtext removed
});
