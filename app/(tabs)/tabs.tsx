import { useState } from 'react';
import { StyleSheet, FlatList, Text, TouchableOpacity, View, TextInput, ViewStyle, TextStyle } from 'react-native'; // Removed StatusBar
import { theme as staticTheme, commonStyles } from '@/styles/theme'; // Renamed theme, import commonStyles
import { useTheme } from '@/context/ThemeContext'; // Import useTheme
import { Plus, Search } from 'lucide-react-native';
import { useBrowserContext } from '@/context/BrowserContext';
import { ChromeTabPreview } from '@/components/browser/ChromeTabPreview';
import { usePrivacyContext } from '@/context/PrivacyContext';
import { useRouter } from 'expo-router';
import { useResponsiveSize } from '@/hooks/useResponsiveSize';
import { useSafeArea } from '@/hooks/useSafeArea';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabsScreen() {
  const {
    tabs,
    currentTab,
    addNewTab,
    removeTab,
    switchToTab,
    tabsInfo
  } = useBrowserContext();

  const { isPrivateMode, togglePrivateMode } = usePrivacyContext();
  const router = useRouter();
  const { isTablet, isDesktop, getIconSize, getFontSize, getResponsivePadding } = useResponsiveSize();
  const { styles: safeAreaStyles } = useSafeArea();
  const { isDarkMode } = useTheme();
  const dynamicStyles = commonStyles(isDarkMode);

  const goBack = () => {
    router.back();
  };

  // Calculate number of columns based on screen size
  const numColumns = isDesktop ? 4 : isTablet ? 3 : 2;

  // Add a new tab button at the end of the list
  const tabsWithNewTab = [...tabs, 'new'];

  // Get responsive values
  const responsivePadding = getResponsivePadding();
  const iconSize = getIconSize(24);
  const smallIconSize = getIconSize(20);
  const fontSize = getFontSize(16);

  return (
    <SafeAreaView
      style={[
        styles.container, 
        { backgroundColor: isPrivateMode ? dynamicStyles.privateMode.backgroundColor : dynamicStyles.container.base.backgroundColor }
      ]}
      edges={['left', 'right']}
    >
      {/* StatusBar is handled by RootLayout */}

      <View style={[
        styles.header,
        { borderBottomColor: dynamicStyles.button.secondary.borderColor }, // Add border
        responsivePadding,
        safeAreaStyles.safeAreaTop
      ]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={addNewTab}
            style={[
              styles.headerButton,
              isTablet && styles.tabletButton,
              isDesktop && styles.desktopButton
            ]}
          >
            <Plus size={iconSize} color={dynamicStyles.icon.color} />
          </TouchableOpacity>

          <View style={[styles.tabCounter, { backgroundColor: dynamicStyles.input.base.backgroundColor }]}>
            <Text style={[
              styles.tabCounterText,
              { color: dynamicStyles.text.primary.color, fontSize: getFontSize(16) }
            ]}>
              {tabs.length}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.headerButton,
              isTablet && styles.tabletButton,
              isDesktop && styles.desktopButton
            ]}
          >
            <Text style={[
              styles.gridIcon,
              { color: dynamicStyles.icon.color }
            ]}>
              {/* Using a standard icon might be better, but keeping the character for now */}
              ⊞ 
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[
          styles.searchContainer, 
          { backgroundColor: isPrivateMode ? dynamicStyles.privateMode.backgroundColor : dynamicStyles.input.base.backgroundColor }
        ]}>
          <Search size={20} color={dynamicStyles.text.secondary.color} />
          <TextInput
            style={[styles.searchInput, { color: dynamicStyles.text.primary.color }]}
            placeholder="Search your tabs"
            placeholderTextColor={dynamicStyles.text.secondary.color}
          />
        </View>
      </View>

      <FlatList
        data={tabsWithNewTab}
        renderItem={({ item: tabId }) => {
          if (tabId === 'new') {
            return (
              <TouchableOpacity
                style={[
                  styles.newTabCard,
                  { 
                    backgroundColor: isPrivateMode ? dynamicStyles.privateMode.backgroundColor : dynamicStyles.input.base.backgroundColor,
                    borderColor: dynamicStyles.button.secondary.borderColor 
                  }
                ]}
                onPress={addNewTab}
              >
                <View style={styles.newTabContent}>
                  <Plus size={24} color={dynamicStyles.icon.color} />
                  <Text style={[
                    styles.newTabText,
                    { color: dynamicStyles.text.primary.color }
                  ]}>
                    New tab
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }

          return (
            <ChromeTabPreview
              key={tabId}
              title={tabsInfo[tabId]?.title || 'New Tab'}
              url={tabsInfo[tabId]?.url || ''}
              isActive={tabId === currentTab}
              onPress={() => switchToTab(tabId)}
              onClose={() => removeTab(tabId)}
              favicon={tabsInfo[tabId]?.favicon}
              isPrivateMode={isPrivateMode}
            />
          );
        }}
        keyExtractor={(item) => item}
        contentContainerStyle={[
          styles.gridContent,
          responsivePadding,
          safeAreaStyles.safeAreaBottom
        ]}
        numColumns={numColumns}
        columnWrapperStyle={styles.row}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { // Base style, background handled inline
    flex: 1,
  } as ViewStyle,
  header: {
    marginBottom: 8,
    borderBottomWidth: 1, // Added border
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabletButton: {
    width: 48,
    height: 48,
  },
  desktopButton: {
    width: 56,
    height: 56,
  },
  tabCounter: { // Base style, background handled inline
    width: 40,
    height: 40,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderRadius: staticTheme.radius.full,
  } as ViewStyle,
  tabCounterText: { // Base style, color handled inline
    fontFamily: staticTheme.typography.families.sansMedium,
  } as TextStyle,
  gridIcon: { // Base style, color handled inline
    fontSize: 24,
  } as TextStyle,
  searchContainer: { // Base style, background handled inline
    flexDirection: 'row' as const,
    alignItems: 'center',
    borderRadius: staticTheme.radius.full,
    paddingHorizontal: staticTheme.spacing.md,
    height: 48,
  } as ViewStyle,
  searchInput: { // Base style, color handled inline
    flex: 1,
    height: 48,
    paddingHorizontal: staticTheme.spacing.sm,
    fontFamily: staticTheme.typography.families.sans,
  } as TextStyle,
  newTabCard: { // Base style, background and border handled inline
    flex: 1,
    borderRadius: staticTheme.radius.md,
    margin: staticTheme.spacing.xs,
    height: 160, // Keep height or make responsive?
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 1,
  } as ViewStyle,
  newTabContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  newTabText: { // Base style, color handled inline
    marginTop: staticTheme.spacing.sm,
    fontFamily: staticTheme.typography.families.sansMedium,
  } as TextStyle,
  gridContent: {
    paddingBottom: 24,
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});
