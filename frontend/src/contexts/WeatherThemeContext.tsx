import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import weatherService, { WeatherData, WeatherTheme } from '../services/weatherService';

interface WeatherThemeContextType {
  weatherData: WeatherData | null;
  currentTheme: WeatherTheme;
  isLoading: boolean;
  error: string | null;
  refreshWeather: () => Promise<void>;
}

const WeatherThemeContext = createContext<WeatherThemeContextType | undefined>(undefined);

interface WeatherThemeProviderProps {
  children: ReactNode;
}

export const WeatherThemeProvider: React.FC<WeatherThemeProviderProps> = ({ children }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [currentTheme, setCurrentTheme] = useState<WeatherTheme>(
    weatherService.getThemeForWeather('default')
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshWeather = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await weatherService.getCurrentWeather();
      
      if (data) {
        setWeatherData(data);
        const theme = weatherService.getThemeForWeather(data.condition);
        setCurrentTheme(theme);
        applyThemeToDocument(theme);
      } else {
        // Fallback to default theme
        const defaultTheme = weatherService.getThemeForWeather('default');
        setCurrentTheme(defaultTheme);
        applyThemeToDocument(defaultTheme);
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError('Unable to fetch weather data');
      
      // Fallback to default theme
      const defaultTheme = weatherService.getThemeForWeather('default');
      setCurrentTheme(defaultTheme);
      applyThemeToDocument(defaultTheme);
    } finally {
      setIsLoading(false);
    }
  };

  const applyThemeToDocument = (theme: WeatherTheme) => {
    const root = document.documentElement;
    
    // Convert hex colors to HSL for Tailwind CSS variables
    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;
      
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      
      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };
    
    // Apply Tailwind CSS variables (these are used by the existing components)
    root.style.setProperty('--primary', hexToHsl(theme.colors.primary));
    root.style.setProperty('--secondary', hexToHsl(theme.colors.secondary));
    root.style.setProperty('--accent', hexToHsl(theme.colors.accent));
    root.style.setProperty('--background', hexToHsl(theme.colors.background));
    root.style.setProperty('--foreground', hexToHsl(theme.colors.foreground));
    root.style.setProperty('--muted', hexToHsl(theme.colors.muted));
    root.style.setProperty('--card', hexToHsl(theme.colors.card));
    root.style.setProperty('--border', hexToHsl(theme.colors.border));
    root.style.setProperty('--muted-foreground', hexToHsl(theme.colors.muted));
    
    // Also set the original CSS custom properties for direct usage
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-foreground', theme.colors.foreground);
    
    // Apply gradient colors
    root.style.setProperty('--gradient-from', theme.colors.gradient.from);
    if (theme.colors.gradient.via) {
      root.style.setProperty('--gradient-via', theme.colors.gradient.via);
    }
    root.style.setProperty('--gradient-to', theme.colors.gradient.to);
    
    // Update body background with gradient
    document.body.style.background = theme.colors.gradient.via 
      ? `linear-gradient(135deg, ${theme.colors.gradient.from} 0%, ${theme.colors.gradient.via} 50%, ${theme.colors.gradient.to} 100%)`
      : `linear-gradient(135deg, ${theme.colors.gradient.from} 0%, ${theme.colors.gradient.to} 100%)`;
    
    // Add transition for smooth theme changes
    document.body.style.transition = 'background 1s ease-in-out, color 1s ease-in-out';
    
    // Force a style recalculation
    root.style.display = 'none';
    void root.offsetHeight; // Trigger reflow
    root.style.display = '';
  };

  useEffect(() => {
    // Initial weather fetch
    refreshWeather();
    
    // Refresh weather every 30 minutes
    const interval = setInterval(refreshWeather, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const value: WeatherThemeContextType = {
    weatherData,
    currentTheme,
    isLoading,
    error,
    refreshWeather
  };

  return (
    <WeatherThemeContext.Provider value={value}>
      {children}
    </WeatherThemeContext.Provider>
  );
};

export const useWeatherTheme = (): WeatherThemeContextType => {
  const context = useContext(WeatherThemeContext);
  if (context === undefined) {
    throw new Error('useWeatherTheme must be used within a WeatherThemeProvider');
  }
  return context;
};