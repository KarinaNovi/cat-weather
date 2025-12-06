import React from 'react';
import styles from './SunriseSunsetWidget.module.scss';
import { getDaylightDuration } from '../../utils/timeUtils';

interface SunriseSunsetWidgetProps {
  sunrise: string;
  sunset: string;
}

const SunriseSunsetWidget: React.FC<SunriseSunsetWidgetProps> = ({ sunrise, sunset }) => {
  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.sunriseSunsetCard}>
      <div className={styles.icon}>🌅</div>
      <div className={styles.info}>
        <h4 className={styles.title}>Солнечный день</h4>
        <div className={styles.row}>
          <span>Восход:</span>
          <span>{formatTime(sunrise)}</span>
        </div>
        <div className={styles.row}>
          <span>Закат:</span>
          <span>{formatTime(sunset)}</span>
        </div>
        <div className={styles.row}>
          <span>Длительность дня:</span>
          <span>{getDaylightDuration(sunrise, sunset)}</span>
        </div>
      </div>
    </div>
  );
};

export default SunriseSunsetWidget;
