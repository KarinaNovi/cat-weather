import React, { useState } from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import WeatherDisplay from './components/WeatherDisplay/WeatherDisplay';
import { fetchWeatherWithCity } from './services/weatherApi';
import { getWeatherImage } from './utils/weatherUtils';
import styles from './App.module.scss';
import { useQuery } from '@tanstack/react-query';
import { WeatherData } from './types/weather';

// Дефолтные координаты Парижа
const DEFAULT_CITY = {
  name: 'Paris',
  latitude: 48.8566,
  longitude: 2.3522,
};

const App: React.FC = () => {
  const [currentCity, setCurrentCity] = useState(DEFAULT_CITY);
  // const [weatherData, setWeatherData] = useState<any>(null);
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  const { data: weatherData, isLoading, error } = useQuery<WeatherData>(
    ['weather', currentCity.latitude, currentCity.longitude],
    () =>
      fetchWeatherWithCity(
        currentCity.latitude,
        currentCity.longitude,
        currentCity.name
      ),
    { staleTime: 5 * 60 * 1000 } // Данные считаются свежими в течение 5 минут
  );

  // Загрузка погоды при смене города
  // useEffect(() => {
  //   const loadWeather = async () => {
  //     setIsLoading(true);
  //     setError(null);
  //     try {
  //       const data = await fetchWeather(currentCity.latitude, currentCity.longitude);
  //       setWeatherData({
  //         ...data,
  //         cityName: currentCity.name,
  //       });
  //     } catch (err) {
  //       setError('Failed to load weather data');
  //       console.error(err);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   loadWeather();
  // }, [currentCity]);

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