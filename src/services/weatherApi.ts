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
    },
  });
  return response.data;
};


// export const fetchWeather = async (city: Object) => {
//   const response = await axios
//       .get(
//         `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=4be91eddb95669a0ae602b58d3c50576`
//       );
//   return response.data;
// };