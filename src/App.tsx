import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import WeatherDisplay from './components/WeatherDisplay/WeatherDisplay';
import { fetchWeather, fetchCities } from './services/weatherApi';
import { getWeatherImage, getWeatherDescription } from './utils/weatherUtils';
import styles from './App.module.scss';

// Дефолтные координаты Парижа
const DEFAULT_CITY = {
  name: 'Paris',
  latitude: 48.8566,
  longitude: 2.3522,
};

const App: React.FC = () => {
  const [currentCity, setCurrentCity] = useState(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка погоды при смене города
  useEffect(() => {
    const loadWeather = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchWeather(currentCity.latitude, currentCity.longitude);
        setWeatherData({
          ...data,
          cityName: currentCity.name,
        });
      } catch (err) {
        setError('Failed to load weather data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadWeather();
  }, [currentCity]);

  // Обработчик выбора города
  const handleCitySelect = (city: any) => {
    setCurrentCity({
      name: city.name,
      latitude: city.latitude,
      longitude: city.longitude,
    });
  };

  // Получаем изображение для текущей погоды
  const weatherImage = weatherData 
    ? getWeatherImage(weatherData.current_weather.weathercode) 
    : '';

  return (
    <div className={styles.appContainer} >
      <img 
            src={weatherImage} 
            className={styles.weatherImage}
          />
      
      <div className={styles.searchWrapper}>
        <SearchBar onSelect={handleCitySelect} />
      </div>

      {isLoading ? (
        <div className={styles.loader}>Loading...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : weatherData ? (
        <WeatherDisplay 
          data={weatherData} 
          image={weatherImage} 
        />
      ) : null}
    </div>
  );
};

export default App;