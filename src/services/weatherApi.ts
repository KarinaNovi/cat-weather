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
      hourly: 'relativehumidity_2m',
      //hourly: 'temperature_2m',
    },
  });
  return response.data;
};