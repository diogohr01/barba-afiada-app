
import React, { createContext, useContext, useMemo } from 'react';
import { getThemeColors } from '../config/appConfig';

// Create context for theme colors
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Get theme colors from configuration
  const themeColors = useMemo(() => getThemeColors(), []);
  
  // Create CSS variables for the theme colors
  React.useEffect(() => {
    const root = document.documentElement;
    
    // Set CSS variables based on theme colors
    Object.entries(themeColors).forEach(([key, value]) => {
      root.style.setProperty(`--${key.toLowerCase()}`, value);
    });
  }, [themeColors]);
  
  const value = useMemo(() => ({ colors: themeColors }), [themeColors]);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
