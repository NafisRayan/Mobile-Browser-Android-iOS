import { StyleSheet, ScrollView, Text, View, Switch, TouchableOpacity, StatusBar, Alert, ViewStyle, TextStyle } from 'react-native';
import { theme } from '@/styles/theme';
import { Shield, Lock, Cookie, Trash2, ArrowLeft, Fingerprint, Globe, Settings } from 'lucide-react-native';
import { usePrivacyContext } from '@/context/PrivacyContext';
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
      style={[styles.container, isPrivateMode && styles.privateContainer]}
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
            onPress={goBack}
            style={styles.headerButton}
          >
            <ArrowLeft size={iconSize} color={isPrivateMode ? theme.colors.neutral[700] : theme.colors.neutral[600]} />
          </TouchableOpacity>

          <Text style={[
            styles.title,
            isPrivateMode && styles.privateText,
            { fontSize: getFontSize(18) }
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
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isPrivateMode && styles.privateText]}>
            Basics
          </Text>

          <TouchableOpacity style={[styles.settingRow, styles.settingButton]}>
            <View style={styles.settingIcon}>
              <Lock size={20} color={isPrivateMode ? theme.colors.primary.light : theme.colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, isPrivateMode && styles.privateText]}>
                Incognito
              </Text>
              <Text style={[styles.settingDescription, isPrivateMode && styles.privateDescription]}>
                {isPrivateMode
                  ? 'Currently browsing in Incognito mode'
                  : 'Browse privately'}
              </Text>
            </View>
            <Switch
              value={isPrivateMode}
              onValueChange={togglePrivateMode}
              trackColor={{ false: theme.colors.neutral[300], true: theme.colors.primary.dark }}
              thumbColor={isPrivateMode ? theme.colors.primary.main : theme.colors.neutral[100]}
            />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingRow, styles.settingButton]}>
            <View style={styles.settingIcon}>
              <Cookie size={20} color={isPrivateMode ? theme.colors.primary.light : theme.colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, isPrivateMode && styles.privateText]}>
                Cookies
              </Text>
              <Text style={[styles.settingDescription, isPrivateMode && styles.privateDescription]}>
                {cookieControlEnabled ? 'Blocking third-party cookies' : 'Allow all cookies'}
              </Text>
            </View>
            <Switch
              value={cookieControlEnabled}
              onValueChange={toggleCookieControl}
              trackColor={{ false: theme.colors.neutral[300], true: theme.colors.primary.dark }}
              thumbColor={cookieControlEnabled ? theme.colors.primary.main : theme.colors.neutral[100]}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isPrivateMode && styles.privateText]}>
            Advanced
          </Text>

          <TouchableOpacity style={[styles.settingRow, styles.settingButton]}>
            <View style={styles.settingIcon}>
              <Shield size={20} color={isPrivateMode ? theme.colors.primary.light : theme.colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, isPrivateMode && styles.privateText]}>
                Ad & Tracker Blocking
              </Text>
              <Text style={[styles.settingDescription, isPrivateMode && styles.privateDescription]}>
                {adBlockingEnabled ? 'Blocking ads and trackers' : 'Ads and trackers allowed'}
              </Text>
            </View>
            <Switch
              value={adBlockingEnabled}
              onValueChange={toggleAdBlocking}
              trackColor={{ false: theme.colors.neutral[300], true: theme.colors.primary.dark }}
              thumbColor={adBlockingEnabled ? theme.colors.primary.main : theme.colors.neutral[100]}
            />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingRow, styles.settingButton]}>
            <View style={styles.settingIcon}>
              <Globe size={20} color={isPrivateMode ? theme.colors.primary.light : theme.colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, isPrivateMode && styles.privateText]}>
                HTTPS-Only Mode
              </Text>
              <Text style={[styles.settingDescription, isPrivateMode && styles.privateDescription]}>
                {httpsOnlyEnabled ? 'Only connect to secure sites' : 'Allow all connections'}
              </Text>
            </View>
            <Switch
              value={httpsOnlyEnabled}
              onValueChange={toggleHttpsOnly}
              trackColor={{ false: theme.colors.neutral[300], true: theme.colors.primary.dark }}
              thumbColor={httpsOnlyEnabled ? theme.colors.primary.main : theme.colors.neutral[100]}
            />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingRow, styles.settingButton]}>
            <View style={styles.settingIcon}>
              <Settings size={20} color={isPrivateMode ? theme.colors.primary.light : theme.colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, isPrivateMode && styles.privateText]}>
                Script Blocking
              </Text>
              <Text style={[styles.settingDescription, isPrivateMode && styles.privateDescription]}>
                {scriptBlockingEnabled ? 'Blocking potentially harmful scripts' : 'Scripts allowed'}
              </Text>
            </View>
            <Switch
              value={scriptBlockingEnabled}
              onValueChange={toggleScriptBlocking}
              trackColor={{ false: theme.colors.neutral[300], true: theme.colors.primary.dark }}
              thumbColor={scriptBlockingEnabled ? theme.colors.primary.main : theme.colors.neutral[100]}
            />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingRow, styles.settingButton]}>
            <View style={styles.settingIcon}>
              <Fingerprint size={20} color={isPrivateMode ? theme.colors.primary.light : theme.colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, isPrivateMode && styles.privateText]}>
                Fingerprint Protection
              </Text>
              <Text style={[styles.settingDescription, isPrivateMode && styles.privateDescription]}>
                {fingerprintProtectionEnabled ? 'Preventing browser fingerprinting' : 'Fingerprinting allowed'}
              </Text>
            </View>
            <Switch
              value={fingerprintProtectionEnabled}
              onValueChange={toggleFingerprintProtection}
              trackColor={{ false: theme.colors.neutral[300], true: theme.colors.primary.dark }}
              thumbColor={fingerprintProtectionEnabled ? theme.colors.primary.main : theme.colors.neutral[100]}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isPrivateMode && styles.privateText]}>
            Data
          </Text>

          <TouchableOpacity
            style={[styles.settingRow, styles.settingButton, styles.clearDataButton]}
            onPress={handleClearBrowsingData}
          >
            <View style={styles.settingIcon}>
              <Trash2 size={20} color={theme.colors.error} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, isPrivateMode && styles.privateText]}>
                Clear browsing data
              </Text>
              <Text style={[styles.settingDescription, isPrivateMode && styles.privateDescription]}>
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
  title: {
    fontFamily: theme.typography.families.sansMedium,
    color: theme.colors.neutral[700],
  } as TextStyle,
  privateText: {
    color: theme.colors.neutral[600],
  } as TextStyle,
  content: {
    paddingBottom: 24,
  },
  section: {
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[200],
  } as ViewStyle,
  sectionTitle: {
    fontFamily: theme.typography.families.sansMedium,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.neutral[500],
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
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
  settingLabel: {
    fontFamily: theme.typography.families.sansMedium,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.neutral[700],
    marginBottom: 2,
  } as TextStyle,
  settingDescription: {
    fontFamily: theme.typography.families.sans,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.neutral[500],
  } as TextStyle,
  privateDescription: {
    color: theme.colors.neutral[400],
  } as TextStyle,
  clearDataButton: {
    borderBottomWidth: 0,
  },
});
