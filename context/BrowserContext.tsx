import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { generateUUID } from '@/utils/helpers';
import { usePrivacyContext } from './PrivacyContext';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Types
type TabInfo = {
  url: string;
  title: string;
  favicon?: string;
};

type Bookmark = {
  url: string;
  title: string;
  timestamp: number;
};

type Shortcut = {
  title: string;
  url: string;
  favicon?: string;
};

type HistoryItem = {
  id: string;
  url: string;
  title: string;
  timestamp: number;
  favicon?: string;
};

type DownloadItem = {
  id: string;
  filename: string;
  url: string;
  size: string;
  status: 'completed' | 'in_progress' | 'failed';
  progress?: number;
  timestamp: number;
  fileType: string;
};

interface BrowserContextType {
  tabs: string[];
  currentTab: string;
  currentUrl: string;
  tabsInfo: { [key: string]: TabInfo };
  bookmarks: Bookmark[];
  shortcuts: Shortcut[];
  history: HistoryItem[];
  downloads: DownloadItem[];
  navigation: {
    canGoBack: boolean;
    canGoForward: boolean;
  };
  isLoading: boolean;
  addNewTab: () => void;
  removeTab: (tabId: string) => void;
  switchToTab: (tabId: string) => void;
  updateTabInfo: (tabId: string, info: Partial<TabInfo>) => void;
  updateUrl: (url: string) => void;
  setCurrentUrl: (url: string) => void;
  goBack: () => void;
  goForward: () => void;
  refreshPage: () => void;
  setCanGoBack: (can: boolean) => void;
  setCanGoForward: (can: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (url: string) => void;
  addHistoryItem: (item: Omit<HistoryItem, 'id'>) => void;
  removeHistoryItem: (id: string) => void;
  clearHistory: () => void;
  addDownloadItem: (item: Omit<DownloadItem, 'id'>) => void;
  updateDownloadProgress: (id: string, progress: number) => void;
  removeDownloadItem: (id: string) => void;
  clearDownloads: () => void;
  loadInitialUrl: () => void;
  navigateToUrl: (url: string) => void;
}

// Default store implementation for web (localStorage)
const webStore = {
  getItem: async (key: string) => {
    try {
      const value = localStorage.getItem(key);
      return value;
    } catch (error) {
      console.error('Error getting item from localStorage', error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error('Error setting item in localStorage', error);
      return false;
    }
  },
  removeItem: async (key: string) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing item from localStorage', error);
      return false;
    }
  },
};

// Use the appropriate store based on platform
const store = Platform.OS === 'web' ? webStore : SecureStore;

// Context setup
const BrowserContext = createContext<BrowserContextType | undefined>(undefined);

export function BrowserProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabs] = useState<string[]>(['initial']);
  const [currentTab, setCurrentTab] = useState<string>('initial');
  const [tabsInfo, setTabsInfo] = useState<{ [key: string]: TabInfo }>({
    initial: { url: 'https://www.google.com', title: 'New Tab' }
  });
  const [currentUrl, setCurrentUrl] = useState<string>('https://www.google.com');
  const [canGoBack, setCanGoBack] = useState<boolean>(false);
  const [canGoForward, setCanGoForward] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: '1',
      url: 'https://www.google.com',
      title: 'Google',
      timestamp: Date.now() - 1000 * 60 * 5, // 5 minutes ago
      favicon: 'https://www.google.com/favicon.ico'
    },
    {
      id: '2',
      url: 'https://github.com',
      title: 'GitHub: Let\'s build from here',
      timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
      favicon: 'https://github.githubassets.com/favicons/favicon.svg'
    },
    {
      id: '3',
      url: 'https://www.youtube.com',
      title: 'YouTube',
      timestamp: Date.now() - 1000 * 60 * 60, // 1 hour ago
      favicon: 'https://www.youtube.com/favicon.ico'
    },
    {
      id: '4',
      url: 'https://www.wikipedia.org',
      title: 'Wikipedia',
      timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
      favicon: 'https://www.wikipedia.org/static/favicon/wikipedia.ico'
    }
  ]);

  const [downloads, setDownloads] = useState<DownloadItem[]>([
    {
      id: '1',
      filename: 'report.pdf',
      url: 'https://example.com/report.pdf',
      size: '2.4 MB',
      status: 'completed',
      timestamp: Date.now() - 1000 * 60 * 10, // 10 minutes ago
      fileType: 'document'
    },
    {
      id: '2',
      filename: 'photo.jpg',
      url: 'https://example.com/photo.jpg',
      size: '1.2 MB',
      status: 'completed',
      timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
      fileType: 'image'
    },
    {
      id: '3',
      filename: 'presentation.pptx',
      url: 'https://example.com/presentation.pptx',
      size: '5.7 MB',
      status: 'in_progress',
      progress: 45,
      timestamp: Date.now() - 1000 * 60 * 5, // 5 minutes ago
      fileType: 'document'
    },
    {
      id: '4',
      filename: 'archive.zip',
      url: 'https://example.com/archive.zip',
      size: '10.1 MB',
      status: 'failed',
      timestamp: Date.now() - 1000 * 60 * 15, // 15 minutes ago
      fileType: 'archive'
    }
  ]);
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([
    { title: 'BRAC Univ...', url: 'https://www.bracu.ac.bd', favicon: 'https://www.bracu.ac.bd/sites/default/files/favicon.ico' },
    { title: 'GitHub', url: 'https://github.com', favicon: 'https://github.githubassets.com/favicons/favicon.svg' },
    { title: 'Grok', url: 'https://grok.x.ai', favicon: '' },
    { title: 'BRAC Univ...', url: 'https://www.bracu.ac.bd/academics', favicon: 'https://www.bracu.ac.bd/sites/default/files/favicon.ico' },
    { title: 'PreProd', url: 'https://preprod.example.com', favicon: '' },
    { title: 'Google', url: 'https://www.google.com', favicon: 'https://www.google.com/favicon.ico' },
    { title: 'YouTube', url: 'https://www.youtube.com', favicon: 'https://www.youtube.com/favicon.ico' },
    { title: 'Twitter', url: 'https://twitter.com', favicon: 'https://twitter.com/favicon.ico' },
  ]);

  const router = useRouter();
  const { isPrivateMode } = usePrivacyContext();

  // Load bookmarks from storage
  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const storedBookmarks = await store.getItem('bookmarks');
        if (storedBookmarks) {
          setBookmarks(JSON.parse(storedBookmarks));
        }
      } catch (error) {
        console.error('Failed to load bookmarks:', error);
      }
    };

    loadBookmarks();
  }, []);

  // Save bookmarks to storage when they change
  useEffect(() => {
    const saveBookmarks = async () => {
      try {
        await store.setItem('bookmarks', JSON.stringify(bookmarks));
      } catch (error) {
        console.error('Failed to save bookmarks:', error);
      }
    };

    saveBookmarks();
  }, [bookmarks]);

  // Load history from storage
  useEffect(() => {
    const loadHistory = async () => {
      if (isPrivateMode) {
        // Don't load history in private mode
        setHistory([]);
        return;
      }

      try {
        const storedHistory = await store.getItem('browserHistory');
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        }
      } catch (error) {
        console.error('Failed to load history:', error);
      }
    };

    loadHistory();
  }, [isPrivateMode]);

  // Save history to storage when it changes
  useEffect(() => {
    const saveHistory = async () => {
      if (isPrivateMode) {
        // Don't save history in private mode
        return;
      }

      try {
        await store.setItem('browserHistory', JSON.stringify(history));
      } catch (error) {
        console.error('Failed to save history:', error);
      }
    };

    saveHistory();
  }, [history, isPrivateMode]);

  // Load downloads from storage
  useEffect(() => {
    const loadDownloads = async () => {
      try {
        const storedDownloads = await store.getItem('downloads');
        if (storedDownloads) {
          setDownloads(JSON.parse(storedDownloads));
        }
      } catch (error) {
        console.error('Failed to load downloads:', error);
      }
    };

    loadDownloads();
  }, []);

  // Save downloads to storage when they change
  useEffect(() => {
    const saveDownloads = async () => {
      try {
        await store.setItem('downloads', JSON.stringify(downloads));
      } catch (error) {
        console.error('Failed to save downloads:', error);
      }
    };

    saveDownloads();
  }, [downloads]);

  const addNewTab = useCallback(() => {
    const newTabId = generateUUID();
    setTabs(prevTabs => [...prevTabs, newTabId]);
    setCurrentTab(newTabId);
    setTabsInfo(prev => ({
      ...prev,
      [newTabId]: { url: 'https://www.google.com', title: 'New Tab' }
    }));
    setCurrentUrl('https://www.google.com');
    router.push('/');
  }, [router]);

  const removeTab = useCallback((tabId: string) => {
    // Prevent removing the last tab
    if (tabs.length <= 1) {
      return;
    }

    setTabs(prevTabs => {
      const newTabs = prevTabs.filter(id => id !== tabId);

      // If the current tab is being removed, switch to another tab
      if (tabId === currentTab) {
        const currentIndex = prevTabs.indexOf(tabId);
        const newIndex = currentIndex > 0 ? currentIndex - 1 : 0;
        const newCurrentTab = newTabs[newIndex];
        setCurrentTab(newCurrentTab);

        // Update current URL to match the new tab
        if (tabsInfo[newCurrentTab]) {
          setCurrentUrl(tabsInfo[newCurrentTab].url);
        }
      }

      return newTabs;
    });

    // Remove tab info for the removed tab
    setTabsInfo(prev => {
      const newTabsInfo = { ...prev };
      delete newTabsInfo[tabId];
      return newTabsInfo;
    });
  }, [tabs, currentTab, tabsInfo]);

  const switchToTab = useCallback((tabId: string) => {
    setCurrentTab(tabId);
    if (tabsInfo[tabId]) {
      setCurrentUrl(tabsInfo[tabId].url);
    }
    // Navigate back to the browser screen
    router.push('/');
  }, [tabsInfo, router]);

  const updateTabInfo = useCallback((tabId: string, info: Partial<TabInfo>) => {
    setTabsInfo(prev => {
      const tabInfo = prev[tabId] || { url: '', title: 'New Tab' };
      return {
        ...prev,
        [tabId]: { ...tabInfo, ...info }
      };
    });
  }, []);

  const updateUrl = useCallback((url: string) => {
    setCurrentUrl(url);
    updateTabInfo(currentTab, { url });
  }, [currentTab, updateTabInfo]);

  const goBack = useCallback(() => {
    // WebView will handle the actual back navigation
    // This is just a placeholder for the functionality
  }, []);

  const goForward = useCallback(() => {
    // WebView will handle the actual forward navigation
    // This is just a placeholder for the functionality
  }, []);

  const refreshPage = useCallback(() => {
    // Triggering a re-render of WebView by updating the URL to the same value
    updateUrl(currentUrl);
  }, [currentUrl, updateUrl]);

  const addBookmark = useCallback((bookmark: Bookmark) => {
    setBookmarks(prev => {
      // Check if bookmark already exists
      const exists = prev.some(b => b.url === bookmark.url);
      if (exists) {
        return prev;
      }
      return [...prev, bookmark];
    });
  }, []);

  const removeBookmark = useCallback((url: string) => {
    setBookmarks(prev => prev.filter(b => b.url !== url));
  }, []);

  const loadInitialUrl = useCallback(() => {
    if (tabsInfo[currentTab]) {
      setCurrentUrl(tabsInfo[currentTab].url);
    }
  }, [currentTab, tabsInfo]);

  const navigateToUrl = useCallback((url: string) => {
    setCurrentUrl(url);
    updateTabInfo(currentTab, { url });
    router.push('/');
  }, [currentTab, updateTabInfo, router]);

  // History management functions
  const addHistoryItem = useCallback((item: Omit<HistoryItem, 'id'>) => {
    if (isPrivateMode) {
      // Don't add history in private mode
      return;
    }

    setHistory(prev => {
      // Check if URL already exists in history
      const existingIndex = prev.findIndex(h => h.url === item.url);

      if (existingIndex !== -1) {
        // Update existing entry with new timestamp
        const newHistory = [...prev];
        newHistory[existingIndex] = {
          ...newHistory[existingIndex],
          title: item.title || newHistory[existingIndex].title,
          timestamp: Date.now(),
          favicon: item.favicon || newHistory[existingIndex].favicon
        };
        return newHistory;
      } else {
        // Add new entry
        return [{
          id: generateUUID(),
          ...item,
          timestamp: Date.now()
        }, ...prev];
      }
    });
  }, [isPrivateMode]);

  const removeHistoryItem = useCallback((id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  // Download management functions
  const addDownloadItem = useCallback((item: Omit<DownloadItem, 'id'>) => {
    setDownloads(prev => [
      {
        id: generateUUID(),
        ...item,
        timestamp: Date.now()
      },
      ...prev
    ]);
  }, []);

  const updateDownloadProgress = useCallback((id: string, progress: number) => {
    setDownloads(prev => {
      const index = prev.findIndex(item => item.id === id);
      if (index === -1) return prev;

      const newDownloads = [...prev];
      newDownloads[index] = {
        ...newDownloads[index],
        progress,
        status: progress >= 100 ? 'completed' : 'in_progress'
      };
      return newDownloads;
    });
  }, []);

  const removeDownloadItem = useCallback((id: string) => {
    setDownloads(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearDownloads = useCallback(() => {
    setDownloads([]);
  }, []);

  const value = {
    tabs,
    currentTab,
    currentUrl,
    tabsInfo,
    bookmarks,
    shortcuts,
    history,
    downloads,
    navigation: {
      canGoBack,
      canGoForward
    },
    isLoading,
    addNewTab,
    removeTab,
    switchToTab,
    updateTabInfo,
    updateUrl,
    setCurrentUrl,
    goBack,
    goForward,
    refreshPage,
    setCanGoBack,
    setCanGoForward,
    setIsLoading,
    addBookmark,
    removeBookmark,
    addHistoryItem,
    removeHistoryItem,
    clearHistory,
    addDownloadItem,
    updateDownloadProgress,
    removeDownloadItem,
    clearDownloads,
    loadInitialUrl,
    navigateToUrl
  };

  return (
    <BrowserContext.Provider value={value}>
      {children}
    </BrowserContext.Provider>
  );
}

export const useBrowserContext = () => {
  const context = useContext(BrowserContext);
  if (!context) {
    throw new Error('useBrowserContext must be used within a BrowserProvider');
  }
  return context;
};