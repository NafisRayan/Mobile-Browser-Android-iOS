import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, StatusBar, Alert, ViewStyle, TextStyle } from 'react-native';
import { theme } from '@/styles/theme';
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
      style={[styles.container, isPrivateMode && styles.privateContainer]}
    >
      {/* StatusBar is handled by RootLayout, but keeping it here for potential specific overrides if needed */}
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
            Bookmarks
          </Text>

          <View style={styles.headerButton} />
        </View>

        <View style={[styles.searchContainer, isPrivateMode && styles.privateSearchContainer]}>
          <Search size={20} color={isPrivateMode ? theme.colors.neutral[500] : theme.colors.neutral[400]} />
          <TextInput
            style={[styles.searchInput, isPrivateMode && styles.privateSearchInput]}
            placeholder="Search bookmarks"
            placeholderTextColor={isPrivateMode ? theme.colors.neutral[500] : theme.colors.neutral[400]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color={isPrivateMode ? theme.colors.neutral[500] : theme.colors.neutral[400]} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {showAddBookmark ? (
        <View style={[styles.addBookmarkContainer, isPrivateMode && styles.privateSection]}>
          <Text style={[styles.addBookmarkTitle, isPrivateMode && styles.privateText]}>
            Add New Bookmark
          </Text>
          <TextInput
            style={[styles.input, isPrivateMode && styles.privateInput]}
            placeholder="Title (optional)"
            placeholderTextColor={theme.colors.neutral[400]}
            value={newBookmarkTitle}
            onChangeText={setNewBookmarkTitle}
          />
          <TextInput
            style={[styles.input, isPrivateMode && styles.privateInput]}
            placeholder="URL (e.g., example.com)"
            placeholderTextColor={theme.colors.neutral[400]}
            value={newBookmarkUrl}
            onChangeText={setNewBookmarkUrl}
            autoCapitalize="none"
            keyboardType="url"
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setShowAddBookmark(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleAddBookmark}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          {bookmarks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Bookmark size={48} color={isPrivateMode ? theme.colors.neutral[500] : theme.colors.neutral[400]} />
              <Text style={[styles.emptyText, isPrivateMode && styles.privateText]}>
                No bookmarks yet
              </Text>
              <Text style={[styles.emptySubtext, isPrivateMode && styles.privateSubtext]}>
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
            { bottom: 24 + (safeAreaStyles.safeAreaBottom.paddingBottom || 0) }
          ]}
          onPress={() => setShowAddBookmark(true)}
        >
          <Plus size={24} color={theme.colors.neutral[900]} />
        </TouchableOpacity>
      )}
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
  searchContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing.md,
    height: 48,
  } as ViewStyle,
  privateSearchContainer: {
    backgroundColor: theme.colors.neutral[200],
  } as ViewStyle,
  searchInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: theme.spacing.sm,
    fontFamily: theme.typography.families.sans,
    color: theme.colors.neutral[700],
  } as TextStyle,
  privateSearchInput: {
    color: theme.colors.neutral[600],
  } as TextStyle,
  listContent: {
    paddingBottom: 100,
  },
  addButton: {
    position: 'absolute',
    right: theme.spacing['2xl'],
    // bottom will be adjusted dynamically
    width: 56,
    height: 56,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary.main,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    ...theme.shadows.lg,
    zIndex: 1000,
  } as ViewStyle,
  addBookmarkContainer: {
    margin: theme.spacing.lg,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.radius.lg,
    ...theme.shadows.md,
  } as ViewStyle,
  privateSection: {
    backgroundColor: theme.colors.neutral[200],
  } as ViewStyle,
  addBookmarkTitle: {
    fontFamily: theme.typography.families.sansMedium,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.neutral[700],
    marginBottom: theme.spacing.lg,
  } as TextStyle,
  input: {
    backgroundColor: theme.colors.neutral[200],
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    fontFamily: theme.typography.families.sans,
    color: theme.colors.neutral[700],
  } as TextStyle,
  privateInput: {
    backgroundColor: theme.colors.neutral[300],
    color: theme.colors.neutral[600],
  } as TextStyle,
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.neutral[300],
  } as ViewStyle,
  saveButton: {
    backgroundColor: theme.colors.primary.main,
  } as ViewStyle,
  buttonText: {
    fontFamily: theme.typography.families.sansMedium,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.neutral[600],
  } as TextStyle,
  saveButtonText: {
    fontFamily: theme.typography.families.sansMedium,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.neutral[900], // Brightest text for primary button
  } as TextStyle,
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontFamily: theme.typography.families.sansMedium,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.neutral[700],
    marginTop: theme.spacing.lg,
  } as TextStyle,
  emptySubtext: {
    fontFamily: theme.typography.families.sans,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.neutral[500],
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  } as TextStyle,
  privateSubtext: {
    color: theme.colors.neutral[400],
  } as TextStyle,
});
