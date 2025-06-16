import React from 'react';
import { useWeatherTheme } from '../contexts/WeatherThemeContext';
import weatherService from '../services/weatherService';

const ThemeDebugger: React.FC = () => {
  const { currentTheme, weatherData } = useWeatherTheme();
  const allThemes = weatherService.getAllThemes();

  const applyTheme = (themeName: string) => {
    const theme = allThemes[themeName];
    if (theme) {
      // Manually apply theme for testing
      const root = document.documentElement;
      
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
      
      // Apply Tailwind CSS variables
      root.style.setProperty('--primary', hexToHsl(theme.colors.primary));
      root.style.setProperty('--secondary', hexToHsl(theme.colors.secondary));
      root.style.setProperty('--accent', hexToHsl(theme.colors.accent));
      root.style.setProperty('--background', hexToHsl(theme.colors.background));
      root.style.setProperty('--foreground', hexToHsl(theme.colors.foreground));
      root.style.setProperty('--muted', hexToHsl(theme.colors.muted));
      root.style.setProperty('--card', hexToHsl(theme.colors.card));
      root.style.setProperty('--border', hexToHsl(theme.colors.border));
      
      // Update body background
      document.body.style.background = theme.colors.gradient.via 
        ? `linear-gradient(135deg, ${theme.colors.gradient.from} 0%, ${theme.colors.gradient.via} 50%, ${theme.colors.gradient.to} 100%)`
        : `linear-gradient(135deg, ${theme.colors.gradient.from} 0%, ${theme.colors.gradient.to} 100%)`;
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-card p-4 rounded-lg border shadow-lg max-w-sm">
      <h3 className="text-sm font-semibold mb-2">Theme Debugger</h3>
      
      <div className="text-xs mb-2">
        <p><strong>Current:</strong> {currentTheme.name}</p>
        <p><strong>Weather:</strong> {weatherData?.condition || 'none'}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-1">
        {Object.entries(allThemes).map(([key, theme]) => (
          <button
            key={key}
            onClick={() => applyTheme(key)}
            className="text-xs p-2 rounded bg-primary/10 hover:bg-primary/20 border"
            style={{ backgroundColor: theme.colors.primary + '20' }}
          >
            {theme.name}
          </button>
        ))}
      </div>
      
      <div className="mt-2 text-xs opacity-75">
        Click to test themes
      </div>
    </div>
  );
};

export default ThemeDebugger;