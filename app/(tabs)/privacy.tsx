import { StyleSheet, ScrollView, Text, View, Switch, TouchableOpacity, Alert, ViewStyle, TextStyle } from 'react-native';
import { theme as staticTheme, commonStyles } from '@/styles/theme'; // Renamed to staticTheme to avoid conflict
import { Shield, Lock, Cookie, Trash2, ArrowLeft, Fingerprint, Globe, Settings, Moon, Sun } from 'lucide-react-native';
import { usePrivacyContext } from '@/context/PrivacyContext';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { useSafeArea } from '@/hooks/useSafeArea';
import { useResponsiveSize } from '@/hooks/useResponsiveSize';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyScreen() {
  const {
    isPrivateMode,
    togglePrivateMode,
    adBlockingEnabled,
    toggleAdBlocking,
    cookieControlEnabled,
    toggleCookieControl,
    fingerprintProtectionEnabled,
    toggleFingerprintProtection,
    httpsOnlyEnabled,
    toggleHttpsOnly,
    scriptBlockingEnabled,
    toggleScriptBlocking,
    clearBrowsingData
  } = usePrivacyContext();

  const router = useRouter();
  const { isTablet, isDesktop, getIconSize, getFontSize, getResponsivePadding } = useResponsiveSize();
  const { styles: safeAreaStyles } = useSafeArea();
  const { isDarkMode, toggleTheme } = useTheme();

  const dynamicStyles = commonStyles(isDarkMode);

  const goBack = () => {
    router.back();
  };

  const handleClearBrowsingData = () => {
    Alert.alert(
      'Clear browsing data',
      'Are you sure you want to clear all browsing data? This will remove your history, cookies, and site data.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Clear',
          onPress: clearBrowsingData,
          style: 'destructive'
        }
      ]
    );
  };

  // Get responsive values
  const iconSize = getIconSize(20);
  const fontSize = getFontSize(16);
  const responsivePadding = getResponsivePadding();

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: dynamicStyles.container.base.backgroundColor },
        isPrivateMode && { backgroundColor: dynamicStyles.privateMode.backgroundColor } // Apply dynamic private background
      ]}
    >
      {/* StatusBar is handled by RootLayout, no need for one here */}

      <View style={[
        styles.header,
        { borderBottomColor: dynamicStyles.button.secondary.borderColor }, // Use theme border
        responsivePadding,
        safeAreaStyles.safeAreaTop
      ]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={goBack}
            style={styles.headerButton}
          >
            <ArrowLeft size={iconSize} color={dynamicStyles.text.primary.color} />
          </TouchableOpacity>

          <Text style={[
            styles.title,
            { color: dynamicStyles.text.primary.color, fontSize: getFontSize(18) },
            isPrivateMode && styles.privateText // Keep private mode distinction if needed
          ]}>
            Privacy and security
          </Text>

          <View style={styles.headerButton} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          responsivePadding,
          safeAreaStyles.safeAreaBottom
        ]}
      >
        {/* Appearance Section */}
        <View style={[styles.section, { borderBottomColor: dynamicStyles.button.secondary.borderColor }]}>
          <Text style={[styles.sectionTitle, { color: dynamicStyles.text.secondary.color }]}>
            Appearance
          </Text>
          <TouchableOpacity style={[styles.settingRow, styles.settingButton]}>
            <View style={styles.settingIcon}>
              {isDarkMode ? <Moon size={20} color={dynamicStyles.iconAccent.color} /> : <Sun size={20} color={dynamicStyles.iconAccent.color} />}
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: dynamicStyles.text.primary.color }]}>
                Dark Mode
              </Text>
              <Text style={[styles.settingDescription, { color: dynamicStyles.text.secondary.color }]}>
                {isDarkMode ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: staticTheme.colors.neutral[300], true: staticTheme.colors.primary.dark }}
              thumbColor={isDarkMode ? staticTheme.colors.primary.main : staticTheme.colors.neutral[100]} // These might need adjustment for light theme
              ios_backgroundColor={staticTheme.colors.neutral[300]}
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { borderBottomColor: dynamicStyles.button.secondary.borderColor }]}>
          <Text style={[styles.sectionTitle, { color: dynamicStyles.text.secondary.color }, isPrivateMode && styles.privateText]}>
            Basics
          </Text>

          <TouchableOpacity style={[styles.settingRow, styles.settingButton]}>
            <View style={styles.settingIcon}>
              <Lock size={20} color={isPrivateMode ? staticTheme.colors.primary.light : dynamicStyles.iconAccent.color} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: dynamicStyles.text.primary.color }, isPrivateMode && styles.privateText]}>
                Incognito
              </Text>
              <Text style={[styles.settingDescription, { color: dynamicStyles.text.secondary.color }, isPrivateMode && styles.privateDescription]}>
                {isPrivateMode
                  ? 'Currently browsing in Incognito mode'
                  : 'Browse privately'}
              </Text>
            </View>
            <Switch
              value={isPrivateMode}
              onValueChange={togglePrivateMode}
              trackColor={{ false: staticTheme.colors.neutral[300], true: staticTheme.colors.primary.dark }}
              thumbColor={isPrivateMode ? staticTheme.colors.primary.main : staticTheme.colors.neutral[100]}
              ios_backgroundColor={staticTheme.colors.neutral[300]}
            />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingRow, styles.settingButton]}>
            <View style={styles.settingIcon}>
              <Cookie size={20} color={isPrivateMode ? staticTheme.colors.primary.light : dynamicStyles.iconAccent.color} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: dynamicStyles.text.primary.color }, isPrivateMode && styles.privateText]}>
                Cookies
              </Text>
              <Text style={[styles.settingDescription, { color: dynamicStyles.text.secondary.color }, isPrivateMode && styles.privateDescription]}>
                {cookieControlEnabled ? 'Blocking third-party cookies' : 'Allow all cookies'}
              </Text>
            </View>
            <Switch
              value={cookieControlEnabled}
              onValueChange={toggleCookieControl}
              trackColor={{ false: staticTheme.colors.neutral[300], true: staticTheme.colors.primary.dark }}
              thumbColor={cookieControlEnabled ? staticTheme.colors.primary.main : staticTheme.colors.neutral[100]}
              ios_backgroundColor={staticTheme.colors.neutral[300]}
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { borderBottomColor: dynamicStyles.button.secondary.borderColor }]}>
          <Text style={[styles.sectionTitle, { color: dynamicStyles.text.secondary.color }, isPrivateMode && styles.privateText]}>
            Advanced
          </Text>

          <TouchableOpacity style={[styles.settingRow, styles.settingButton]}>
            <View style={styles.settingIcon}>
              <Shield size={20} color={isPrivateMode ? staticTheme.colors.primary.light : dynamicStyles.iconAccent.color} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: dynamicStyles.text.primary.color }, isPrivateMode && styles.privateText]}>
                Ad & Tracker Blocking
              </Text>
              <Text style={[styles.settingDescription, { color: dynamicStyles.text.secondary.color }, isPrivateMode && styles.privateDescription]}>
                {adBlockingEnabled ? 'Blocking ads and trackers' : 'Ads and trackers allowed'}
              </Text>
            </View>
            <Switch
              value={adBlockingEnabled}
              onValueChange={toggleAdBlocking}
              trackColor={{ false: staticTheme.colors.neutral[300], true: staticTheme.colors.primary.dark }}
              thumbColor={adBlockingEnabled ? staticTheme.colors.primary.main : staticTheme.colors.neutral[100]}
              ios_backgroundColor={staticTheme.colors.neutral[300]}
            />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingRow, styles.settingButton]}>
            <View style={styles.settingIcon}>
              <Globe size={20} color={isPrivateMode ? staticTheme.colors.primary.light : dynamicStyles.iconAccent.color} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: dynamicStyles.text.primary.color }, isPrivateMode && styles.privateText]}>
                HTTPS-Only Mode
              </Text>
              <Text style={[styles.settingDescription, { color: dynamicStyles.text.secondary.color }, isPrivateMode && styles.privateDescription]}>
                {httpsOnlyEnabled ? 'Only connect to secure sites' : 'Allow all connections'}
              </Text>
            </View>
            <Switch
              value={httpsOnlyEnabled}
              onValueChange={toggleHttpsOnly}
              trackColor={{ false: staticTheme.colors.neutral[300], true: staticTheme.colors.primary.dark }}
              thumbColor={httpsOnlyEnabled ? staticTheme.colors.primary.main : staticTheme.colors.neutral[100]}
              ios_backgroundColor={staticTheme.colors.neutral[300]}
            />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingRow, styles.settingButton]}>
            <View style={styles.settingIcon}>
              <Settings size={20} color={isPrivateMode ? staticTheme.colors.primary.light : dynamicStyles.iconAccent.color} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: dynamicStyles.text.primary.color }, isPrivateMode && styles.privateText]}>
                Script Blocking
              </Text>
              <Text style={[styles.settingDescription, { color: dynamicStyles.text.secondary.color }, isPrivateMode && styles.privateDescription]}>
                {scriptBlockingEnabled ? 'Blocking potentially harmful scripts' : 'Scripts allowed'}
              </Text>
            </View>
            <Switch
              value={scriptBlockingEnabled}
              onValueChange={toggleScriptBlocking}
              trackColor={{ false: staticTheme.colors.neutral[300], true: staticTheme.colors.primary.dark }}
              thumbColor={scriptBlockingEnabled ? staticTheme.colors.primary.main : staticTheme.colors.neutral[100]}
              ios_backgroundColor={staticTheme.colors.neutral[300]}
            />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingRow, styles.settingButton]}>
            <View style={styles.settingIcon}>
              <Fingerprint size={20} color={isPrivateMode ? staticTheme.colors.primary.light : dynamicStyles.iconAccent.color} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: dynamicStyles.text.primary.color }, isPrivateMode && styles.privateText]}>
                Fingerprint Protection
              </Text>
              <Text style={[styles.settingDescription, { color: dynamicStyles.text.secondary.color }, isPrivateMode && styles.privateDescription]}>
                {fingerprintProtectionEnabled ? 'Preventing browser fingerprinting' : 'Fingerprinting allowed'}
              </Text>
            </View>
            <Switch
              value={fingerprintProtectionEnabled}
              onValueChange={toggleFingerprintProtection}
              trackColor={{ false: staticTheme.colors.neutral[300], true: staticTheme.colors.primary.dark }}
              thumbColor={fingerprintProtectionEnabled ? staticTheme.colors.primary.main : staticTheme.colors.neutral[100]}
              ios_backgroundColor={staticTheme.colors.neutral[300]}
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { borderBottomColor: dynamicStyles.button.secondary.borderColor }]}>
          <Text style={[styles.sectionTitle, { color: dynamicStyles.text.secondary.color }, isPrivateMode && styles.privateText]}>
            Data
          </Text>

          <TouchableOpacity
            style={[styles.settingRow, styles.settingButton, styles.clearDataButton]}
            onPress={handleClearBrowsingData}
          >
            <View style={styles.settingIcon}>
              <Trash2 size={20} color={staticTheme.colors.error} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: dynamicStyles.text.primary.color }, isPrivateMode && styles.privateText]}>
                Clear browsing data
              </Text>
              <Text style={[styles.settingDescription, { color: dynamicStyles.text.secondary.color }, isPrivateMode && styles.privateDescription]}>
                Clear history, cookies, and site data
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { // Base container style, background color will be overridden by dynamicStyles
    flex: 1,
  } as ViewStyle,
  // privateContainer style object removed from StyleSheet as it's now fully dynamic inline
  header: {
    marginBottom: 8,
    borderBottomWidth: 1, // Added for consistency
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
  title: { // Base title style, color will be overridden
    fontFamily: staticTheme.typography.families.sansMedium,
  } as TextStyle,
  privateText: { // Style for text in private mode, color might need to be dynamic too
    color: staticTheme.colors.neutral[600], // Example: keep distinct private mode text color
  } as TextStyle,
  content: {
    paddingBottom: 24,
  },
  section: {
    paddingVertical: staticTheme.spacing.md,
    borderBottomWidth: 1,
    // borderBottomColor will be overridden by dynamicStyles
  } as ViewStyle,
  sectionTitle: { // Base section title, color will be overridden
    fontFamily: staticTheme.typography.families.sansMedium,
    fontSize: staticTheme.typography.sizes.sm,
    paddingHorizontal: staticTheme.spacing.lg,
    paddingVertical: staticTheme.spacing.sm,
    textTransform: 'uppercase',
  } as TextStyle,
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  settingButton: {
    paddingVertical: 8,
  },
  settingIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
    marginLeft: 8,
    marginRight: 16,
  },
  settingLabel: { // Base label, color will be overridden
    fontFamily: staticTheme.typography.families.sansMedium,
    fontSize: staticTheme.typography.sizes.base,
    marginBottom: 2,
  } as TextStyle,
  settingDescription: { // Base description, color will be overridden
    fontFamily: staticTheme.typography.families.sans,
    fontSize: staticTheme.typography.sizes.sm,
  } as TextStyle,
  privateDescription: { // Style for description in private mode
    color: staticTheme.colors.neutral[400], // Example: keep distinct private mode description color
  } as TextStyle,
  clearDataButton: {
    borderBottomWidth: 0,
  },
});
