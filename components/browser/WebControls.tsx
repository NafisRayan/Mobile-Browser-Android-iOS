import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { ChevronLeft, ChevronRight, RotateCw, Layers, Chrome as Home } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface WebControlsProps {
  canGoBack: boolean;
  canGoForward: boolean;
  goBack: () => void;
  goForward: () => void;
  refresh: () => void;
  isPrivateMode: boolean;
}

export function WebControls({ 
  canGoBack, 
  canGoForward, 
  goBack, 
  goForward, 
  refresh,
  isPrivateMode
}: WebControlsProps) {
  const router = useRouter();
  
  const navigateToTabs = () => {
    router.navigate('/tabs');
  };
  
  const navigateHome = () => {
    router.navigate('/');
  };
  
  return (
    <View style={[styles.container, isPrivateMode && styles.privateContainer]}>
      <View style={styles.controlsGroup}>
        <TouchableOpacity 
          style={[styles.button, !canGoBack && styles.disabledButton]} 
          onPress={goBack}
          disabled={!canGoBack}
        >
          <ChevronLeft size={24} color={canGoBack ? '#FFFFFF' : '#535353'} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, !canGoForward && styles.disabledButton]} 
          onPress={goForward}
          disabled={!canGoForward}
        >
          <ChevronRight size={24} color={canGoForward ? '#FFFFFF' : '#535353'} />
        </TouchableOpacity>
      </View>

      <View style={styles.controlsGroup}>
        <TouchableOpacity style={styles.button} onPress={refresh}>
          <RotateCw size={22} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={navigateHome}>
          <Home size={22} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={navigateToTabs}>
          <Layers size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#121212',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#282828',
    ...Platform.select({
      web: {
        position: 'fixed',
        bottom: 65,
        left: 0,
        right: 0,
        zIndex: 100,
      },
    }),
  },
  privateContainer: {
    backgroundColor: '#121212',
    borderTopColor: '#282828',
  },
  controlsGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    padding: 12,
    borderRadius: 50,
    backgroundColor: '#282828',
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#181818',
    opacity: 0.5,
  },
});