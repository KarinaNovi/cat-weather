import axios from "axios";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

export const fetchCities = async (query: string) => {
  const response = await axios.get(GEOCODING_URL, {
    params: { name: query, count: 5, language: "ru" },
  });
  return response.data.results || [];
};

export const fetchWeather = async (lat: number, lon: number) => {
  const response = await axios.get(WEATHER_URL, {
    params: {
      latitude: lat,
      longitude: lon,
      current_weather: true,
      timezone: "auto",
      daily: [
        "wind_speed_10m_max",
        "wind_gusts_10m_max",
        "weather_code",
        "temperature_2m_max",
        "temperature_2m_min",
        "apparent_temperature_max",
        "apparent_temperature_min",
        "sunrise",
        "sunset",
        "daylight_duration",
        "sunshine_duration",
        "uv_index_clear_sky_max",
        "uv_index_max",
        "rain_sum",
        "showers_sum",
        "snowfall_sum",
        "wind_direction_10m_dominant",
        "shortwave_radiation_sum",
        "precipitation_sum",
        "precipitation_hours",
      ],
      hourly: [
        "temperature_2m",
        "relative_humidity_2m",
        "rain",
        "weather_code",
        "snowfall",
      ],
      current: [
        "temperature_2m",
        "relative_humidity_2m",
        "is_day",
        "wind_speed_10m",
        "wind_direction_10m",
        "wind_gusts_10m",
        "rain",
        "weather_code",
        "precipitation",
      ],
      forecast_days: 3,
    },
  });
  return response.data;
};
