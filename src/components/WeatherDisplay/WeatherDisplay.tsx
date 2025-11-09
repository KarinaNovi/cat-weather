import React, { useState, useEffect, useRef } from "react";
import { getDominantColor } from "../../utils/colorUtils";
import {
  getWeatherDescription,
  getWeatherIcon,
  getWindDirection,
} from "../../utils/weatherUtils";
import { AreaChart, Area, Tooltip, ResponsiveContainer, XAxis, ReferenceLine } from "recharts";
import styles from "./WeatherDisplay.module.scss";
import SunriseSunsetWidget from '../SunriseSunsetWidget/SunriseSunsetWidget';
import TemperatureWidget from '../TemperatureWidget/TemperatureWidget';
import WindWidget from '../WindWidget/WindWidget';
import PrecipitationWidget from '../PrecipitationWidget/PrecipitationWidget';
import AdditionalInfoWidget from '../AdditionalInfoWidget/AdditionalInfoWidget';

const WeatherDisplay: React.FC<{ data: any; image: string }> = ({
  data,
  image,
}) => {
  const [bgColor, setBgColor] = useState("#87CEEB");
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    handleImageLoad();
  }, [image]);

  const handleImageLoad = () => {
    getDominantColor(image)
      .then((color) => setBgColor(color))
      .catch(() => setBgColor("#87CEEB"));
  };

  const prepareChartData = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDate();
    const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000; // Разница в мс от UTC
    const timezone = data.timezone; // Часовой пояс из API

    if (!data.hourly || !data.hourly.time || data.hourly.time.length === 0) {
      return [];
    }

    const chartHours: any[] = [];
    const allHourlyTimes = data.hourly.time;
    const allHourlyTemperatures = data.hourly.temperature_2m || [];
    const allHourlyHumidity = data.hourly.relative_humidity_2m || [];
    const allHourlyWindspeed = data.hourly.windspeed_10m || [];

    // Находим индекс начала текущего дня (00:00)
    let startIndex = allHourlyTimes.findIndex(time => {
      const date = new Date(time);
      return date.getDate() === currentDay && date.getHours() === 0;
    });

    // Если не нашли 00:00 текущего дня, начинаем с первого доступного часа
    if (startIndex === -1) {
      startIndex = 0;
    }

    // Определяем конец графика - 24 часа следующего дня
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + 1);
    endDate.setHours(23, 59, 59, 999);

    const endIndex = allHourlyTimes.findIndex(time => new Date(time) > endDate);
    const finalEndIndex = endIndex !== -1 ? endIndex : allHourlyTimes.length;


    for (let i = startIndex; i < finalEndIndex; i++) {
      const time = allHourlyTimes[i];
      const date = new Date(time);

      const isPast = date.getTime() < now.getTime(); // Сравниваем с текущим временем в локальном часовом поясе
      chartHours.push({
        fullTime: date,
        time: `${date.getHours()}:00`,
        humidity: allHourlyHumidity[i] || 0,
        temperature: allHourlyTemperatures[i] || 0,
        windspeed: allHourlyWindspeed[i] || 0,
        isPast,
      });
    }

    return chartHours.sort((a, b) => a.fullTime - b.fullTime);
  };

  const chartData = prepareChartData();

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateDaylightDuration = () => {
    if (!data.daily || !data.daily.sunrise || !data.daily.sunset) return "";

    const sunrise = new Date(data.daily.sunrise[0]);
    const sunset = new Date(data.daily.sunset[0]);
    const duration = sunset.getTime() - sunrise.getTime();

    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}ч ${minutes}м`;
  };

  const currentWeather = data.current_weather
    ? {
        currentTemp: Math.round(data.current_weather.temperature ?? 0),
        weatherCode: data.current_weather.weathercode ?? 0,
        windSpeed: data.current_weather.windspeed ?? 0,
        windDirection: data.current_weather.winddirection ?? 0,
      }
    : null;

  const today = data.daily
    ? {
        tempMax: Math.round(data.daily.temperature_2m_max[0]),
        tempMin: Math.round(data.daily.temperature_2m_min[0]),
        feelsLikeMax: Math.round(data.daily.apparent_temperature_max[0]),
        feelsLikeMin: Math.round(data.daily.apparent_temperature_min[0]),
        sunrise: data.daily.sunrise[0],
        sunset: data.daily.sunset[0],
        uvIndex: data.daily.uv_index_max[0],
        precipitation: data.daily.precipitation_sum[0],
        precipitationHours: data.daily.precipitation_hours[0],
        windSpeedMax: data.daily.wind_speed_10m_max[0],
        windGustsMax: data.daily.wind_gusts_10m_max[0],
        windDirection: data.daily.wind_direction_10m_dominant[0],
        solarRadiation: data.daily.shortwave_radiation_sum[0],
      }
    : null;

  return (
    <div
      className={styles.weatherContainer}
      style={{
        background: `linear-gradient(135deg, ${bgColor} 0%, ${lightenColor(
          bgColor,
          30
        )} 100%)`,
      }}
    >
      {currentWeather && (
      <div className={styles.weatherOverlay}>
        <div className={styles.summary}>
          <h2 className={styles.summary.cityName}>
            {data.cityName} {getWeatherIcon(currentWeather.weatherCode)}
          </h2>
          <span className={styles.summary.span}>
            {currentWeather.currentTemp} °C
          </span>
          <span className={styles.summary.span}>
            {getWeatherDescription(currentWeather.weatherCode)}
          </span>
        </div>

        {today && (
          <div className={styles.weatherGrid}>
            {/* Виджет температуры */}
            <TemperatureWidget
              currentTemp={currentWeather.currentTemp}
              tempMax={today.tempMax}
              tempMin={today.tempMin}
              feelsLikeMax={today.feelsLikeMax}
            />

            {/* Виджет ветра */}
            <WindWidget
              windSpeed={currentWeather.windSpeed}
              windGustsMax={today.windGustsMax}
              windSpeedMax={today.windSpeedMax}
              windDirection={currentWeather.windDirection}
            />

            {/* Виджет восхода и захода солнца */}
            <SunriseSunsetWidget
              sunrise={today.sunrise}
              sunset={today.sunset}
            />

            {/* Виджет осадков */}
            <PrecipitationWidget
              precipitation={today.precipitation}
              precipitationHours={today.precipitationHours}
              humidity={data.hourly.relative_humidity_2m[0]}
            />

            {/* Виджет дополнительной информации */}
            <AdditionalInfoWidget
              daylightDuration={calculateDaylightDuration()}
              windDirectionDominant={today.windDirection}
              feelsLikeMin={today.feelsLikeMin}
            />
          </div>
        )}

        {/* График изменения влажности */}
        <div className={styles.chartContainer}>
          <h3>Влажность</h3>
          <ResponsiveContainer width="100%" height={60}>
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#fff', fontSize: 10 }} 
              />
              <ReferenceLine 
                x={`${new Date().getHours()}:00`} 
                stroke="#fff" 
                strokeDasharray="3 3" 
                position="end"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div
                        style={{
                          background: "rgba(0, 0, 0, 0.7)",
                          border: "none",
                          borderRadius: "8px",
                          padding: "5px 10px",
                          color: "white",
                          fontSize: "12px",
                        }}
                      >
                        <p>{`${payload[0].payload.time}`}</p>
                        <p>{`Влажность: ${payload[0].value}%`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="humidity"
                stroke="#8884d8"
                fill="rgba(136, 132, 216, 0.3)"
                strokeWidth={2}
                activeDot={{
                  stroke: "#fff",
                  strokeWidth: 2,
                  r: 5,
                  fill: "#8884d8",
                }}
                isAnimationActive={false}
                data={chartData.filter(d => !d.isPast)}
              />
              <Area
                type="monotone"
                dataKey="humidity"
                stroke="#8884d8"
                fill="rgba(136, 132, 216, 0.1)"
                strokeWidth={2}
                activeDot={false}
                isAnimationActive={false}
                data={chartData.filter(d => d.isPast)}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* График изменения температуры */}
        <div className={styles.chartContainer}>
          <h3>Температура</h3>
          <ResponsiveContainer width="100%" height={60}>
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#fff', fontSize: 10 }} 
              />
              <ReferenceLine 
                x={`${new Date().getHours()}:00`} 
                stroke="#fff" 
                strokeDasharray="3 3" 
                position="end"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div
                        style={{
                          background: "rgba(0, 0, 0, 0.7)",
                          border: "none",
                          borderRadius: "8px",
                          padding: "5px 10px",
                          color: "white",
                          fontSize: "12px",
                        }}
                      >
                        <p>{`${payload[0].payload.time}`}</p>
                        <p>{`Температура: ${payload[0].value}°C`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="temperature"
                stroke="#8884d8"
                fill="rgba(136, 132, 216, 0.3)"
                strokeWidth={2}
                activeDot={{
                  stroke: "#fff",
                  strokeWidth: 2,
                  r: 5,
                  fill: "#8884d8",
                }}
                isAnimationActive={false}
                data={chartData.filter(d => !d.isPast)}
              />
              <Area
                type="monotone"
                dataKey="temperature"
                stroke="#8884d8"
                fill="rgba(136, 132, 216, 0.1)"
                strokeWidth={2}
                activeDot={false}
                isAnimationActive={false}
                data={chartData.filter(d => d.isPast)}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* График изменения скорости ветра */}
        <div className={styles.chartContainer}>
          <h3>Скорость ветра</h3>
          <ResponsiveContainer width="100%" height={60}>
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#fff', fontSize: 10 }}
              />
              <ReferenceLine
                x={`${new Date().getHours()}:00`}
                stroke="#fff"
                strokeDasharray="3 3"
                position="end"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div
                        style={{
                          background: "rgba(0, 0, 0, 0.7)",
                          border: "none",
                          borderRadius: "8px",
                          padding: "5px 10px",
                          color: "white",
                          fontSize: "12px",
                        }}
                      >
                        <p>{`${payload[0].payload.time}`}</p>
                        <p>{`Скорость ветра: ${payload[0].value} км/ч`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="windspeed"
                stroke="#ffc658"
                fill="rgba(255, 198, 88, 0.3)"
                strokeWidth={2}
                activeDot={{
                  stroke: "#fff",
                  strokeWidth: 2,
                  r: 5,
                  fill: "#ffc658",
                }}
                isAnimationActive={false}
                data={chartData.filter(d => !d.isPast)}
              />
              <Area
                type="monotone"
                dataKey="windspeed"
                stroke="#ffc658"
                fill="rgba(255, 198, 88, 0.1)"
                strokeWidth={2}
                activeDot={false}
                isAnimationActive={false}
                data={chartData.filter(d => d.isPast)}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
       )}
    </div>
             
  );
};

// Вспомогательная функция для осветления цвета
const lightenColor = (color: string, percent: number): string => {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;

  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  )
    .toString(16)
    .slice(1)}`;
};

export default WeatherDisplay;
