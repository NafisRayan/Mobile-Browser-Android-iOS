import { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ActivityIndicator, Text, ViewStyle, TextStyle } from 'react-native';
import { theme, commonStyles } from '@/styles/theme';
import { Search, Lock, X, Layers, MoreVertical } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useResponsiveSize } from '@/hooks/useResponsiveSize';

interface ChromeAddressBarProps {
  url: string;
  onSubmit: (url: string) => void;
  isLoading: boolean;
  isPrivateMode: boolean;
  tabsCount: number;
  onMenuPress: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function ChromeAddressBar({
  url,
  onSubmit,
  isLoading,
  isPrivateMode,
  tabsCount,
  onMenuPress,
  onFocus,
  onBlur
}: ChromeAddressBarProps) {
  const [inputValue, setInputValue] = useState(url);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const { isTablet, isDesktop, getIconSize, getFontSize, getResponsivePadding } = useResponsiveSize();

  useEffect(() => {
    if (url !== inputValue && !isFocused) {
      setInputValue(url);
    }
  }, [url]);

  const handleSubmit = () => {
    let processedUrl = inputValue.trim();
    if (processedUrl && !processedUrl.startsWith('http')) {
      if (processedUrl.includes(' ') || !processedUrl.includes('.')) {
        const searchEngine = 'https://www.google.com/search?q=';
        processedUrl = searchEngine + encodeURIComponent(processedUrl);
      } else {
        processedUrl = 'https://' + processedUrl;
      }
    }
    onSubmit(processedUrl);
    setIsFocused(false);
  };

  const handleClear = () => {
    setInputValue('');
  };

  const navigateToTabs = () => {
    router.navigate('/tabs');
  };

  const getDisplayUrl = () => {
    if (!url) return '';

    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (e) {
      return url;
    }
  };

  const isSecure = url.startsWith('https://');
  const displayUrl = isFocused ? inputValue : getDisplayUrl();

  const responsivePadding = getResponsivePadding();
  const iconSize = getIconSize(16);
  const menuIconSize = getIconSize(20);
  const fontSize = getFontSize(16);

  return (
    <View
      style={[
        styles.container,
        isPrivateMode && styles.privateContainer,
        responsivePadding
      ]}
    >
      <View style={styles.addressBarContainer}>
        <View style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          isPrivateMode && styles.privateInputContainer,
          isFocused && isPrivateMode && styles.privateInputContainerFocused,
          isTablet && styles.tabletInputContainer,
          isDesktop && styles.desktopInputContainer
        ]}>
          {isLoading ? (
            <ActivityIndicator size="small" color={isPrivateMode ? theme.colors.primary.light : theme.colors.primary.main} style={styles.icon} />
          ) : (
            <>
              {isSecure ? (
                <Lock size={iconSize} color={isPrivateMode ? theme.colors.primary.light : theme.colors.primary.main} style={styles.icon} />
              ) : (
                <Search size={iconSize} color={theme.colors.neutral[500]} style={styles.icon} />
              )}
            </>
          )}

          <TextInput
            style={[
              styles.input,
              isPrivateMode && styles.privateInput,
              !isFocused && styles.centeredInput
            ]}
            value={isFocused ? inputValue : displayUrl}
            onChangeText={setInputValue}
            onSubmitEditing={handleSubmit}
            onFocus={() => {
              setIsFocused(true);
              if (onFocus) onFocus();
            }}
            onBlur={() => {
              setIsFocused(false);
              if (onBlur) onBlur();
            }}
            placeholder="Search or type web address"
            placeholderTextColor={theme.colors.neutral[400]}
            autoCapitalize="none"
            keyboardType="url"
            returnKeyType="go"
            selectTextOnFocus
          />

          {inputValue !== '' && isFocused && (
            <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
              <X size={iconSize} color={theme.colors.neutral[500]} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.tabButton,
            isTablet && styles.tabletButton,
            isDesktop && styles.desktopButton
          ]}
          onPress={navigateToTabs}
        >
          <Layers size={menuIconSize} color={isPrivateMode ? theme.dark.colors.text : theme.colors.neutral[500]} />
          <View style={styles.tabCountBadge}>
            <Text style={styles.tabCountText}>{tabsCount}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.menuButton,
            isTablet && styles.tabletButton,
            isDesktop && styles.desktopButton
          ]}
          onPress={onMenuPress}
        >
          <MoreVertical size={menuIconSize} color={isPrivateMode ? theme.dark.colors.text : theme.colors.neutral[500]} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.neutral[50], // Dark blue
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[200],
    paddingVertical: theme.spacing.sm,
  } as ViewStyle,
  privateContainer: {
    backgroundColor: theme.colors.neutral[100], // Slightly lighter dark blue
    borderBottomColor: theme.colors.neutral[300],
  } as ViewStyle,
  addressBarContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: theme.spacing.sm,
  },
  inputContainer: {
    flex: 1,
    height: 48,
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  inputContainerFocused: {
    backgroundColor: theme.colors.neutral[50],
    ...theme.shadows.md,
  },
  privateInputContainer: {
    backgroundColor: theme.dark.colors.surface,
  },
  privateInputContainerFocused: {
    backgroundColor: theme.dark.colors.background,
  },
  tabletInputContainer: {
    height: 52,
    paddingHorizontal: theme.spacing.xl,
  },
  desktopInputContainer: {
    height: 56,
    paddingHorizontal: theme.spacing['2xl'],
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    height: '100%',
    color: theme.colors.neutral[600], // Light colored text
    fontFamily: theme.typography.families.sans,
    fontSize: theme.typography.sizes.base,
    paddingVertical: 0,
  } as TextStyle,
  centeredInput: {
    textAlign: 'center' as const,
  } as TextStyle,
  privateInput: {
    color: theme.colors.neutral[700], // Even lighter text for private mode
  } as TextStyle,
  clearButton: {
    padding: theme.spacing.xs,
  },
  tabButton: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.full,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: 'transparent',
    position: 'relative',
  } as ViewStyle,
  tabletButton: {
    width: 52,
    height: 52,
  } as ViewStyle,
  desktopButton: {
    width: 56,
    height: 56,
  } as ViewStyle,
  tabCountBadge: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs,
    backgroundColor: theme.colors.primary.dark,
    borderRadius: theme.radius.full,
    minWidth: 20,
    height: 20,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: theme.spacing.xs,
  } as ViewStyle,
  tabCountText: {
    color: theme.colors.neutral[800],
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.typography.families.sansBold,
  } as TextStyle,
  menuButton: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.full,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: 'transparent',
  } as ViewStyle,
});
