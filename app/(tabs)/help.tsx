import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Alert, Linking, ViewStyle, TextStyle } from 'react-native';
import { theme as staticTheme, commonStyles } from '@/styles/theme'; // Renamed theme, import commonStyles
import { useTheme } from '@/context/ThemeContext'; // Import useTheme
import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronRight, HelpCircle, MessageSquare, Star, Send, Info, Shield, BookOpen } from 'lucide-react-native';
import { usePrivacyContext } from '@/context/PrivacyContext';
import { useResponsiveSize } from '@/hooks/useResponsiveSize';
import { useSafeArea } from '@/hooks/useSafeArea';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HelpScreen() {
  const { isPrivateMode } = usePrivacyContext();
  const router = useRouter();
  const { isTablet, isDesktop, getIconSize, getFontSize, getResponsivePadding } = useResponsiveSize();
  const { styles: safeAreaStyles } = useSafeArea();
  const { isDarkMode } = useTheme();
  const dynamicStyles = commonStyles(isDarkMode);
  const [feedbackText, setFeedbackText] = useState('');

  const goBack = () => {
    router.back();
  };

  const handleSendFeedback = () => {
    if (feedbackText.trim() === '') {
      Alert.alert('Please enter your feedback');
      return;
    }

    // In a real app, this would send the feedback to a server
    Alert.alert(
      'Thank you!',
      'Your feedback has been submitted.',
      [
        {
          text: 'OK',
          onPress: () => setFeedbackText('')
        }
      ]
    );
  };

  const openExternalLink = (url: string) => {
    Linking.openURL(url).catch(err => {
      Alert.alert('Error', 'Could not open the link');
    });
  };

  // Get responsive values
  const iconSize = getIconSize(20);
  const fontSize = getFontSize(16);
  const responsivePadding = getResponsivePadding();

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: isPrivateMode ? dynamicStyles.privateMode.backgroundColor : dynamicStyles.container.base.backgroundColor }
    ]}>
      <View style={[
        styles.header,
        { borderBottomColor: dynamicStyles.button.secondary.borderColor }, // Add border
        responsivePadding,
        safeAreaStyles.safeAreaTop
      ]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={goBack}
            style={styles.headerButton}
          >
            <ArrowLeft size={iconSize} color={dynamicStyles.icon.color} />
          </TouchableOpacity>

          <Text style={[
            styles.title,
            { color: dynamicStyles.text.primary.color, fontSize: getFontSize(18) }
          ]}>
            Help & Feedback
          </Text>

          <View style={styles.headerButton} />
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={[
          styles.contentContainer,
          responsivePadding,
          safeAreaStyles.safeAreaBottom
        ]}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: dynamicStyles.text.secondary.color }]}>
            Help
          </Text>

          <TouchableOpacity 
            style={[styles.helpItem, { borderBottomColor: dynamicStyles.button.secondary.borderColor }]}
            onPress={() => openExternalLink('https://support.google.com/chrome')}
          >
            <View style={styles.helpItemLeft}>
              <HelpCircle size={24} color={dynamicStyles.iconAccent.color} style={styles.helpItemIcon} />
              <Text style={[styles.helpItemText, { color: dynamicStyles.text.primary.color }]}>
                Chrome Help
              </Text>
            </View>
            <ChevronRight size={20} color={dynamicStyles.text.secondary.color} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.helpItem, { borderBottomColor: dynamicStyles.button.secondary.borderColor }]}
            onPress={() => openExternalLink('https://support.google.com/chrome/answer/95346')}
          >
            <View style={styles.helpItemLeft}>
              <BookOpen size={24} color={dynamicStyles.iconAccent.color} style={styles.helpItemIcon} />
              <Text style={[styles.helpItemText, { color: dynamicStyles.text.primary.color }]}>
                Chrome Tips & Tricks
              </Text>
            </View>
            <ChevronRight size={20} color={dynamicStyles.text.secondary.color} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.helpItem, { borderBottomColor: dynamicStyles.button.secondary.borderColor }]}
            onPress={() => openExternalLink('https://support.google.com/chrome/answer/114836')}
          >
            <View style={styles.helpItemLeft}>
              <Shield size={24} color={dynamicStyles.iconAccent.color} style={styles.helpItemIcon} />
              <Text style={[styles.helpItemText, { color: dynamicStyles.text.primary.color }]}>
                Privacy & Security
              </Text>
            </View>
            <ChevronRight size={20} color={dynamicStyles.text.secondary.color} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: dynamicStyles.text.secondary.color }]}>
            Feedback
          </Text>

          <View style={[
            styles.feedbackContainer, 
            { backgroundColor: isPrivateMode ? dynamicStyles.privateMode.backgroundColor : dynamicStyles.input.base.backgroundColor }
          ]}>
            <Text style={[styles.feedbackLabel, { color: dynamicStyles.text.primary.color }]}>
              Tell us what you think
            </Text>
            <TextInput
              style={[
                styles.feedbackInput, 
                { 
                  backgroundColor: isPrivateMode ? dynamicStyles.privateMode.backgroundColor : dynamicStyles.container.base.backgroundColor, 
                  color: dynamicStyles.text.primary.color,
                  borderColor: dynamicStyles.button.secondary.borderColor,
                  borderWidth: 1
                }
              ]}
              placeholder="Your feedback helps us improve Chrome"
              placeholderTextColor={dynamicStyles.text.secondary.color}
              multiline
              numberOfLines={4}
              value={feedbackText}
              onChangeText={setFeedbackText}
            />
            <TouchableOpacity 
              style={[
                styles.sendButton, 
                { backgroundColor: dynamicStyles.button.primary.backgroundColor },
                !feedbackText.trim() && { backgroundColor: dynamicStyles.button.secondary.backgroundColor, opacity: 0.6 } // Disabled style
              ]}
              onPress={handleSendFeedback}
              disabled={!feedbackText.trim()}
            >
              <Text style={[styles.sendButtonText, { color: dynamicStyles.button.primary.color }]}>Send</Text>
              <Send size={16} color={dynamicStyles.button.primary.color} style={styles.sendIcon} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.helpItem, { borderBottomColor: dynamicStyles.button.secondary.borderColor }]}
            onPress={() => openExternalLink('https://play.google.com/store/apps/details?id=com.android.chrome')}
          >
            <View style={styles.helpItemLeft}>
              <Star size={24} color={dynamicStyles.iconAccent.color} style={styles.helpItemIcon} />
              <Text style={[styles.helpItemText, { color: dynamicStyles.text.primary.color }]}>
                Rate on Play Store
              </Text>
            </View>
            <ChevronRight size={20} color={dynamicStyles.text.secondary.color} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.helpItem, { borderBottomColor: dynamicStyles.button.secondary.borderColor }]}
            onPress={() => openExternalLink('https://support.google.com/chrome/contact/chrome_android_report')}
          >
            <View style={styles.helpItemLeft}>
              <MessageSquare size={24} color={dynamicStyles.iconAccent.color} style={styles.helpItemIcon} />
              <Text style={[styles.helpItemText, { color: dynamicStyles.text.primary.color }]}>
                Report an issue
              </Text>
            </View>
            <ChevronRight size={20} color={dynamicStyles.text.secondary.color} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: dynamicStyles.text.secondary.color }]}>
            About
          </Text>

          <TouchableOpacity 
            style={[styles.helpItem, { borderBottomColor: dynamicStyles.button.secondary.borderColor }]}
            onPress={() => Alert.alert('Chrome Browser', 'Version 1.0.0\n\nMobile Browser App\nBuilt with React Native and Expo')}
          >
            <View style={styles.helpItemLeft}>
              <Info size={24} color={dynamicStyles.iconAccent.color} style={styles.helpItemIcon} />
              <Text style={[styles.helpItemText, { color: dynamicStyles.text.primary.color }]}>
                Version info
              </Text>
            </View>
            <Text style={[styles.versionText, { color: dynamicStyles.text.secondary.color }]}>
              1.0.0
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { // Base style, background handled inline
    flex: 1,
  } as ViewStyle,
  // privateContainer removed
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
  title: { // Base style, color handled inline
    fontFamily: staticTheme.typography.families.sansMedium,
  } as TextStyle,
  // privateText removed
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: { // Base style, color handled inline
    fontFamily: staticTheme.typography.families.sansMedium,
    fontSize: staticTheme.typography.sizes.sm,
    marginBottom: staticTheme.spacing.sm,
    paddingHorizontal: staticTheme.spacing.sm,
  } as TextStyle,
  helpItem: { // Base style, border handled inline
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: staticTheme.spacing.lg,
    paddingHorizontal: staticTheme.spacing.lg,
    borderBottomWidth: 1,
  } as ViewStyle,
  helpItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpItemIcon: {
    marginRight: 16,
  },
  helpItemText: { // Base style, color handled inline
    fontFamily: staticTheme.typography.families.sans,
    fontSize: staticTheme.typography.sizes.base,
  } as TextStyle,
  feedbackContainer: { // Base style, background handled inline
    borderRadius: staticTheme.radius.md,
    padding: staticTheme.spacing.lg,
    marginBottom: staticTheme.spacing.lg,
  } as ViewStyle,
  // privateFeedbackContainer removed
  feedbackLabel: { // Base style, color handled inline
    fontFamily: staticTheme.typography.families.sansMedium,
    fontSize: staticTheme.typography.sizes.base,
    marginBottom: staticTheme.spacing.sm,
  } as TextStyle,
  feedbackInput: { // Base style, background, color, border handled inline
    borderRadius: staticTheme.radius.sm,
    padding: staticTheme.spacing.md,
    fontFamily: staticTheme.typography.families.sans,
    fontSize: staticTheme.typography.sizes.sm,
    minHeight: 100,
    textAlignVertical: 'top' as const,
  } as TextStyle,
  // privateFeedbackInput removed
  sendButton: { // Base style, background handled inline
    borderRadius: staticTheme.radius.sm,
    paddingVertical: staticTheme.spacing.sm,
    paddingHorizontal: staticTheme.spacing.lg,
    alignSelf: 'flex-end',
    marginTop: staticTheme.spacing.sm,
    flexDirection: 'row' as const,
    alignItems: 'center',
  } as ViewStyle,
  // disabledButton removed, handled inline
  sendButtonText: { // Base style, color handled inline
    fontFamily: staticTheme.typography.families.sansMedium,
    fontSize: staticTheme.typography.sizes.sm,
  } as TextStyle,
  sendIcon: {
    marginLeft: 8,
  },
  versionText: { // Base style, color handled inline
    fontFamily: staticTheme.typography.families.sans,
    fontSize: staticTheme.typography.sizes.sm,
  } as TextStyle,
  // privateSubtext removed
});
