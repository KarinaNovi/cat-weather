import React from 'react';
import styles from './SunriseSunsetWidget.module.scss';

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

  const calculateDaylightDuration = () => {
    const sunriseDate = new Date(sunrise);
    const sunsetDate = new Date(sunset);
    const duration = sunsetDate.getTime() - sunriseDate.getTime();

    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}ч ${minutes}м`;
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
          <span>{calculateDaylightDuration()}</span>
        </div>
      </div>
    </div>
  );
};

export default SunriseSunsetWidget;
