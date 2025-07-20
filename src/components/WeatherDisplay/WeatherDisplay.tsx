import React, { useState, useEffect, useRef } from 'react';
import { getDominantColor } from '../../utils/colorUtils';
import { getWeatherDescription } from '../../utils/weatherUtils';
import styles from './WeatherDisplay.module.scss';

const WeatherDisplay: React.FC<{ data: any; image: string }> = ({ data, image }) => {
  const [bgColor, setBgColor] = useState('#87CEEB');
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    handleImageLoad();
  }, [image]);

  const handleImageLoad = () => {
      getDominantColor(image)
        .then(color => setBgColor(color))
        .catch(() => setBgColor('#87CEEB'));
  };

return (
  <div className={styles.weatherContainer} style={{ background: `linear-gradient(135deg, ${bgColor} 0%, ${lightenColor(bgColor, 30)} 100%)` }}>
    
    <div className={styles.weatherOverlay}>
      <h2 className={styles.cityName}>{data.cityName}</h2>
      
      <div className={styles.weatherGrid}>
        <div className={styles.weatherCard}>
          <span>Температура</span>
          <p>{data.current_weather.temperature}°C</p>
        </div>
        
        <div className={styles.weatherCard}>
          <span>Состояние</span>
          <p>{getWeatherDescription(data.current_weather.weathercode)}</p>
        </div>
        
        <div className={styles.weatherCard}>
          <span>Влажность</span>
          <p>{data.hourly.relativehumidity_2m[0]}%</p>
        </div>
        
        <div className={styles.weatherCard}>
          <span>Ветер</span>
          <p>{data.current_weather.windspeed} км/ч</p>
        </div>
      </div>
    </div>
  </div>
);
};

// Вспомогательная функция для осветления цвета
const lightenColor = (color: string, percent: number): string => {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  
  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1)}`;
};

export default WeatherDisplay;