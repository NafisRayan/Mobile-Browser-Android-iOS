import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, TextInput, Alert, ViewStyle, TextStyle } from 'react-native';
import { theme } from '@/styles/theme';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, Clock, Trash2, X } from 'lucide-react-native';
import { useBrowserContext } from '@/context/BrowserContext';
import { usePrivacyContext } from '@/context/PrivacyContext';
import { useResponsiveSize } from '@/hooks/useResponsiveSize';
import { useSafeArea } from '@/hooks/useSafeArea';
import { SafeAreaView } from 'react-native-safe-area-context';

interface HistoryItem {
  id: string;
  url: string;
  title: string;
  timestamp: number;
  favicon?: string;
}

export default function HistoryScreen() {
  const { history, clearHistory, removeHistoryItem, navigateToUrl } = useBrowserContext();
  const { isPrivateMode } = usePrivacyContext();
  const router = useRouter();
  const { isTablet, isDesktop, getIconSize, getFontSize, getResponsivePadding } = useResponsiveSize();
  const { styles: safeAreaStyles } = useSafeArea();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredHistory(history);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredHistory(
        history.filter(
          item => 
            item.title.toLowerCase().includes(query) || 
            item.url.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, history]);

  const goBack = () => {
    router.back();
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear browsing history',
      'Are you sure you want to clear all browsing history?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Clear',
          onPress: clearHistory,
          style: 'destructive'
        }
      ]
    );
  };

  const handleItemPress = (item: HistoryItem) => {
    navigateToUrl(item.url);
  };

  const handleRemoveItem = (id: string) => {
    removeHistoryItem(id);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  // Group history items by date
  const groupedHistory = filteredHistory.reduce((groups, item) => {
    const date = formatDate(item.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {} as Record<string, HistoryItem[]>);

  // Convert grouped history to array for FlatList
  const sections = Object.keys(groupedHistory).map(date => ({
    date,
    data: groupedHistory[date]
  }));

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
            History
          </Text>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleClearHistory}
          >
            <Trash2 size={iconSize} color={isPrivateMode ? theme.colors.neutral[700] : theme.colors.neutral[600]} />
          </TouchableOpacity>
        </View>

        <View style={[styles.searchContainer, isPrivateMode && styles.privateSearchContainer]}>
          <Search size={20} color={isPrivateMode ? theme.colors.neutral[500] : theme.colors.neutral[400]} />
          <TextInput
            style={[styles.searchInput, isPrivateMode && styles.privateSearchInput]}
            placeholder="Search history"
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

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Clock size={48} color={isPrivateMode ? theme.colors.neutral[500] : theme.colors.neutral[400]} />
          <Text style={[styles.emptyText, isPrivateMode && styles.privateText]}>
            No browsing history
          </Text>
          <Text style={[styles.emptySubtext, isPrivateMode && styles.privateSubtext]}>
            {isPrivateMode 
              ? 'History is not saved in Incognito mode' 
              : 'Your browsing history will appear here'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={sections}
          keyExtractor={(item) => item.date}
          contentContainerStyle={[
            styles.listContent,
            responsivePadding,
            safeAreaStyles.safeAreaBottom
          ]}
          renderItem={({ item: section }) => (
            <View style={styles.section}>
              <Text style={[styles.sectionHeader, isPrivateMode && styles.privateText]}>
                {section.date}
              </Text>
              {section.data.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.historyItem}
                  onPress={() => handleItemPress(item)}
                >
                  <View style={styles.itemContent}>
                    <Clock size={16} color={isPrivateMode ? theme.colors.neutral[500] : theme.colors.neutral[400]} style={styles.itemIcon} />
                    <View style={styles.itemTextContainer}>
                      <Text 
                        style={[styles.itemTitle, isPrivateMode && styles.privateText]} 
                        numberOfLines={1}
                      >
                        {item.title || item.url}
                      </Text>
                      <Text 
                        style={[styles.itemUrl, isPrivateMode && styles.privateSubtext]} 
                        numberOfLines={1}
                      >
                        {item.url}
                      </Text>
                      <Text style={[styles.itemTime, isPrivateMode && styles.privateSubtext]}>
                        {formatTime(item.timestamp)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveItem(item.id)}
                  >
                    <X size={16} color={isPrivateMode ? theme.colors.neutral[500] : theme.colors.neutral[400]} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
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
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontFamily: theme.typography.families.sansMedium,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.neutral[600],
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  } as TextStyle,
  historyItem: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.md,
    // Add a subtle border or background change on hover/press if needed
  } as ViewStyle,
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    marginRight: 16,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontFamily: theme.typography.families.sans,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.neutral[700],
  } as TextStyle,
  itemUrl: {
    fontFamily: theme.typography.families.sans,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.neutral[500],
    marginTop: 2,
  } as TextStyle,
  itemTime: {
    fontFamily: theme.typography.families.sans,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.neutral[500],
    marginTop: 2,
  } as TextStyle,
  removeButton: {
    padding: 8,
  },
});
