import { useState } from 'react';
import { StyleSheet, FlatList, Text, TouchableOpacity, View, StatusBar, TextInput, ViewStyle, TextStyle } from 'react-native';
import { theme } from '@/styles/theme';
import { Plus, Search } from 'lucide-react-native'; // Removed ArrowLeft, Lock, Incognito
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
      style={[styles.container, isPrivateMode && styles.privateContainer]}
      edges={['left', 'right']}
    >
      {/* StatusBar is handled by RootLayout */}
      <StatusBar
        backgroundColor={isPrivateMode ? theme.colors.neutral[100] : theme.colors.neutral[50]}
        barStyle="light-content" // Always light for dark theme
      />

      <View style={[
        styles.header,
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
            <Plus size={iconSize} color={isPrivateMode ? theme.colors.neutral[700] : theme.colors.neutral[600]} />
          </TouchableOpacity>

          <View style={styles.tabCounter}>
            <Text style={[
              styles.tabCounterText,
              isPrivateMode && styles.privateText,
              { fontSize: getFontSize(16) }
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
              isPrivateMode && styles.privateText
            ]}>
              {/* Using a standard icon might be better, but keeping the character for now */}
              ⊞ 
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.searchContainer, isPrivateMode && styles.privateSearchContainer]}>
          <Search size={20} color={isPrivateMode ? theme.colors.neutral[500] : theme.colors.neutral[400]} />
          <TextInput
            style={[styles.searchInput, isPrivateMode && styles.privateSearchInput]}
            placeholder="Search your tabs"
            placeholderTextColor={isPrivateMode ? theme.colors.neutral[500] : theme.colors.neutral[400]}
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
                  isPrivateMode && styles.privateNewTabCard
                ]}
                onPress={addNewTab}
              >
                <View style={styles.newTabContent}>
                  <Plus size={24} color={isPrivateMode ? theme.colors.neutral[700] : theme.colors.neutral[600]} />
                  <Text style={[
                    styles.newTabText,
                    isPrivateMode && styles.privateText
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
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral[50],
  } as ViewStyle,
  privateContainer: {
    backgroundColor: theme.colors.neutral[100],
  } as ViewStyle,
  header: {
    marginBottom: 8,
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
  tabCounter: {
    width: 40,
    height: 40,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.radius.full,
  } as ViewStyle,
  tabCounterText: {
    fontFamily: theme.typography.families.sansMedium,
    color: theme.colors.neutral[700],
  } as TextStyle,
  gridIcon: {
    fontSize: 24,
    color: theme.colors.neutral[600],
  } as TextStyle,
  privateText: {
    color: theme.colors.neutral[600],
  } as TextStyle,
  searchContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing.md,
    height: 48,
  } as ViewStyle,
  privateSearchContainer: {
    backgroundColor: theme.colors.neutral[200],
  } as ViewStyle,
  searchInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: theme.spacing.sm,
    fontFamily: theme.typography.families.sans,
    color: theme.colors.neutral[700],
  } as TextStyle,
  privateSearchInput: {
    color: theme.colors.neutral[600],
  } as TextStyle,
  newTabCard: {
    flex: 1,
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.radius.md,
    margin: theme.spacing.xs,
    height: 160, // Keep height or make responsive?
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
  } as ViewStyle,
  privateNewTabCard: {
    backgroundColor: theme.colors.neutral[200],
    borderColor: theme.colors.neutral[300],
  } as ViewStyle,
  newTabContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  newTabText: {
    marginTop: theme.spacing.sm,
    color: theme.colors.neutral[700],
    fontFamily: theme.typography.families.sansMedium,
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
