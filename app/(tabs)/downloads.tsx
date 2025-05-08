import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, TextInput, Alert, ViewStyle, TextStyle } from 'react-native';
import { theme as staticTheme, commonStyles } from '@/styles/theme'; // Renamed theme, import commonStyles
import { useTheme } from '@/context/ThemeContext'; // Import useTheme
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, Download, Trash2, X, File, FileText, Image, Music, Video, Archive } from 'lucide-react-native';
import { useBrowserContext } from '@/context/BrowserContext';
import { usePrivacyContext } from '@/context/PrivacyContext';
import { useResponsiveSize } from '@/hooks/useResponsiveSize';
import { useSafeArea } from '@/hooks/useSafeArea';
import { SafeAreaView } from 'react-native-safe-area-context';

interface DownloadItem {
  id: string;
  filename: string;
  url: string;
  size: string;
  status: 'completed' | 'in_progress' | 'failed';
  progress?: number;
  timestamp: number;
  fileType: string;
}

export default function DownloadsScreen() {
  const { downloads, clearDownloads, removeDownloadItem } = useBrowserContext();
  const { isPrivateMode } = usePrivacyContext();
  const router = useRouter();
  const { isTablet, isDesktop, getIconSize, getFontSize, getResponsivePadding } = useResponsiveSize();
  const { styles: safeAreaStyles } = useSafeArea();
  const { isDarkMode } = useTheme();
  const dynamicStyles = commonStyles(isDarkMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDownloads, setFilteredDownloads] = useState<DownloadItem[]>([]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDownloads(downloads);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredDownloads(
        downloads.filter(
          item => item.filename.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, downloads]);

  const goBack = () => {
    router.back();
  };

  const handleClearDownloads = () => {
    Alert.alert(
      'Clear downloads',
      'Are you sure you want to clear all downloads?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Clear',
          onPress: clearDownloads,
          style: 'destructive'
        }
      ]
    );
  };

  const handleRemoveItem = (id: string) => {
    removeDownloadItem(id);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  // Moved inside component to access dynamicStyles
  const getFileIcon = (fileType: string) => {
    const iconColor = dynamicStyles.text.secondary.color;
    switch (fileType) {
      case 'image':
        return <Image size={24} color={iconColor} />;
      case 'audio':
        return <Music size={24} color={iconColor} />;
      case 'video':
        return <Video size={24} color={iconColor} />;
      case 'document':
        return <FileText size={24} color={iconColor} />;
      case 'archive':
        return <Archive size={24} color={iconColor} />;
      default:
        return <File size={24} color={iconColor} />;
    }
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
            Downloads
          </Text>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleClearDownloads}
          >
            <Trash2 size={iconSize} color={dynamicStyles.icon.color} />
          </TouchableOpacity>
        </View>

        <View style={[
          styles.searchContainer, 
          { backgroundColor: isPrivateMode ? dynamicStyles.privateMode.backgroundColor : dynamicStyles.input.base.backgroundColor }
        ]}>
          <Search size={20} color={dynamicStyles.text.secondary.color} />
          <TextInput
            style={[styles.searchInput, { color: dynamicStyles.text.primary.color }]}
            placeholder="Search downloads"
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

      {downloads.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Download size={48} color={dynamicStyles.text.secondary.color} />
          <Text style={[styles.emptyText, { color: dynamicStyles.text.primary.color }]}>
            No downloads
          </Text>
          <Text style={[styles.emptySubtext, { color: dynamicStyles.text.secondary.color }]}>
            Downloaded files will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredDownloads}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            responsivePadding,
            safeAreaStyles.safeAreaBottom
          ]}
          renderItem={({ item }) => (
            <View style={[styles.downloadItem, { borderBottomColor: dynamicStyles.button.secondary.borderColor }]}>
              <View style={styles.fileIconContainer}>
                {getFileIcon(item.fileType)}
              </View>
              <View style={styles.downloadDetails}>
                <Text 
                  style={[styles.fileName, { color: dynamicStyles.text.primary.color }]} 
                  numberOfLines={1}
                >
                  {item.filename}
                </Text>
                <View style={styles.downloadInfo}>
                  <Text style={[styles.fileSize, { color: dynamicStyles.text.secondary.color }]}>
                    {item.size}
                  </Text>
                  <Text style={[styles.downloadDate, { color: dynamicStyles.text.secondary.color }]}>
                    {formatDate(item.timestamp)}
                  </Text>
                  {item.status === 'in_progress' && (
                    <Text style={[styles.downloadStatus, { color: dynamicStyles.text.accent.color }]}>
                      {Math.round(item.progress || 0)}%
                    </Text>
                  )}
                  {item.status === 'failed' && (
                    <Text style={styles.downloadFailed}>
                      Failed
                    </Text>
                  )}
                </View>
                {item.status === 'in_progress' && (
                  <View style={[styles.progressBarContainer, { backgroundColor: dynamicStyles.button.secondary.borderColor }]}>
                    <View 
                      style={[
                        styles.progressBar,
                        { 
                          width: `${item.progress ?? 0}%`, // Default to 0 if undefined
                          backgroundColor: dynamicStyles.text.accent.color 
                        } 
                      ]}
                    />
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveItem(item.id)}
              >
                <X size={16} color={dynamicStyles.text.secondary.color} />
              </TouchableOpacity>
            </View>
          )}
        />
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
  listContent: {
    paddingBottom: 24,
  },
  downloadItem: { // Base style, border handled inline
    flexDirection: 'row' as const,
    alignItems: 'center',
    paddingVertical: staticTheme.spacing.md,
    paddingHorizontal: staticTheme.spacing.sm,
    borderBottomWidth: 1,
  } as ViewStyle,
  fileIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  downloadDetails: {
    flex: 1,
  },
  fileName: { // Base style, color handled inline
    fontFamily: staticTheme.typography.families.sans,
    fontSize: staticTheme.typography.sizes.sm,
    marginBottom: staticTheme.spacing.xs,
  } as TextStyle,
  downloadInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileSize: { // Base style, color handled inline
    fontFamily: staticTheme.typography.families.sans,
    fontSize: staticTheme.typography.sizes.xs,
    marginRight: staticTheme.spacing.sm,
  } as TextStyle,
  downloadDate: { // Base style, color handled inline
    fontFamily: staticTheme.typography.families.sans,
    fontSize: staticTheme.typography.sizes.xs,
  } as TextStyle,
  downloadStatus: { // Base style, color handled inline
    fontFamily: staticTheme.typography.families.sans,
    fontSize: staticTheme.typography.sizes.xs,
    marginLeft: staticTheme.spacing.sm,
  } as TextStyle,
  downloadFailed: { // Semantic color, kept as is
    fontFamily: staticTheme.typography.families.sans,
    fontSize: staticTheme.typography.sizes.xs,
    color: staticTheme.colors.error,
    marginLeft: staticTheme.spacing.sm,
  } as TextStyle,
  progressBarContainer: { // Base style, background handled inline
    height: 4,
    borderRadius: staticTheme.radius.full,
    marginTop: staticTheme.spacing.xs,
    overflow: 'hidden',
  } as ViewStyle,
  progressBar: { // Base style, background handled inline
    height: '100%',
  } as ViewStyle,
  removeButton: {
    padding: 8,
  },
});
