import React from 'react';
import { useWeatherTheme } from '../contexts/WeatherThemeContext';
import { Cloud, Sun, CloudRain, Snowflake, Moon, RefreshCw } from 'lucide-react';

const WeatherWidget: React.FC = () => {
  const { weatherData, currentTheme, isLoading, error, refreshWeather } = useWeatherTheme();

  const getWeatherIcon = (condition: string, isAnimated: boolean = true) => {
    const iconClass = `w-6 h-6 ${isAnimated ? getAnimationClass(condition) : ''}`;
    
    switch (condition) {
      case 'sunny':
        return <Sun className={`${iconClass} text-yellow-500`} />;
      case 'cloudy':
        return <Cloud className={`${iconClass} text-gray-500`} />;
      case 'rainy':
        return <CloudRain className={`${iconClass} text-blue-500`} />;
      case 'snowy':
        return <Snowflake className={`${iconClass} text-blue-200`} />;
      case 'night':
        return <Moon className={`${iconClass} text-indigo-400`} />;
      default:
        return <Sun className={`${iconClass} text-yellow-500`} />;
    }
  };

  const getAnimationClass = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return 'animate-spin-slow';
      case 'cloudy':
        return 'animate-float';
      case 'rainy':
        return 'animate-bounce-subtle';
      case 'snowy':
        return 'animate-sway';
      case 'night':
        return 'animate-pulse-slow';
      default:
        return 'animate-pulse';
    }
  };

  if (isLoading) {
    return (
      <div className="weather-widget">
        <div className="flex items-center space-x-2 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading weather...</span>
        </div>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="weather-widget">
        <button
          onClick={refreshWeather}
          className="flex items-center space-x-2 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
        >
          <RefreshCw className="w-5 h-5" />
          <span className="text-sm">Retry Weather</span>
        </button>
      </div>
    );
  }

  return (
    <div className="weather-widget">
      <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
        <div className="relative">
          {getWeatherIcon(weatherData.condition)}
          
          {/* Floating particles for enhanced animation */}
          {weatherData.condition === 'snowy' && (
            <div className="absolute -inset-2 pointer-events-none">
              <div className="snowflake animate-snow-1">❄</div>
              <div className="snowflake animate-snow-2">❅</div>
              <div className="snowflake animate-snow-3">❆</div>
            </div>
          )}
          
          {weatherData.condition === 'rainy' && (
            <div className="absolute -inset-2 pointer-events-none">
              <div className="raindrop animate-rain-1">💧</div>
              <div className="raindrop animate-rain-2">💧</div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold">
              {weatherData.temperature}°C
            </span>
            <span className="text-xs opacity-75">
              {weatherData.location}
            </span>
          </div>
          <span className="text-xs opacity-75">
            {weatherData.description}
          </span>
        </div>
        
        <button
          onClick={refreshWeather}
          className="ml-auto p-1.5 rounded-full hover:bg-white/20 transition-all duration-300"
          title="Refresh weather"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      
      {/* Theme name indicator */}
      <div className="mt-2 text-center">
        <span className="text-xs opacity-50">
          {currentTheme.name} Theme
        </span>
      </div>
    </div>
  );
};

// Custom animations styles (to be added to CSS)
const customStyles = `
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes sway {
  0%, 100% { transform: translateX(0px) rotate(0deg); }
  25% { transform: translateX(-5px) rotate(-5deg); }
  75% { transform: translateX(5px) rotate(5deg); }
}

@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes snow-1 {
  0% { transform: translateY(-20px) translateX(0px); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(40px) translateX(10px); opacity: 0; }
}

@keyframes snow-2 {
  0% { transform: translateY(-25px) translateX(5px); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(45px) translateX(-5px); opacity: 0; }
}

@keyframes snow-3 {
  0% { transform: translateY(-30px) translateX(-3px); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(50px) translateX(8px); opacity: 0; }
}

@keyframes rain-1 {
  0% { transform: translateY(-15px) translateX(0px); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(30px) translateX(-3px); opacity: 0; }
}

@keyframes rain-2 {
  0% { transform: translateY(-20px) translateX(3px); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(35px) translateX(0px); opacity: 0; }
}

.animate-float { animation: float 3s ease-in-out infinite; }
.animate-sway { animation: sway 4s ease-in-out infinite; }
.animate-bounce-subtle { animation: bounce-subtle 2s ease-in-out infinite; }
.animate-spin-slow { animation: spin-slow 8s linear infinite; }
.animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }

.animate-snow-1 { animation: snow-1 3s linear infinite; }
.animate-snow-2 { animation: snow-2 4s linear infinite 0.5s; }
.animate-snow-3 { animation: snow-3 3.5s linear infinite 1s; }

.animate-rain-1 { animation: rain-1 1.5s linear infinite; }
.animate-rain-2 { animation: rain-2 1.8s linear infinite 0.3s; }

.snowflake, .raindrop {
  position: absolute;
  font-size: 8px;
  pointer-events: none;
  user-select: none;
}
`;

export default WeatherWidget;
export { customStyles };