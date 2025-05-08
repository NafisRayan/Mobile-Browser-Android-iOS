import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

interface PrivacyContextType {
  isPrivateMode: boolean;
  adBlockingEnabled: boolean;
  cookieControlEnabled: boolean;
  fingerprintProtectionEnabled: boolean;
  httpsOnlyEnabled: boolean;
  scriptBlockingEnabled: boolean;
  togglePrivateMode: () => void;
  toggleAdBlocking: () => void;
  toggleCookieControl: () => void;
  toggleFingerprintProtection: () => void;
  toggleHttpsOnly: () => void;
  toggleScriptBlocking: () => void;
  clearBrowsingData: () => void;
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
const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

export function PrivacyProvider({ children }: { children: ReactNode }) {
  const [isPrivateMode, setIsPrivateMode] = useState<boolean>(false);
  const [adBlockingEnabled, setAdBlockingEnabled] = useState<boolean>(true);
  const [cookieControlEnabled, setCookieControlEnabled] = useState<boolean>(true);
  const [fingerprintProtectionEnabled, setFingerprintProtectionEnabled] = useState<boolean>(true);
  const [httpsOnlyEnabled, setHttpsOnlyEnabled] = useState<boolean>(true);
  const [scriptBlockingEnabled, setScriptBlockingEnabled] = useState<boolean>(false);

  // Load privacy settings from storage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await store.getItem('privacySettings');
        if (storedSettings) {
          const settings = JSON.parse(storedSettings);
          setAdBlockingEnabled(settings.adBlockingEnabled ?? true);
          setCookieControlEnabled(settings.cookieControlEnabled ?? true);
          setFingerprintProtectionEnabled(settings.fingerprintProtectionEnabled ?? true);
          setHttpsOnlyEnabled(settings.httpsOnlyEnabled ?? true);
          setScriptBlockingEnabled(settings.scriptBlockingEnabled ?? false);
        }
      } catch (error) {
        console.error('Failed to load privacy settings:', error);
      }
    };
    
    loadSettings();
  }, []);

  // Save privacy settings to storage when they change
  useEffect(() => {
    const saveSettings = async () => {
      try {
        const settings = {
          adBlockingEnabled,
          cookieControlEnabled,
          fingerprintProtectionEnabled,
          httpsOnlyEnabled,
          scriptBlockingEnabled
        };
        await store.setItem('privacySettings', JSON.stringify(settings));
      } catch (error) {
        console.error('Failed to save privacy settings:', error);
      }
    };
    
    saveSettings();
  }, [
    adBlockingEnabled,
    cookieControlEnabled,
    fingerprintProtectionEnabled,
    httpsOnlyEnabled,
    scriptBlockingEnabled
  ]);

  const togglePrivateMode = useCallback(() => {
    setIsPrivateMode(prev => !prev);
  }, []);

  const toggleAdBlocking = useCallback(() => {
    setAdBlockingEnabled(prev => !prev);
  }, []);

  const toggleCookieControl = useCallback(() => {
    setCookieControlEnabled(prev => !prev);
  }, []);

  const toggleFingerprintProtection = useCallback(() => {
    setFingerprintProtectionEnabled(prev => !prev);
  }, []);

  const toggleHttpsOnly = useCallback(() => {
    setHttpsOnlyEnabled(prev => !prev);
  }, []);

  const toggleScriptBlocking = useCallback(() => {
    setScriptBlockingEnabled(prev => !prev);
  }, []);

  const clearBrowsingData = useCallback(async () => {
    // Clear local storage (for web) 
    if (Platform.OS === 'web') {
      try {
        // Keep only privacy settings
        const settings = localStorage.getItem('privacySettings');
        localStorage.clear();
        if (settings) {
          localStorage.setItem('privacySettings', settings);
        }
        
        // Clear session storage
        sessionStorage.clear();
        
        // Clear cookies
        document.cookie.split(';').forEach(cookie => {
          document.cookie = cookie
            .replace(/^ +/, '')
            .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
        });
      } catch (error) {
        console.error('Error clearing browsing data:', error);
      }
    }
    
    // For native platforms, WebView handles this internally via the incognito mode
  }, []);

  const value = {
    isPrivateMode,
    adBlockingEnabled,
    cookieControlEnabled,
    fingerprintProtectionEnabled,
    httpsOnlyEnabled,
    scriptBlockingEnabled,
    togglePrivateMode,
    toggleAdBlocking,
    toggleCookieControl,
    toggleFingerprintProtection,
    toggleHttpsOnly,
    toggleScriptBlocking,
    clearBrowsingData
  };

  return (
    <PrivacyContext.Provider value={value}>
      {children}
    </PrivacyContext.Provider>
  );
}

export const usePrivacyContext = () => {
  const context = useContext(PrivacyContext);
  if (!context) {
    throw new Error('usePrivacyContext must be used within a PrivacyProvider');
  }
  return context;
};