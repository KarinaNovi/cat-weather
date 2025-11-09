import React from 'react';
import styles from './TemperatureWidget.module.scss';

interface TemperatureWidgetProps {
  currentTemp: number;
  tempMax: number;
  tempMin: number;
  feelsLikeMax: number;
}

const TemperatureWidget: React.FC<TemperatureWidgetProps> = ({
  currentTemp,
  tempMax,
  tempMin,
  feelsLikeMax,
}) => {
  return (
    <div className={styles.sunriseSunsetCard}>
      <div className={styles.icon}>🌡️</div>
      <div className={styles.info}>
        <h4 className={styles.title}>Температура</h4>
        <p className={styles.weatherValue}>{currentTemp}°C</p>
        <div className={styles.details}>
          <div className={styles.row}>
            <span>Макс:</span>
            <span>{tempMax}°C</span>
          </div>
          <div className={styles.row}>
            <span>Мин:</span>
            <span>{tempMin}°C</span>
          </div>
          <div className={styles.row}>
            <span>Ощущается:</span>
            <span>{feelsLikeMax}°C</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemperatureWidget;
