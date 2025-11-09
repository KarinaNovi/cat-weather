import React from 'react';
import styles from './WindWidget.module.scss';
import { getWindDirection } from '../../utils/weatherUtils';

interface WindWidgetProps {
  windSpeed: number;
  windGustsMax: number;
  windSpeedMax: number;
  windDirection: number;
}

const WindWidget: React.FC<WindWidgetProps> = ({
  windSpeed,
  windGustsMax,
  windSpeedMax,
  windDirection,
}) => {
  return (
    <div className={styles.sunriseSunsetCard}>
      <div className={styles.icon}>🌬️</div>
      <div className={styles.info}>
        <h4 className={styles.title}>Ветер</h4>
        <p className={styles.weatherValue}>{windSpeed} км/ч</p>
        <div className={styles.details}>
          <div className={styles.row}>
            <span>Порывы:</span>
            <span>{windGustsMax} км/ч</span>
          </div>
          <div className={styles.row}>
            <span>Макс:</span>
            <span>{windSpeedMax} км/ч</span>
          </div>
          <div className={styles.windDirection}>
            <span
              className={styles.windArrow}
              style={{
                transform: `rotate(${windDirection}deg)`,
              }}
            >
              ↑
            </span>
            <span className={styles.windDirectionText}>
              {getWindDirection(windDirection)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WindWidget;
