import axios from 'axios';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

export const fetchCities = async (query: string) => {
  const response = await axios.get(GEOCODING_URL, {
    params: { name: query, count: 5, language: 'ru' },
  });
  return response.data.results || [];
};

export const fetchWeather = async (lat: number, lon: number) => {
  const response = await axios.get(WEATHER_URL, {
    params: {
      latitude: lat,
      longitude: lon,
      current_weather: true,
      //timezone: 'MSK',
      daily: ["weather_code", "temperature_2m_max", "temperature_2m_min", "sunset", "sunrise", "daylight_duration"],
	hourly: ["temperature_2m", "relative_humidity_2m", "rain", "weather_code", "snowfall"],
	current: ["temperature_2m", "relative_humidity_2m", "is_day", "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m", "rain", "weather_code"],
	forecast_days: 3,
    },
  });
  return response.data;
};