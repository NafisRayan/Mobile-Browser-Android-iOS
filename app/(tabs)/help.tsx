import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Alert, Linking, ViewStyle, TextStyle } from 'react-native';
import { theme } from '@/styles/theme';
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
      isPrivateMode && styles.privateContainer
    ]}>
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
          <Text style={[styles.sectionTitle, isPrivateMode && styles.privateText]}>
            Help
          </Text>

          <TouchableOpacity 
            style={styles.helpItem}
            onPress={() => openExternalLink('https://support.google.com/chrome')}
          >
            <View style={styles.helpItemLeft}>
              <HelpCircle size={24} color={isPrivateMode ? theme.colors.primary.light : theme.colors.primary.main} style={styles.helpItemIcon} />
              <Text style={[styles.helpItemText, isPrivateMode && styles.privateText]}>
                Chrome Help
              </Text>
            </View>
            <ChevronRight size={20} color={isPrivateMode ? theme.colors.neutral[500] : theme.colors.neutral[400]} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.helpItem}
            onPress={() => openExternalLink('https://support.google.com/chrome/answer/95346')}
          >
            <View style={styles.helpItemLeft}>
              <BookOpen size={24} color={isPrivateMode ? theme.colors.primary.light : theme.colors.primary.main} style={styles.helpItemIcon} />
              <Text style={[styles.helpItemText, isPrivateMode && styles.privateText]}>
                Chrome Tips & Tricks
              </Text>
            </View>
            <ChevronRight size={20} color={isPrivateMode ? theme.colors.neutral[500] : theme.colors.neutral[400]} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.helpItem}
            onPress={() => openExternalLink('https://support.google.com/chrome/answer/114836')}
          >
            <View style={styles.helpItemLeft}>
              <Shield size={24} color={isPrivateMode ? theme.colors.primary.light : theme.colors.primary.main} style={styles.helpItemIcon} />
              <Text style={[styles.helpItemText, isPrivateMode && styles.privateText]}>
                Privacy & Security
              </Text>
            </View>
            <ChevronRight size={20} color={isPrivateMode ? theme.colors.neutral[500] : theme.colors.neutral[400]} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isPrivateMode && styles.privateText]}>
            Feedback
          </Text>

          <View style={[styles.feedbackContainer, isPrivateMode && styles.privateFeedbackContainer]}>
            <Text style={[styles.feedbackLabel, isPrivateMode && styles.privateText]}>
              Tell us what you think
            </Text>
            <TextInput
              style={[styles.feedbackInput, isPrivateMode && styles.privateFeedbackInput]}
              placeholder="Your feedback helps us improve Chrome"
              placeholderTextColor={isPrivateMode ? theme.colors.neutral[500] : theme.colors.neutral[400]}
              multiline
              numberOfLines={4}
              value={feedbackText}
              onChangeText={setFeedbackText}
            />
            <TouchableOpacity 
              style={[styles.sendButton, !feedbackText.trim() && styles.disabledButton]}
              onPress={handleSendFeedback}
              disabled={!feedbackText.trim()}
            >
              <Text style={styles.sendButtonText}>Send</Text>
              <Send size={16} color={theme.colors.neutral[900]} style={styles.sendIcon} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.helpItem}
            onPress={() => openExternalLink('https://play.google.com/store/apps/details?id=com.android.chrome')}
          >
            <View style={styles.helpItemLeft}>
              <Star size={24} color={isPrivateMode ? theme.colors.primary.light : theme.colors.primary.main} style={styles.helpItemIcon} />
              <Text style={[styles.helpItemText, isPrivateMode && styles.privateText]}>
                Rate on Play Store
              </Text>
            </View>
            <ChevronRight size={20} color={isPrivateMode ? theme.colors.neutral[500] : theme.colors.neutral[400]} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.helpItem}
            onPress={() => openExternalLink('https://support.google.com/chrome/contact/chrome_android_report')}
          >
            <View style={styles.helpItemLeft}>
              <MessageSquare size={24} color={isPrivateMode ? theme.colors.primary.light : theme.colors.primary.main} style={styles.helpItemIcon} />
              <Text style={[styles.helpItemText, isPrivateMode && styles.privateText]}>
                Report an issue
              </Text>
            </View>
            <ChevronRight size={20} color={isPrivateMode ? theme.colors.neutral[500] : theme.colors.neutral[400]} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isPrivateMode && styles.privateText]}>
            About
          </Text>

          <TouchableOpacity 
            style={styles.helpItem}
            onPress={() => Alert.alert('Chrome Browser', 'Version 1.0.0\n\nMobile Browser App\nBuilt with React Native and Expo')}
          >
            <View style={styles.helpItemLeft}>
              <Info size={24} color={isPrivateMode ? theme.colors.primary.light : theme.colors.primary.main} style={styles.helpItemIcon} />
              <Text style={[styles.helpItemText, isPrivateMode && styles.privateText]}>
                Version info
              </Text>
            </View>
            <Text style={[styles.versionText, isPrivateMode && styles.privateSubtext]}>
              1.0.0
            </Text>
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
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: theme.typography.families.sansMedium,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.neutral[600],
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  } as TextStyle,
  helpItem: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[200],
  } as ViewStyle,
  helpItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpItemIcon: {
    marginRight: 16,
  },
  helpItemText: {
    fontFamily: theme.typography.families.sans,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.neutral[700],
  } as TextStyle,
  feedbackContainer: {
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  } as ViewStyle,
  privateFeedbackContainer: {
    backgroundColor: theme.colors.neutral[200],
  } as ViewStyle,
  feedbackLabel: {
    fontFamily: theme.typography.families.sansMedium,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.neutral[700],
    marginBottom: theme.spacing.sm,
  } as TextStyle,
  feedbackInput: {
    backgroundColor: theme.colors.neutral[50],
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    fontFamily: theme.typography.families.sans,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.neutral[700],
    minHeight: 100,
    textAlignVertical: 'top' as const,
  } as TextStyle,
  privateFeedbackInput: {
    backgroundColor: theme.colors.neutral[100],
    color: theme.colors.neutral[600],
  } as TextStyle,
  sendButton: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.radius.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    alignSelf: 'flex-end',
    marginTop: theme.spacing.sm,
    flexDirection: 'row' as const,
    alignItems: 'center',
  } as ViewStyle,
  disabledButton: {
    backgroundColor: theme.colors.neutral[300],
  } as ViewStyle,
  sendButtonText: {
    fontFamily: theme.typography.families.sansMedium,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.neutral[900], // Brightest text
  } as TextStyle,
  sendIcon: {
    marginLeft: 8,
  },
  versionText: {
    fontFamily: theme.typography.families.sans,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.neutral[500],
  } as TextStyle,
  privateSubtext: {
    color: theme.colors.neutral[400],
  } as TextStyle,
});
