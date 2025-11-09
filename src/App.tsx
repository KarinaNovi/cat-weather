import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import WeatherDisplay from './components/WeatherDisplay/WeatherDisplay';
import { fetchWeather, fetchCities } from './services/weatherApi';
import { getWeatherImage, getWeatherDescription } from './utils/weatherUtils';
import styles from './App.module.scss';
import { useQuery } from '@tanstack/react-query';

interface WeatherData {
  // Добавьте сюда реальные поля, которые возвращает API
  // Например, current_weather, daily, hourly и т.д.
  current_weather: {
    temperature_2m: number;
    relative_humidity_2m: number;
    is_day: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
    rain: number;
    weather_code: number;
    precipitation: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
    rain_sum: number[];
    showers_sum: number[];
    snowfall_sum: number[];
    wind_speed_10m_max: number[];
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    rain: number[];
    weather_code: number[];
    snowfall: number[];
  };
  timezone: string;
  generationtime_ms: number;
  elevation: number;
  latitude: number;
  longitude: number;
  utc_offset_seconds: number;
  cityName?: string;
}

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
    () => fetchWeather(currentCity.latitude, currentCity.longitude),
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