import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, TextInput, Alert, ViewStyle, TextStyle } from 'react-native';
import { theme as staticTheme, commonStyles } from '@/styles/theme'; // Renamed theme, import commonStyles
import { useTheme } from '@/context/ThemeContext'; // Import useTheme
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
  const { isDarkMode } = useTheme();
  const dynamicStyles = commonStyles(isDarkMode);
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
            History
          </Text>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleClearHistory}
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
            placeholder="Search history"
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

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Clock size={48} color={dynamicStyles.text.secondary.color} />
          <Text style={[styles.emptyText, { color: dynamicStyles.text.primary.color }]}>
            No browsing history
          </Text>
          <Text style={[styles.emptySubtext, { color: dynamicStyles.text.secondary.color }]}>
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
              <Text style={[styles.sectionHeader, { color: dynamicStyles.text.secondary.color }]}>
                {section.date}
              </Text>
              {section.data.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.historyItem}
                  onPress={() => handleItemPress(item)}
                >
                  <View style={styles.itemContent}>
                    <Clock size={16} color={dynamicStyles.text.secondary.color} style={styles.itemIcon} />
                    <View style={styles.itemTextContainer}>
                      <Text 
                        style={[styles.itemTitle, { color: dynamicStyles.text.primary.color }]} 
                        numberOfLines={1}
                      >
                        {item.title || item.url}
                      </Text>
                      <Text 
                        style={[styles.itemUrl, { color: dynamicStyles.text.secondary.color }]} 
                        numberOfLines={1}
                      >
                        {item.url}
                      </Text>
                      <Text style={[styles.itemTime, { color: dynamicStyles.text.secondary.color }]}>
                        {formatTime(item.timestamp)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveItem(item.id)}
                  >
                    <X size={16} color={dynamicStyles.text.secondary.color} />
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
  section: {
    marginBottom: 16,
  },
  sectionHeader: { // Base style, color handled inline
    fontFamily: staticTheme.typography.families.sansMedium,
    fontSize: staticTheme.typography.sizes.sm,
    marginBottom: staticTheme.spacing.sm,
    paddingHorizontal: staticTheme.spacing.sm,
  } as TextStyle,
  historyItem: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: staticTheme.spacing.md,
    paddingHorizontal: staticTheme.spacing.sm,
    borderRadius: staticTheme.radius.md,
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
  itemTitle: { // Base style, color handled inline
    fontFamily: staticTheme.typography.families.sans,
    fontSize: staticTheme.typography.sizes.sm,
  } as TextStyle,
  itemUrl: { // Base style, color handled inline
    fontFamily: staticTheme.typography.families.sans,
    fontSize: staticTheme.typography.sizes.xs,
    marginTop: 2,
  } as TextStyle,
  itemTime: { // Base style, color handled inline
    fontFamily: staticTheme.typography.families.sans,
    fontSize: staticTheme.typography.sizes.xs,
    marginTop: 2,
  } as TextStyle,
  removeButton: {
    padding: 8,
  },
});
