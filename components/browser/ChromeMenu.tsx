import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, ScrollView, ViewStyle, TextStyle } from 'react-native';
import { theme } from '@/styles/theme';
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

  const iconColor = isPrivateMode ? theme.colors.neutral[700] : theme.colors.neutral[600];
  const privateIconColor = theme.colors.primary.light; // Specific color for incognito lock

  const menuItems = [
    {
      icon: <Plus size={20} color={iconColor} />,
      label: 'New tab',
      onPress: () => {
        onNewTab();
        onClose();
      }
    },
    {
      icon: <Lock size={20} color={isPrivateMode ? privateIconColor : iconColor} />,
      label: isPrivateMode ? 'Close Incognito tab' : 'New Incognito tab',
      onPress: () => {
        togglePrivateMode();
        onClose();
      }
    },
    {
      icon: <History size={20} color={iconColor} />,
      label: 'History',
      onPress: navigateToHistory
    },
    {
      icon: <Download size={20} color={iconColor} />,
      label: 'Downloads',
      onPress: navigateToDownloads
    },
    {
      icon: <Bookmark size={20} color={iconColor} />,
      label: 'Bookmarks',
      onPress: navigateToBookmarks
    },
    {
      icon: <RefreshCw size={20} color={iconColor} />,
      label: 'Refresh',
      onPress: () => {
        onRefresh();
        onClose();
      }
    },
    {
      icon: <Settings size={20} color={iconColor} />,
      label: 'Settings',
      onPress: navigateToPrivacy
    },
    {
      icon: <Info size={20} color={iconColor} />,
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
          isPrivateMode && styles.privateMenuContainer,
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
                    isPrivateMode && styles.privateText,
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Slightly darker overlay
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
  menuContainer: {
    backgroundColor: theme.colors.neutral[100], // Dark blue surface
    width: '100%',
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xl,
    borderBottomLeftRadius: theme.radius.md,
    borderBottomRightRadius: theme.radius.md,
    ...theme.shadows.lg, // Enhanced shadow for popup
  } as ViewStyle,
  privateMenuContainer: {
    backgroundColor: theme.colors.neutral[200], // Slightly lighter for private
  } as ViewStyle,
  privateText: {
    color: theme.colors.neutral[700], // Light text for private mode
  } as TextStyle,
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
    color: theme.colors.neutral[700], // Light text
    fontFamily: theme.typography.families.sans,
  } as TextStyle,
});
