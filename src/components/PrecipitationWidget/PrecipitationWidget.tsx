import React from 'react';
import styles from './PrecipitationWidget.module.scss';

interface PrecipitationWidgetProps {
  precipitation: number;
  precipitationHours: number;
  humidity: number;
}

const PrecipitationWidget: React.FC<PrecipitationWidgetProps> = ({
  precipitation,
  precipitationHours,
  humidity,
}) => {
  return (
    <div className={styles.sunriseSunsetCard}>
      <div className={styles.icon}>🌧️</div>
      <div className={styles.info}>
        <h4 className={styles.title}>Осадки</h4>
        <p className={styles.weatherValue}>{precipitation} мм</p>
        <div className={styles.details}>
          <div className={styles.row}>
            <span>Часы с осадками:</span>
            <span>{precipitationHours} ч</span>
          </div>
          <div className={styles.row}>
            <span>Влажность:</span>
            <span>{humidity}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrecipitationWidget;
