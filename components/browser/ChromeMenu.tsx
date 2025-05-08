import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, ScrollView, ViewStyle, TextStyle } from 'react-native';
import { theme as staticTheme, commonStyles } from '@/styles/theme'; // Renamed theme, import commonStyles
import { useTheme } from '@/context/ThemeContext'; // Import useTheme
import {
  Plus,
  Bookmark,
  Download,
  Share2,
  RefreshCw,
  Info,
  Settings,
  History,
  Lock,
  X
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useResponsiveSize } from '@/hooks/useResponsiveSize';

interface ChromeMenuProps {
  visible: boolean;
  onClose: () => void;
  onRefresh: () => void;
  onNewTab: () => void;
  isPrivateMode: boolean;
  togglePrivateMode: () => void;
}

export function ChromeMenu({
  visible,
  onClose,
  onRefresh,
  onNewTab,
  isPrivateMode,
  togglePrivateMode
}: ChromeMenuProps) {
  const router = useRouter();
  const { isTablet, isDesktop, getIconSize, getFontSize } = useResponsiveSize();
  const { isDarkMode } = useTheme();
  const dynamicStyles = commonStyles(isDarkMode);

  const navigateToBookmarks = () => {
    onClose();
    router.navigate('/bookmarks');
  };

  const navigateToPrivacy = () => {
    onClose();
    router.navigate('/privacy');
  };

  const navigateToHistory = () => {
    onClose();
    router.navigate('/history');
  };

  const navigateToDownloads = () => {
    onClose();
    router.navigate('/downloads');
  };

  const navigateToHelp = () => {
    onClose();
    router.navigate('/help');
  };

  const handleShare = () => {
    // Share functionality would be implemented here
    console.log('Share pressed');
    onClose();
  };

  // Updated icon colors based on theme and private mode
  const baseIconColor = dynamicStyles.icon.color;
  const themedIconColor = isPrivateMode ? (isDarkMode ? staticTheme.dark.colors.textSecondary : staticTheme.light.colors.textSecondary) : baseIconColor;
  // For the incognito lock icon, use accent color when private mode is active, otherwise regular icon color
  const incognitoIconColor = isPrivateMode ? dynamicStyles.iconAccent.color : themedIconColor;


  const menuItems = [
    {
      icon: <Plus size={20} color={themedIconColor} />,
      label: 'New tab',
      onPress: () => {
        onNewTab();
        onClose();
      }
    },
    {
      icon: <Lock size={20} color={incognitoIconColor} />,
      label: isPrivateMode ? 'Close Incognito tab' : 'New Incognito tab',
      onPress: () => {
        togglePrivateMode();
        onClose();
      }
    },
    {
      icon: <History size={20} color={themedIconColor} />,
      label: 'History',
      onPress: navigateToHistory
    },
    {
      icon: <Download size={20} color={themedIconColor} />,
      label: 'Downloads',
      onPress: navigateToDownloads
    },
    {
      icon: <Bookmark size={20} color={themedIconColor} />,
      label: 'Bookmarks',
      onPress: navigateToBookmarks
    },
    {
      icon: <RefreshCw size={20} color={themedIconColor} />,
      label: 'Refresh',
      onPress: () => {
        onRefresh();
        onClose();
      }
    },
    {
      icon: <Settings size={20} color={themedIconColor} />,
      label: 'Settings',
      onPress: navigateToPrivacy
    },
    {
      icon: <Info size={20} color={themedIconColor} />,
      label: 'Help and feedback',
      onPress: navigateToHelp
    }
  ];

  // Get responsive values
  const iconSize = getIconSize(20);
  const fontSize = getFontSize(16);
  const headerFontSize = getFontSize(18);

  // Determine menu width based on device type
  const menuWidth = isDesktop ? '30%' : isTablet ? '50%' : '100%';

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[
          styles.menuContainer,
          { backgroundColor: isPrivateMode ? dynamicStyles.privateMode.backgroundColor : dynamicStyles.input.base.backgroundColor }, // Use themed surface
          { width: menuWidth }
        ]}>
          <ScrollView style={styles.menuItems}>
            {menuItems.map((item, index) => {
              // Replace the icon with a responsive version
              const responsiveIcon = React.cloneElement(item.icon, { size: iconSize });

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.menuItem,
                    isTablet && styles.tabletMenuItem,
                    isDesktop && styles.desktopMenuItem
                  ]}
                  onPress={item.onPress}
                >
                  <View style={[
                    styles.menuItemIcon,
                    isTablet && styles.tabletMenuItemIcon,
                    isDesktop && styles.desktopMenuItemIcon
                  ]}>
                    {responsiveIcon}
                  </View>
                  <Text style={[
                    styles.menuItemText,
                    { color: isPrivateMode ? (isDarkMode ? staticTheme.dark.colors.textSecondary : staticTheme.light.colors.textSecondary) : dynamicStyles.text.primary.color },
                    { fontSize }
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        <TouchableOpacity
          style={styles.closeOverlay}
          activeOpacity={1}
          onPress={onClose}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { // Keeping dark overlay for now, can be themed if needed
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    flexDirection: 'column',
  } as ViewStyle,
  closeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  menuContainer: { // Base styles, dynamic background applied inline
    width: '100%', // width is dynamic
    paddingTop: staticTheme.spacing.sm,
    paddingBottom: staticTheme.spacing.xl,
    borderBottomLeftRadius: staticTheme.radius.md,
    borderBottomRightRadius: staticTheme.radius.md,
    ...staticTheme.shadows.lg, 
  } as ViewStyle,
  // privateMenuContainer removed, handled inline
  // privateText removed, handled inline
  menuItems: {
    paddingHorizontal: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  tabletMenuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  desktopMenuItem: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  menuItemIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 32,
  },
  tabletMenuItemIcon: {
    marginRight: 36,
  },
  desktopMenuItemIcon: {
    marginRight: 40,
  },
  menuItemText: {
    color: staticTheme.colors.neutral[700], // Fallback, color is set dynamically inline
    fontFamily: staticTheme.typography.families.sans,
  } as TextStyle,
});
