import { useWindowDimensions } from 'react-native';

// Base dimensions for scaling (based on a standard phone size)
const baseWidth = 375;
const baseHeight = 812;

/**
 * A hook that provides responsive sizing based on screen dimensions
 * 
 * @returns Object with utility functions for responsive sizing
 */
export function useResponsiveSize() {
  const { width, height } = useWindowDimensions();
  
  // Scale factor based on screen width
  const widthScale = width / baseWidth;
  const heightScale = height / baseHeight;
  
  // Determine if the device is in landscape mode
  const isLandscape = width > height;
  
  // Determine device type based on screen width
  const isTablet = width >= 768;
  const isDesktop = width >= 1024;
  
  /**
   * Scale a size based on screen width
   * @param size The size to scale
   * @returns The scaled size
   */
  const wp = (size: number) => {
    return size * widthScale;
  };
  
  /**
   * Scale a size based on screen height
   * @param size The size to scale
   * @returns The scaled size
   */
  const hp = (size: number) => {
    return size * heightScale;
  };
  
  /**
   * Scale a size based on the smaller of width or height scale
   * Useful for fonts and elements that shouldn't be too large on tablets
   * @param size The size to scale
   * @returns The scaled size
   */
  const sp = (size: number) => {
    const scale = Math.min(widthScale, heightScale);
    return size * scale;
  };
  
  /**
   * Get responsive padding based on screen size
   * @returns Responsive padding values
   */
  const getResponsivePadding = () => {
    if (isDesktop) {
      return {
        paddingHorizontal: 24,
        paddingVertical: 16
      };
    }
    
    if (isTablet) {
      return {
        paddingHorizontal: 16,
        paddingVertical: 12
      };
    }
    
    return {
      paddingHorizontal: 8,
      paddingVertical: 8
    };
  };
  
  /**
   * Get responsive icon size based on screen size
   * @param baseSize Base icon size for phones
   * @returns Responsive icon size
   */
  const getIconSize = (baseSize: number) => {
    if (isDesktop) return baseSize * 1.25;
    if (isTablet) return baseSize * 1.15;
    return baseSize;
  };
  
  /**
   * Get responsive font size based on screen size
   * @param baseSize Base font size for phones
   * @returns Responsive font size
   */
  const getFontSize = (baseSize: number) => {
    if (isDesktop) return sp(baseSize * 1.2);
    if (isTablet) return sp(baseSize * 1.1);
    return sp(baseSize);
  };
  
  return {
    width,
    height,
    isLandscape,
    isTablet,
    isDesktop,
    wp,
    hp,
    sp,
    getResponsivePadding,
    getIconSize,
    getFontSize
  };
}
