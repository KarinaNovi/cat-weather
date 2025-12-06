import React from 'react';
import styles from './MoonWidget.module.scss';
import nightSkyIcon from '../../assets/weather-icons/nightSkyIcon.jpeg';

const MOCK_MOON = {
  phaseName: 'Полнолуние',
  lunarDayStart: 'Сегодня, 18:32',
  lunarDayEnd: 'Завтра, 06:14',
  nextFullMoon: '14 декабря 2025',
};

const MoonWidget: React.FC = () => {

  return (
    <div className={styles.sunriseSunsetCard}>
      <div className={styles.icon}>
        <img
          src={nightSkyIcon}
          alt="Полнолуние"
          className={styles.moonImage}
        />
      </div>
      <div className={styles.info}>
        <h4 className={styles.title}>Фаза Луны</h4>
        <p className={styles.weatherValue}>{MOCK_MOON.phaseName}</p>
        <div className={styles.details}>
          <div className={styles.row}>
            <span>Начало лунного дня:</span>
            <span>{MOCK_MOON.lunarDayStart}</span>
          </div>
          <div className={styles.row}>
            <span>Окончание лунного дня:</span>
            <span>{MOCK_MOON.lunarDayEnd}</span>
          </div>
          <div className={styles.row}>
            <span>Следующее полнолуние:</span>
            <span>{MOCK_MOON.nextFullMoon}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoonWidget;


