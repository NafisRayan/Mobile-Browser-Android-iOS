import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, TextInput, Alert, ViewStyle, TextStyle } from 'react-native';
import { theme } from '@/styles/theme';
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

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return <Image size={24} color={isPrivateMode ? theme.colors.neutral[500] : theme.colors.neutral[400]} />;
      case 'audio':
        return <Music size={24} color={isPrivateMode ? theme.colors.neutral[500] : theme.colors.neutral[400]} />;
      case 'video':
        return <Video size={24} color={isPrivateMode ? theme.colors.neutral[500] : theme.colors.neutral[400]} />;
      case 'document':
        return <FileText size={24} color={isPrivateMode ? theme.colors.neutral[500] : theme.colors.neutral[400]} />;
      case 'archive':
        return <Archive size={24} color={isPrivateMode ? theme.colors.neutral[500] : theme.colors.neutral[400]} />;
      default:
        return <File size={24} color={isPrivateMode ? theme.colors.neutral[500] : theme.colors.neutral[400]} />;
    }
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
            Downloads
          </Text>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleClearDownloads}
          >
            <Trash2 size={iconSize} color={isPrivateMode ? theme.colors.neutral[700] : theme.colors.neutral[600]} />
          </TouchableOpacity>
        </View>

        <View style={[styles.searchContainer, isPrivateMode && styles.privateSearchContainer]}>
          <Search size={20} color={isPrivateMode ? theme.colors.neutral[500] : theme.colors.neutral[400]} />
          <TextInput
            style={[styles.searchInput, isPrivateMode && styles.privateSearchInput]}
            placeholder="Search downloads"
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

      {downloads.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Download size={48} color={isPrivateMode ? theme.colors.neutral[500] : theme.colors.neutral[400]} />
          <Text style={[styles.emptyText, isPrivateMode && styles.privateText]}>
            No downloads
          </Text>
          <Text style={[styles.emptySubtext, isPrivateMode && styles.privateSubtext]}>
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
            <View style={styles.downloadItem}>
              <View style={styles.fileIconContainer}>
                {getFileIcon(item.fileType)}
              </View>
              <View style={styles.downloadDetails}>
                <Text 
                  style={[styles.fileName, isPrivateMode && styles.privateText]} 
                  numberOfLines={1}
                >
                  {item.filename}
                </Text>
                <View style={styles.downloadInfo}>
                  <Text style={[styles.fileSize, isPrivateMode && styles.privateSubtext]}>
                    {item.size}
                  </Text>
                  <Text style={[styles.downloadDate, isPrivateMode && styles.privateSubtext]}>
                    {formatDate(item.timestamp)}
                  </Text>
                  {item.status === 'in_progress' && (
                    <Text style={[styles.downloadStatus, isPrivateMode && styles.privateSubtext]}>
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
                  <View style={styles.progressBarContainer}>
                    <View 
                      style={[
                        styles.progressBar,
                        { width: `${item.progress ?? 0}%` } // Default to 0 if undefined
                      ]}
                    />
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveItem(item.id)}
              >
                <X size={16} color={isPrivateMode ? theme.colors.neutral[500] : theme.colors.neutral[400]} />
              </TouchableOpacity>
            </View>
          )}
        />
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
  listContent: {
    paddingBottom: 24,
  },
  downloadItem: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[200],
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
  fileName: {
    fontFamily: theme.typography.families.sans,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.neutral[700],
    marginBottom: theme.spacing.xs,
  } as TextStyle,
  downloadInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileSize: {
    fontFamily: theme.typography.families.sans,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.neutral[500],
    marginRight: theme.spacing.sm,
  } as TextStyle,
  downloadDate: {
    fontFamily: theme.typography.families.sans,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.neutral[500],
  } as TextStyle,
  downloadStatus: {
    fontFamily: theme.typography.families.sans,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.primary.main,
    marginLeft: theme.spacing.sm,
  } as TextStyle,
  downloadFailed: {
    fontFamily: theme.typography.families.sans,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.error,
    marginLeft: theme.spacing.sm,
  } as TextStyle,
  progressBarContainer: {
    height: 4,
    backgroundColor: theme.colors.neutral[200],
    borderRadius: theme.radius.full,
    marginTop: theme.spacing.xs,
    overflow: 'hidden',
  } as ViewStyle,
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary.main,
  } as ViewStyle,
  removeButton: {
    padding: 8,
  },
});
