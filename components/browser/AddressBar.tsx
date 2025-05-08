import { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { Search, Lock, X, Menu } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface AddressBarProps {
  url: string;
  onSubmit: (url: string) => void;
  isLoading: boolean;
  isPrivateMode: boolean;
}

export function AddressBar({ url, onSubmit, isLoading, isPrivateMode }: AddressBarProps) {
  const [inputValue, setInputValue] = useState(url);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    if (url !== inputValue && !isFocused) {
      setInputValue(url);
    }
  }, [url]);

  const handleSubmit = () => {
    let processedUrl = inputValue.trim();
    if (processedUrl && !processedUrl.startsWith('http')) {
      if (processedUrl.includes(' ') || !processedUrl.includes('.')) {
        const searchEngine = 'https://www.google.com/search?q=';
        processedUrl = searchEngine + encodeURIComponent(processedUrl);
      } else {
        processedUrl = 'https://' + processedUrl;
      }
    }
    onSubmit(processedUrl);
    setIsFocused(false);
  };

  const handleClear = () => {
    setInputValue('');
  };
  
  const isSecure = url.startsWith('https://');
  
  return (
    <View style={[styles.container, isPrivateMode && styles.privateContainer]}>
      <View style={styles.addressBarContainer}>
        <View style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          isPrivateMode && styles.privateInputContainer,
          isFocused && isPrivateMode && styles.privateInputContainerFocused,
        ]}>
          {isLoading ? (
            <ActivityIndicator size="small" color={isPrivateMode ? '#1DB954' : '#1DB954'} style={styles.icon} />
          ) : (
            <>
              {isSecure ? (
                <Lock size={16} color={isPrivateMode ? '#1DB954' : '#1DB954'} style={styles.icon} />
              ) : (
                <Search size={16} color="#B3B3B3" style={styles.icon} />
              )}
            </>
          )}
          
          <TextInput
            style={[styles.input, isPrivateMode && styles.privateInput]}
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={handleSubmit}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search or enter website name"
            placeholderTextColor="#B3B3B3"
            autoCapitalize="none"
            keyboardType="url"
            returnKeyType="go"
            selectTextOnFocus
          />
          
          {inputValue !== '' && isFocused && (
            <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
              <X size={16} color="#B3B3B3" />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => router.push('/privacy')}
        >
          <Menu size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#121212',
    zIndex: 10,
  },
  privateContainer: {
    backgroundColor: '#121212',
  },
  addressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#282828',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: '#282828',
  },
  inputContainerFocused: {
    borderColor: '#1DB954',
    shadowColor: '#1DB954',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    ...Platform.select({
      android: {
        elevation: 2,
      },
    }),
  },
  privateInputContainer: {
    backgroundColor: '#282828',
    borderColor: '#282828',
  },
  privateInputContainerFocused: {
    borderColor: '#1DB954',
    shadowColor: '#1DB954',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#FFFFFF',
  },
  privateInput: {
    color: '#FFFFFF',
  },
  clearButton: {
    padding: 4,
  },
  menuButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#282828',
    justifyContent: 'center',
    alignItems: 'center',
  },
});