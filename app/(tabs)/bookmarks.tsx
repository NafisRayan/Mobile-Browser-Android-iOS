import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, Alert, ViewStyle, TextStyle } from 'react-native'; // Removed StatusBar
import { theme as staticTheme, commonStyles } from '@/styles/theme'; // Renamed theme, import commonStyles
import { useTheme } from '@/context/ThemeContext'; // Import useTheme
import { Bookmark, Search, Plus, Trash, ExternalLink, ArrowLeft, X } from 'lucide-react-native';
import { useBrowserContext } from '@/context/BrowserContext';
import { usePrivacyContext } from '@/context/PrivacyContext';
import { BookmarkItem } from '@/components/browser/BookmarkItem';
import { useSafeArea } from '@/hooks/useSafeArea';
import { useResponsiveSize } from '@/hooks/useResponsiveSize';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookmarksScreen() {
  const { bookmarks, addBookmark, removeBookmark, navigateToUrl } = useBrowserContext();
  const { isPrivateMode } = usePrivacyContext();
  const router = useRouter();
  const { isTablet, isDesktop, getIconSize, getFontSize, getResponsivePadding } = useResponsiveSize();
  const { styles: safeAreaStyles } = useSafeArea();
  const { isDarkMode } = useTheme();
  const dynamicStyles = commonStyles(isDarkMode);

  const [newBookmarkUrl, setNewBookmarkUrl] = useState('');
  const [newBookmarkTitle, setNewBookmarkTitle] = useState('');
  const [showAddBookmark, setShowAddBookmark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookmarks = searchQuery
    ? bookmarks.filter(bookmark =>
        bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.url.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : bookmarks;

  const goBack = () => {
    router.back();
  };

  const handleAddBookmark = () => {
    if (newBookmarkUrl) {
      addBookmark({
        url: newBookmarkUrl.startsWith('http') ? newBookmarkUrl : `https://${newBookmarkUrl}`,
        title: newBookmarkTitle || newBookmarkUrl,
        timestamp: new Date().getTime()
      });
      setNewBookmarkUrl('');
      setNewBookmarkTitle('');
      setShowAddBookmark(false);
    }
  };

  // Get responsive values
  const iconSize = getIconSize(20);
  const fontSize = getFontSize(16);
  const responsivePadding = getResponsivePadding();

  return (
    <SafeAreaView
      style={[
        styles.container, 
        { backgroundColor: isPrivateMode ? dynamicStyles.privateMode.backgroundColor : dynamicStyles.container.base.backgroundColor }
      ]}
    >
      {/* StatusBar is handled by RootLayout */}

      <View style={[
        styles.header,
        { borderBottomColor: dynamicStyles.button.secondary.borderColor }, // Add border like privacy screen
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
            Bookmarks
          </Text>

          <View style={styles.headerButton} />
        </View>

        <View style={[
          styles.searchContainer, 
          { backgroundColor: isPrivateMode ? dynamicStyles.privateMode.backgroundColor : dynamicStyles.input.base.backgroundColor }
        ]}>
          <Search size={20} color={dynamicStyles.text.secondary.color} />
          <TextInput
            style={[styles.searchInput, { color: dynamicStyles.text.primary.color }]}
            placeholder="Search bookmarks"
            placeholderTextColor={dynamicStyles.text.secondary.color}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color={dynamicStyles.text.secondary.color} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {showAddBookmark ? (
        <View style={[
          styles.addBookmarkContainer, 
          { backgroundColor: isPrivateMode ? dynamicStyles.privateMode.backgroundColor : dynamicStyles.input.base.backgroundColor }
        ]}>
          <Text style={[styles.addBookmarkTitle, { color: dynamicStyles.text.primary.color }]}>
            Add New Bookmark
          </Text>
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: isPrivateMode ? dynamicStyles.privateMode.backgroundColor : dynamicStyles.container.base.backgroundColor, // Use container bg for input bg
                color: dynamicStyles.text.primary.color,
                borderColor: dynamicStyles.button.secondary.borderColor, // Add border
                borderWidth: 1
              }
            ]}
            placeholder="Title (optional)"
            placeholderTextColor={dynamicStyles.text.secondary.color}
            value={newBookmarkTitle}
            onChangeText={setNewBookmarkTitle}
          />
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: isPrivateMode ? dynamicStyles.privateMode.backgroundColor : dynamicStyles.container.base.backgroundColor, 
                color: dynamicStyles.text.primary.color,
                borderColor: dynamicStyles.button.secondary.borderColor,
                borderWidth: 1
              }
            ]}
            placeholder="URL (e.g., example.com)"
            placeholderTextColor={dynamicStyles.text.secondary.color}
            value={newBookmarkUrl}
            onChangeText={setNewBookmarkUrl}
            autoCapitalize="none"
            keyboardType="url"
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.button, 
                styles.cancelButton, 
                { backgroundColor: dynamicStyles.button.secondary.backgroundColor }
              ]}
              onPress={() => setShowAddBookmark(false)}
            >
              <Text style={[styles.buttonText, { color: dynamicStyles.button.secondary.color }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button, 
                styles.saveButton, 
                { backgroundColor: dynamicStyles.button.primary.backgroundColor }
              ]}
              onPress={handleAddBookmark}
            >
              <Text style={[styles.saveButtonText, { color: dynamicStyles.button.primary.color }]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          {bookmarks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Bookmark size={48} color={dynamicStyles.text.secondary.color} />
              <Text style={[styles.emptyText, { color: dynamicStyles.text.primary.color }]}>
                No bookmarks yet
              </Text>
              <Text style={[styles.emptySubtext, { color: dynamicStyles.text.secondary.color }]}>
                Tap the + button to add your first bookmark
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredBookmarks}
              keyExtractor={(item) => item.url}
              renderItem={({ item }) => (
                <BookmarkItem
                  title={item.title}
                  url={item.url}
                  onPress={() => navigateToUrl(item.url)}
                  onDelete={() => removeBookmark(item.url)}
                  isPrivateMode={isPrivateMode}
                />
              )}
              contentContainerStyle={[
                styles.listContent,
                responsivePadding,
                safeAreaStyles.safeAreaBottom
              ]}
            />
          )}
        </>
      )}

      {!showAddBookmark && (
        <TouchableOpacity
          style={[
            styles.addButton,
            { 
              bottom: 24 + (safeAreaStyles.safeAreaBottom.paddingBottom || 0),
              backgroundColor: dynamicStyles.button.primary.backgroundColor 
            }
          ]}
          onPress={() => setShowAddBookmark(true)}
        >
          <Plus size={24} color={dynamicStyles.button.primary.color} />
        </TouchableOpacity>
      )}
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
    borderBottomWidth: 1, // Added border like privacy screen
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
  searchContainer: { // Base style, background handled inline
    flexDirection: 'row' as const,
    alignItems: 'center',
    borderRadius: staticTheme.radius.full,
    paddingHorizontal: staticTheme.spacing.md,
    height: 48,
  } as ViewStyle,
  // privateSearchContainer removed
  searchInput: { // Base style, color handled inline
    flex: 1,
    height: 48,
    paddingHorizontal: staticTheme.spacing.sm,
    fontFamily: staticTheme.typography.families.sans,
  } as TextStyle,
  // privateSearchInput removed
  listContent: {
    paddingBottom: 100, // Ensure space for FAB
  },
  addButton: { // Base style, background handled inline
    position: 'absolute',
    right: staticTheme.spacing['2xl'],
    width: 56,
    height: 56,
    borderRadius: staticTheme.radius.full,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    ...staticTheme.shadows.lg,
    zIndex: 1000,
  } as ViewStyle,
  addBookmarkContainer: { // Base style, background handled inline
    margin: staticTheme.spacing.lg,
    padding: staticTheme.spacing.lg,
    borderRadius: staticTheme.radius.lg,
    ...staticTheme.shadows.md,
  } as ViewStyle,
  // privateSection removed
  addBookmarkTitle: { // Base style, color handled inline
    fontFamily: staticTheme.typography.families.sansMedium,
    fontSize: staticTheme.typography.sizes.lg,
    marginBottom: staticTheme.spacing.lg,
  } as TextStyle,
  input: { // Base style, background, color, border handled inline
    borderRadius: staticTheme.radius.md,
    padding: staticTheme.spacing.md,
    marginBottom: staticTheme.spacing.md,
    fontFamily: staticTheme.typography.families.sans,
  } as TextStyle,
  // privateInput removed
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: { // Base style
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: { // Background handled inline
  } as ViewStyle,
  saveButton: { // Background handled inline
  } as ViewStyle,
  buttonText: { // Base style, color handled inline
    fontFamily: staticTheme.typography.families.sansMedium,
    fontSize: staticTheme.typography.sizes.sm,
  } as TextStyle,
  saveButtonText: { // Base style, color handled inline
    fontFamily: staticTheme.typography.families.sansMedium,
    fontSize: staticTheme.typography.sizes.sm,
  } as TextStyle,
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: { // Base style, color handled inline
    fontFamily: staticTheme.typography.families.sansMedium,
    fontSize: staticTheme.typography.sizes.lg,
    marginTop: staticTheme.spacing.lg,
  } as TextStyle,
  emptySubtext: { // Base style, color handled inline
    fontFamily: staticTheme.typography.families.sans,
    fontSize: staticTheme.typography.sizes.sm,
    marginTop: staticTheme.spacing.sm,
    textAlign: 'center',
  } as TextStyle,
  // privateSubtext removed
});
