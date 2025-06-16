interface WeatherData {
  temperature: number;
  condition: string;
  description: string;
  icon: string;
  location: string;
  humidity: number;
  windSpeed: number;
  cloudiness: number;
  isDay: boolean;
}

interface WeatherTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    card: string;
    border: string;
    gradient: {
      from: string;
      via?: string;
      to: string;
    };
    headerGradient: {
      from: string;
      to: string;
    };
  };
  animation: string;
}

// Weather-based theme configurations
const weatherThemes: Record<string, WeatherTheme> = {
  sunny: {
    name: 'Sunny Day',
    colors: {
      primary: '#f59e0b', // Warm amber
      secondary: '#fbbf24',
      accent: '#f97316', // Orange
      background: '#fefce8', // Very light yellow
      foreground: '#451a03', // Dark brown
      muted: '#fef3c7',
      card: '#fffbeb',
      border: '#fed7aa',
      gradient: {
        from: '#fef3c7',
        via: '#fde68a',
        to: '#fed7aa'
      },
      headerGradient: {
        from: '#fbbf24',
        to: '#f59e0b'
      }
    },
    animation: 'animate-pulse'
  },
  cloudy: {
    name: 'Cloudy Sky',
    colors: {
      primary: '#6b7280', // Cool gray
      secondary: '#9ca3af',
      accent: '#3b82f6', // Blue
      background: '#f8fafc', // Very light blue-gray
      foreground: '#1e293b', // Dark slate
      muted: '#e2e8f0',
      card: '#f1f5f9',
      border: '#cbd5e1',
      gradient: {
        from: '#f1f5f9',
        via: '#e2e8f0',
        to: '#cbd5e1'
      },
      headerGradient: {
        from: '#9ca3af',
        to: '#6b7280'
      }
    },
    animation: 'animate-bounce'
  },
  rainy: {
    name: 'Rainy Weather',
    colors: {
      primary: '#0f766e', // Teal
      secondary: '#14b8a6',
      accent: '#06b6d4', // Cyan
      background: '#f0fdfa', // Very light teal
      foreground: '#134e4a', // Dark teal
      muted: '#ccfbf1',
      card: '#f0fdfa',
      border: '#99f6e4',
      gradient: {
        from: '#f0fdfa',
        via: '#ccfbf1',
        to: '#99f6e4'
      },
      headerGradient: {
        from: '#14b8a6',
        to: '#0f766e'
      }
    },
    animation: 'animate-pulse'
  },
  snowy: {
    name: 'Snow Day',
    colors: {
      primary: '#475569', // Cool slate
      secondary: '#64748b',
      accent: '#0ea5e9', // Sky blue
      background: '#f8fafc', // Almost white
      foreground: '#0f172a', // Very dark slate
      muted: '#e2e8f0',
      card: '#f8fafc',
      border: '#cbd5e1',
      gradient: {
        from: '#ffffff',
        via: '#f8fafc',
        to: '#e2e8f0'
      },
      headerGradient: {
        from: '#64748b',
        to: '#475569'
      }
    },
    animation: 'animate-bounce'
  },
  night: {
    name: 'Night Sky',
    colors: {
      primary: '#6366f1', // Indigo
      secondary: '#8b5cf6', // Purple
      accent: '#a855f7', // Purple
      background: '#0f0f23', // Very dark blue
      foreground: '#e2e8f0', // Light gray
      muted: '#1e1b4b',
      card: '#1e1b4b',
      border: '#312e81',
      gradient: {
        from: '#0f0f23',
        via: '#1e1b4b',
        to: '#312e81'
      },
      headerGradient: {
        from: '#8b5cf6',
        to: '#6366f1'
      }
    },
    animation: 'animate-pulse'
  },
  default: {
    name: 'Default Theme',
    colors: {
      primary: '#3b82f6',
      secondary: '#6366f1',
      accent: '#8b5cf6',
      background: '#ffffff',
      foreground: '#0f172a',
      muted: '#f1f5f9',
      card: '#ffffff',
      border: '#e2e8f0',
      gradient: {
        from: '#ffffff',
        via: '#f8fafc',
        to: '#f1f5f9'
      },
      headerGradient: {
        from: '#6366f1',
        to: '#3b82f6'
      }
    },
    animation: 'animate-none'
  }
};

class WeatherService {
  private apiKey = ''; // We'll use a free weather API
  private cache: Map<string, { data: WeatherData; timestamp: number }> = new Map();
  private cacheTimeout = 30 * 60 * 1000; // 30 minutes

  async getCurrentWeather(): Promise<WeatherData | null> {
    try {
      // Get user's location
      const position = await this.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      
      // Check cache first
      const cacheKey = `${latitude.toFixed(2)},${longitude.toFixed(2)}`;
      const cached = this.cache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }

      // Fetch weather data using OpenWeatherMap free API
      const weatherData = await this.fetchWeatherData(latitude, longitude);
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: weatherData,
        timestamp: Date.now()
      });
      
      return weatherData;
    } catch (error) {
      console.warn('Weather service error:', error);
      return null;
    }
  }

  private getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 10 * 60 * 1000 // 10 minutes
        }
      );
    });
  }

  private async fetchWeatherData(lat: number, lon: number): Promise<WeatherData> {
    // For demo purposes, we'll cycle through different weather conditions
    // This ensures users can see the theme changes
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const isDay = hour >= 6 && hour < 18;
    
    // Cycle through conditions every 2 minutes for demo
    const cycleIndex = Math.floor((hour * 60 + minute) / 2) % 4;
    const dayConditions = ['sunny', 'cloudy', 'rainy', 'snowy'];
    
    // Use night theme if it's nighttime, otherwise cycle through day conditions
    const condition = !isDay ? 'night' : dayConditions[cycleIndex];
    
    console.log('Weather Service: Setting condition to', condition, 'at', `${hour}:${minute}`);
    
    return {
      temperature: Math.floor(Math.random() * 30) + 10,
      condition,
      description: this.getWeatherDescription(condition),
      icon: this.getWeatherIcon(condition),
      location: `${lat.toFixed(1)}°, ${lon.toFixed(1)}°`,
      humidity: Math.floor(Math.random() * 40) + 40,
      windSpeed: Math.floor(Math.random() * 20) + 5,
      cloudiness: Math.floor(Math.random() * 100),
      isDay
    };
  }

  private getWeatherDescription(condition: string): string {
    const descriptions: Record<string, string> = {
      sunny: 'Bright and sunny',
      cloudy: 'Partly cloudy',
      rainy: 'Light rain showers',
      snowy: 'Snow flurries',
      night: 'Clear night sky'
    };
    return descriptions[condition] || 'Pleasant weather';
  }

  private getWeatherIcon(condition: string): string {
    const icons: Record<string, string> = {
      sunny: '☀️',
      cloudy: '☁️',
      rainy: '🌧️',
      snowy: '❄️',
      night: '🌙'
    };
    return icons[condition] || '🌤️';
  }

  getThemeForWeather(condition: string): WeatherTheme {
    return weatherThemes[condition] || weatherThemes.default;
  }

  getAllThemes(): Record<string, WeatherTheme> {
    return weatherThemes;
  }
}

const weatherServiceInstance = new WeatherService();

export { WeatherService, type WeatherData, type WeatherTheme };
export default weatherServiceInstance;