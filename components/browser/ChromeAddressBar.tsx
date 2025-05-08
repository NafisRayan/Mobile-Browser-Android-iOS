import { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ActivityIndicator, Text, ViewStyle, TextStyle } from 'react-native';
import { theme as staticTheme, commonStyles } from '@/styles/theme'; // Renamed theme to staticTheme
import { useTheme } from '@/context/ThemeContext'; // Import useTheme
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
  const { isDarkMode } = useTheme(); // Get theme status
  const dynamicStyles = commonStyles(isDarkMode); // Get dynamic styles

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
        { 
          backgroundColor: isPrivateMode ? dynamicStyles.privateMode.backgroundColor : dynamicStyles.container.base.backgroundColor,
          borderBottomColor: isPrivateMode ? (isDarkMode ? staticTheme.colors.neutral[300] : staticTheme.colors.neutral[200]) : dynamicStyles.button.secondary.borderColor, // Adjust private border
        },
        responsivePadding
      ]}
    >
      <View style={styles.addressBarContainer}>
        <View style={[
          styles.inputContainer,
          { 
            backgroundColor: isPrivateMode 
              ? (isFocused ? dynamicStyles.privateMode.backgroundColor : dynamicStyles.privateMode.backgroundColor) // Potentially different focused private bg
              : (isFocused ? dynamicStyles.input.focused.backgroundColor : dynamicStyles.input.base.backgroundColor),
            borderColor: isFocused ? dynamicStyles.input.focused.borderColor : dynamicStyles.input.base.borderColor,
            borderWidth: isFocused ? 1 : (isPrivateMode ? 1 : dynamicStyles.input.base.borderWidth) // Ensure private mode has border
          },
          isTablet && styles.tabletInputContainer,
          isDesktop && styles.desktopInputContainer
        ]}>
          {isLoading ? (
            <ActivityIndicator size="small" color={dynamicStyles.iconAccent.color} style={styles.icon} />
          ) : (
            <>
              {isSecure ? (
                <Lock size={iconSize} color={dynamicStyles.iconAccent.color} style={styles.icon} />
              ) : (
                <Search size={iconSize} color={dynamicStyles.text.secondary.color} style={styles.icon} />
              )}
            </>
          )}

          <TextInput
            style={[
              styles.input,
              { color: isPrivateMode ? dynamicStyles.text.primary.color : dynamicStyles.text.primary.color }, // Ensure private text is also themed
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
            placeholderTextColor={dynamicStyles.text.secondary.color}
            autoCapitalize="none"
            keyboardType="url"
            returnKeyType="go"
            selectTextOnFocus
          />

          {inputValue !== '' && isFocused && (
            <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
              <X size={iconSize} color={dynamicStyles.text.secondary.color} />
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
          <Layers size={menuIconSize} color={dynamicStyles.icon.color} />
          <View style={[styles.tabCountBadge, { backgroundColor: staticTheme.colors.primary.main }]}>
            <Text style={[styles.tabCountText, { color: staticTheme.colors.neutral[900] }]}>{tabsCount}</Text>
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
          <MoreVertical size={menuIconSize} color={dynamicStyles.icon.color} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { // Base styles, dynamic ones applied inline
    borderBottomWidth: 1,
    paddingVertical: staticTheme.spacing.sm,
  } as ViewStyle,
  // privateContainer removed, handled inline
  addressBarContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: staticTheme.spacing.sm,
  },
  inputContainer: { // Base styles, dynamic ones applied inline
    flex: 1,
    height: 48,
    borderRadius: staticTheme.radius.full,
    paddingHorizontal: staticTheme.spacing.lg,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  // inputContainerFocused removed, handled inline
  // privateInputContainer removed, handled inline
  // privateInputContainerFocused removed, handled inline
  tabletInputContainer: {
    height: 52,
    paddingHorizontal: staticTheme.spacing.xl,
  },
  desktopInputContainer: {
    height: 56,
    paddingHorizontal: staticTheme.spacing['2xl'],
  },
  icon: {
    marginRight: staticTheme.spacing.sm,
  },
  input: { // Base styles, dynamic color applied inline
    flex: 1,
    height: '100%',
    fontFamily: staticTheme.typography.families.sans,
    fontSize: staticTheme.typography.sizes.base,
    paddingVertical: 0,
  } as TextStyle,
  centeredInput: {
    textAlign: 'center' as const,
  } as TextStyle,
  // privateInput removed, handled inline
  clearButton: {
    padding: staticTheme.spacing.xs,
  },
  tabButton: {
    width: 48,
    height: 48,
    borderRadius: staticTheme.radius.full,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: 'transparent', // Kept transparent
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
  tabCountBadge: { // Dynamic background and text color applied inline
    position: 'absolute',
    top: staticTheme.spacing.xs,
    right: staticTheme.spacing.xs,
    borderRadius: staticTheme.radius.full,
    minWidth: 20,
    height: 20,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: staticTheme.spacing.xs,
  } as ViewStyle,
  tabCountText: { // Dynamic color applied inline
    fontSize: staticTheme.typography.sizes.xs,
    fontFamily: staticTheme.typography.families.sansBold,
  } as TextStyle,
  menuButton: {
    width: 48,
    height: 48,
    borderRadius: staticTheme.radius.full,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: 'transparent', // Kept transparent
  } as ViewStyle,
});
