import React from 'react';
import styles from './AdditionalInfoWidget.module.scss';
import { getWindDirection } from '../../utils/weatherUtils';

interface AdditionalInfoWidgetProps {
  daylightDuration: string;
  windDirectionDominant: number;
  feelsLikeMin: number;
}

const AdditionalInfoWidget: React.FC<AdditionalInfoWidgetProps> = ({
  daylightDuration,
  windDirectionDominant,
  feelsLikeMin,
}) => {
  return (
    <div className={styles.sunriseSunsetCard}>
      <div className={styles.icon}>📊</div>
      <div className={styles.info}>
        <h4 className={styles.title}>Дополнительно</h4>
        <div className={styles.details}>
          <div className={styles.row}>
            <span>Длительность светового дня:</span>
            <span>{daylightDuration}</span>
          </div>
          <div className={styles.row}>
            <span>Преоб. направление ветра:</span>
            <span>{getWindDirection(windDirectionDominant)}</span>
          </div>
          <div className={styles.row}>
            <span>Ощущается мин:</span>
            <span>{feelsLikeMin}°C</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfoWidget;
