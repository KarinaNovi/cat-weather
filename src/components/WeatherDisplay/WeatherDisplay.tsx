import React, { useState, useEffect, useRef } from "react";
import { getDominantColor } from "../../utils/colorUtils";
import { getWeatherDescription } from "../../utils/weatherUtils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "./WeatherDisplay.module.scss";

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

  const getWeatherIcon = (code: number) => {
    const icons = {
      0: "☀️", // Ясно
      1: "⛅", // Преимущественно ясно
      3: "☁️", // Пасмурно
      61: "🌧️", // Дождь
      // ...
    };
    return icons[code] || "🌈";
  };

  const prepareChartData = () => {
    const currentTime = new Date(data.current_weather.time);
    const currentHour = currentTime.getHours();

    // Находим индекс текущего часа
    const startIndex =
      data.hourly.time.findIndex(
        (time: string) => new Date(time).getHours() === currentHour
      ) || 0;

    // Берем 24 часа начиная с текущего
    return data.hourly.time
      .slice(startIndex, startIndex + 24)
      .map((time: string, index: number) => {
        const date = new Date(time);
        return {
          // Сохраняем полную дату для сортировки
          fullTime: date,
          // Форматируем для отображения
          time: `${date.getHours()}:00`,
          humidity: data.hourly.relative_humidity_2m[startIndex + index],
          temperature: data.hourly.temperature_2m?.[startIndex + index] || 0,
          windspeed: data.hourly.windspeed_10m?.[startIndex + index] || 0,
        };
      })
      .sort((a, b) => a.fullTime - b.fullTime); // Сортируем по времени
  };

  const chartData = prepareChartData();

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
      <div className={styles.weatherOverlay}>
        <div className={styles.summary}>
          <h2 className={styles.summary.cityName}>
            {data.cityName} {getWeatherIcon(data.current_weather.weathercode)}
          </h2>
          <span className={styles.summary.span}>
            {data.current_weather.temperature}°C
          </span>
          <span className={styles.summary.span}>
            {getWeatherDescription(data.current_weather.weathercode)}
          </span>
        </div>

        <div className={styles.weatherGrid}>
          <div className={styles.weatherCard}>
            <span>Влажность</span>
            <p>{data.hourly.relative_humidity_2m[0]}%</p>
          </div>

          <div className={styles.weatherCard}>
            <span>Ветер</span>
            <p>{data.current_weather.windspeed} км/ч</p>
          </div>
        </div>

        {/* График изменения влажности */}
        <div className={styles.chartContainer}>
          <h3>Влажность</h3>
          <ResponsiveContainer width="100%" height={60}>
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
            >
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
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
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
