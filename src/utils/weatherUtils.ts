import cleanSkyIcon from "../assets/weather-icons/cleanSkyIcon.jpeg";
import snowIcon from "../assets/weather-icons/snowIcon.png";
import fogIcon from "../assets/weather-icons/fogIcon.jpeg";
import thunderIcon from "../assets/weather-icons/thunderIcon.jpeg";
import rainyIcon from "../assets/weather-icons/rainyIcon.jpeg";
import drizzleIcon from "../assets/weather-icons/drizzleIcon.jpeg";
import windyIcon from "../assets/weather-icons/windyIcon.jpeg";
import tornadoIcon from "../assets/weather-icons/tornadoIcon.jpeg";
// import freezingDrizzle from "../assets/weather-icons/freezing-drizzle.jpg"; // Отсутствует
const freezingDrizzle = cleanSkyIcon;
// import heavyRain from "../assets/weather-icons/heavy-rain.jpg"; // Отсутствует
const heavyRain = cleanSkyIcon;
// import freezingRain from "../assets/weather-icons/freezing-rain.jpg"; // Отсутствует
const freezingRain = cleanSkyIcon;
// import heavySnow from "../assets/weather-icons/heavy-snow.jpg"; // Отсутствует
const heavySnow = cleanSkyIcon;
// import snowGrains from "../assets/weather-icons/snow-grains.jpg"; // Отсутствует
const snowGrains = cleanSkyIcon;
// import showers from "../assets/weather-icons/showers.jpg"; // Отсутствует
const showers = cleanSkyIcon;
// import heavyShowers from "../assets/weather-icons/heavy-showers.jpg"; // Отсутствует
const heavyShowers = cleanSkyIcon;
// import snowShowers from "../assets/weather-icons/snow-showers.jpg"; // Отсутствует
const snowShowers = cleanSkyIcon;
// import thunderstormHail from "../assets/weather-icons/thunderstorm-hail.jpg"; // Отсутствует
const thunderstormHail = cleanSkyIcon;

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
    56: freezingDrizzle,
    57: freezingDrizzle,
    61: rainyIcon,
    63: rainyIcon,
    65: heavyRain,
    66: freezingRain,
    67: freezingRain,
    71: snowIcon,
    73: snowIcon,
    75: heavySnow,
    77: snowGrains,
    80: showers,
    81: showers,
    82: heavyShowers,
    85: snowShowers,
    86: snowShowers,
    95: thunderIcon,
    96: thunderstormHail,
    99: thunderstormHail,
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