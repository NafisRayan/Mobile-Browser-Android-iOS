import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native'; // StatusBar removed
import { useRouter } from 'expo-router';
import { theme as staticTheme, commonStyles } from '@/styles/theme'; // Import commonStyles and staticTheme
import { useTheme } from '@/context/ThemeContext'; // Import useTheme
import { BrowserView } from '@/components/browser/BrowserView';
import { useBrowserContext } from '@/context/BrowserContext';
import { usePrivacyContext } from '@/context/PrivacyContext';
import { ChromeAddressBar } from '@/components/browser/ChromeAddressBar';
import { ChromeBottomBar } from '@/components/browser/ChromeBottomBar';
import { ChromeMenu } from '@/components/browser/ChromeMenu';
import { HomeScreen } from '@/components/browser/HomeScreen';
import { useResponsiveSize } from '@/hooks/useResponsiveSize';
import { useSafeArea } from '@/hooks/useSafeArea';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BrowserScreen() {
  const {
    currentTab,
    tabs,
    navigation: {}, // Removed canGoBack, canGoForward
    loadInitialUrl,
    refreshPage,
    currentUrl,
    updateUrl,
    isLoading,
    addNewTab
  } = useBrowserContext();

  const { isPrivateMode, togglePrivateMode } = usePrivacyContext();
  const [menuVisible, setMenuVisible] = useState(false);
  const [addressBarFocused, setAddressBarFocused] = useState(false);
  const { isLandscape, isTablet, isDesktop } = useResponsiveSize();
  const { styles: safeAreaStyles, insets } = useSafeArea();
  const router = useRouter();
  const { isDarkMode } = useTheme(); // Get theme status
  const dynamicStyles = commonStyles(isDarkMode); // Get dynamic styles

  useEffect(() => {
    loadInitialUrl();
  }, []);

  const handleSearchPress = () => {
    // Navigate to search screen or implement search functionality
    console.log('Search pressed');
    // Example: router.navigate('/search'); 
  };

  const handleBookmarksPress = () => {
    // Navigate to bookmarks screen
    console.log('Bookmarks pressed');
    router.navigate('/bookmarks');
  };

  const handleMenuPress = () => {
    setMenuVisible(true);
  };

  const handleCloseMenu = () => {
    setMenuVisible(false);
  };

  const handleAddressBarFocus = () => {
    setAddressBarFocused(true);
  };

  const handleAddressBarBlur = () => {
    setAddressBarFocused(false);
  };

  // Determine if we should use a side-by-side layout for larger screens in landscape
  const useSideBySideLayout = (isTablet || isDesktop) && isLandscape;

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: dynamicStyles.container.base.backgroundColor },
        isPrivateMode && { backgroundColor: dynamicStyles.privateMode.backgroundColor } // Apply dynamic private background
      ]}
      edges={['left', 'right']}
    >
      {/* StatusBar is now handled in app/_layout.tsx */}

      <View style={[
        styles.browserContainer,
        useSideBySideLayout && styles.landscapeContainer,
        safeAreaStyles.safeAreaTop
      ]}>
        {useSideBySideLayout ? (
          // Side-by-side layout for tablets and desktops in landscape
          <>
            <View style={[styles.sidebarContainer, { borderRightColor: dynamicStyles.button.secondary.borderColor }]}>
              <ChromeBottomBar
                refreshPage={refreshPage}
                onSearchPress={handleSearchPress}
                onBookmarksPress={handleBookmarksPress}
                isPrivateMode={isPrivateMode}
                tabsCount={tabs.length}
                onLongPressRefresh={handleMenuPress}
              />
            </View>

            <View style={styles.mainContentContainer}>
              <ChromeAddressBar
                url={currentUrl}
                onSubmit={updateUrl}
                isLoading={isLoading}
                isPrivateMode={isPrivateMode}
                tabsCount={tabs.length}
                onMenuPress={handleMenuPress}
                onFocus={handleAddressBarFocus}
                onBlur={handleAddressBarBlur}
              />

              {!currentUrl && !addressBarFocused ? (
                <HomeScreen
                  onSearch={updateUrl}
                  onFocusSearch={handleAddressBarFocus}
                />
              ) : (
                <BrowserView
                  url={currentUrl}
                  tabId={currentTab}
                />
              )}
            </View>
          </>
        ) : (
          // Standard mobile layout
          <>
            <ChromeAddressBar
              url={currentUrl}
              onSubmit={updateUrl}
              isLoading={isLoading}
              isPrivateMode={isPrivateMode}
              tabsCount={tabs.length}
              onMenuPress={handleMenuPress}
              onFocus={handleAddressBarFocus}
              onBlur={handleAddressBarBlur}
            />

            {!currentUrl && !addressBarFocused ? (
              <HomeScreen
                onSearch={updateUrl}
                onFocusSearch={handleAddressBarFocus}
              />
            ) : (
              <BrowserView
                url={currentUrl}
                tabId={currentTab}
              />
            )}

            <View style={safeAreaStyles.safeAreaBottom}>
              <ChromeBottomBar
                refreshPage={refreshPage}
                onSearchPress={handleSearchPress}
                onBookmarksPress={handleBookmarksPress}
                isPrivateMode={isPrivateMode}
                tabsCount={tabs.length}
                onLongPressRefresh={handleMenuPress}
              />
            </View>
          </>
        )}
      </View>

      <ChromeMenu
        visible={menuVisible}
        onClose={handleCloseMenu}
        onRefresh={refreshPage}
        onNewTab={addNewTab}
        isPrivateMode={isPrivateMode}
        togglePrivateMode={togglePrivateMode}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { // Base container style, backgroundColor will be applied dynamically
    flex: 1,
  },
  // privateContainer style object removed from StyleSheet as it's now fully dynamic inline
  browserContainer: {
    flex: 1,
  },
  landscapeContainer: {
    flexDirection: 'row',
  },
  sidebarContainer: {
    width: 80,
    borderRightWidth: 1,
    // borderRightColor will be set dynamically using dynamicStyles.button.secondary.borderColor
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContentContainer: {
    flex: 1,
    flexDirection: 'column',
  },
});
