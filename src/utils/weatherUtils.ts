import cleanSkyIcon from "../assets/weather-icons/cleanSkyIcon.jpeg";
import snowIcon from "../assets/weather-icons/snowIcon.png";
import fogIcon from "../assets/weather-icons/fogIcon.jpeg";
import thunderIcon from "../assets/weather-icons/thunderIcon.jpeg";
import rainyIcon from "../assets/weather-icons/rainyIcon.jpeg";
import drizzleIcon from "../assets/weather-icons/drizzleIcon.jpeg";
import windyIcon from "../assets/weather-icons/windyIcon.jpeg";
import tornadoIcon from "../assets/weather-icons/tornadoIcon.jpeg";

export const getWeatherImage = (code: number): string => {
  const imageMap: Record<number, string> = {
    0: cleanSkyIcon,
    1: windyIcon,
    2: windyIcon,
    3: fogIcon,
    45: fogIcon,
    48: fogIcon,
    51: drizzleIcon,
    53: drizzleIcon,
    55: drizzleIcon,
    56: '/assets/weather-icons/freezing-drizzle.jpg',
    57: '/assets/weather-icons/freezing-drizzle.jpg',
    61: rainyIcon,
    63: rainyIcon,
    65: '/assets/weather-icons/heavy-rain.jpg',
    66: '/assets/weather-icons/freezing-rain.jpg',
    67: '/assets/weather-icons/freezing-rain.jpg',
    71: snowIcon,
    73: snowIcon,
    75: '/assets/weather-icons/heavy-snow.jpg',
    77: '/assets/weather-icons/snow-grains.jpg',
    80: '/assets/weather-icons/showers.jpg',
    81: '/assets/weather-icons/showers.jpg',
    82: '/assets/weather-icons/heavy-showers.jpg',
    85: '/assets/weather-icons/snow-showers.jpg',
    86: '/assets/weather-icons/snow-showers.jpg',
    95: thunderIcon,
    96: '/assets/weather-icons/thunderstorm-hail.jpg',
    99: '/assets/weather-icons/thunderstorm-hail.jpg',
  };
  
  return imageMap[code] || cleanSkyIcon; // fallback
};

// Описание погоды по коду
export const getWeatherDescription = (code: number): string => {
  const weatherMap: Record<number, string> = {
    0: 'Ясно',
    1: 'Преимущественно ясно',
    2: 'Переменная облачность',
    3: 'Пасмурно',
    45: 'Туман',
    48: 'Изморозь',
    51: 'Легкая морось',
    53: 'Умеренная морось',
    55: 'Сильная морось',
    56: 'Легкая ледяная морось',
    57: 'Сильная ледяная морось',
    61: 'Небольшой дождь',
    63: 'Умеренный дождь',
    65: 'Сильный дождь',
    66: 'Ледяной дождь',
    67: 'Сильный ледяной дождь',
    71: 'Небольшой снег',
    73: 'Умеренный снег',
    75: 'Сильный снег',
    77: 'Снежные зерна',
    80: 'Небольшие ливни',
    81: 'Умеренные ливни',
    82: 'Сильные ливни',
    85: 'Небольшие снегопады',
    86: 'Сильные снегопады',
    95: 'Гроза',
    96: 'Гроза с градом',
    99: 'Сильная гроза с градом',
  };
  
  return weatherMap[code] || 'Неизвестные погодные условия';
};

export  const getWeatherIcon = (code: number) => {
    const icons = {
      0: '☀️', // Ясно
      1: '⛅', // Преимущественно ясно
      2: '⛅', // Переменная облачность
      3: '☁️', // Пасмурно
      45: '🌫️', // Туман
      48: '🌫️', // Туман
      51: '🌧️', // Легкая морось
      53: '🌧️', // Умеренная морось
      55: '🌧️', // Сильная морось
      61: '🌧️', // Небольшой дождь
      63: '🌧️', // Умеренный дождь
      65: '🌧️', // Сильный дождь
      80: '🌧️', // Ливень
      81: '🌧️', // Сильный ливень
      82: '🌧️', // Очень сильный ливень
    };
    return icons[code] || '🌈';
  };

    export const getWindDirection = (degrees: number) => {
    const directions = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };