export interface WeatherCurrent {
  time: string;
  interval: number;
  temperature: number;
  windspeed: number;
  winddirection: number;
  is_day: number;
  weathercode: number;
}

export interface WeatherDaily {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
  uv_index_clear_sky_max: number[];
  rain_sum: number[];
  showers_sum: number[];
  snowfall_sum: number[];
  wind_speed_10m_max: number[];
  wind_gusts_10m_max: number[];
  wind_direction_10m_dominant: number[];
  shortwave_radiation_sum: number[];
  precipitation_sum: number[];
  precipitation_hours: number[];
}

export interface WeatherHourly {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  windspeed_10m: number[];
  rain: number[];
  weather_code: number[];
  snowfall: number[];
}

export interface WeatherData {
  current_weather: WeatherCurrent;
  daily: WeatherDaily;
  hourly: WeatherHourly;
  timezone: string;
  timezone_abbreviation: string;
  generationtime_ms: number;
  elevation: number;
  latitude: number;
  longitude: number;
  utc_offset_seconds: number;
  cityName?: string;
}
