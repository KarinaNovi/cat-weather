import React, { useState, useEffect, useRef } from "react";
import { getDominantColor } from "../../utils/colorUtils";
import {
  getWeatherDescription,
  getWeatherIcon,
  getWindDirection,
} from "../../utils/weatherUtils";
import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts";
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

  const prepareChartData = () => {
    const currentTime = new Date(data.current_weather.time);
    const currentHour = currentTime.getHours();
    const startIndex =
      data.hourly.time.findIndex(
        (time: string) => new Date(time).getHours() === currentHour
      ) || 0;

    return data.hourly.time
      .slice(startIndex, startIndex + 24)
      .map((time: string, index: number) => {
        const date = new Date(time);
        return {
          fullTime: date,
          time: `${date.getHours()}:00`,
          humidity: data.hourly.relative_humidity_2m[startIndex + index],
          temperature: data.hourly.temperature_2m?.[startIndex + index] || 0,
          windspeed: data.hourly.windspeed_10m?.[startIndex + index] || 0,
        };
      })
      .sort((a, b) => a.fullTime - b.fullTime); // Сортируем по времени
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

  // TODO: сделать типизацию наконец
  const today = data.daily
    ? {
        weatherCode: data.current_weather.weathercode,
        tempMax: data.daily.temperature_2m_max[0],
        tempMin: data.daily.temperature_2m_min[0],
        feelsLikeMax: data.daily.apparent_temperature_max[0],
        feelsLikeMin: data.daily.apparent_temperature_min[0],
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

        {today && (
          <div className={styles.weatherGrid}>
            {/* Виджет температуры */}
            <div className={styles.weatherCard}>
              <div className={styles.weatherIcon}>🌡️</div>
              <div className={styles.weatherInfo}>
                <span className={styles.weatherLabel}>Температура</span>
                <p className={styles.weatherValue}>
                  {data.current_weather.temperature}°C
                </p>
                <div className={styles.tempDetails}>
                  <div className={styles.tempRow}>
                    <span>Макс:</span>
                    <span>{today.tempMax}°C</span>
                  </div>
                  <div className={styles.tempRow}>
                    <span>Мин:</span>
                    <span>{today.tempMin}°C</span>
                  </div>
                  <div className={styles.tempRow}>
                    <span>Ощущается:</span>
                    <span>{today.feelsLikeMax}°C</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Виджет ветра */}
            <div className={styles.weatherCard}>
              <div className={styles.weatherIcon}>🌬️</div>
              <div className={styles.weatherInfo}>
                <span className={styles.weatherLabel}>Ветер</span>
                <p className={styles.weatherValue}>
                  {data.current_weather.windspeed} км/ч
                </p>
                <div className={styles.windDetails}>
                  <div className={styles.windRow}>
                    <span>Порывы:</span>
                    <span>{today.windGustsMax} км/ч</span>
                  </div>
                  <div className={styles.windRow}>
                    <span>Макс:</span>
                    <span>{today.windSpeedMax} км/ч</span>
                  </div>
                  <div className={styles.windDirection}>
                    <span
                      className={styles.windArrow}
                      style={{
                        transform: `rotate(${data.current_weather.winddirection}deg)`,
                      }}
                    >
                      ↑
                    </span>
                    <span className={styles.windDirectionText}>
                      {getWindDirection(data.current_weather.winddirection)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Виджет солнца */}
            <div className={styles.weatherCard}>
              <div className={styles.weatherIcon}>☀️</div>
              <div className={styles.weatherInfo}>
                <span className={styles.weatherLabel}>Солнце</span>
                <div className={styles.sunDetails}>
                  <div className={styles.sunRow}>
                    <span>Восход:</span>
                    <span>{formatTime(today.sunrise)}</span>
                  </div>
                  <div className={styles.sunRow}>
                    <span>Закат:</span>
                    <span>{formatTime(today.sunset)}</span>
                  </div>
                  <div className={styles.sunRow}>
                    <span>UV индекс:</span>
                    <span>{today.uvIndex}</span>
                  </div>
                  <div className={styles.sunRow}>
                    <span>Солнечная радиация:</span>
                    <span>
                      {Math.round(today.solarRadiation / 100) / 10} кВт/м²
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Виджет осадков */}
            <div className={styles.weatherCard}>
              <div className={styles.weatherIcon}>🌧️</div>
              <div className={styles.weatherInfo}>
                <span className={styles.weatherLabel}>Осадки</span>
                <p className={styles.weatherValue}>{today.precipitation} мм</p>
                <div className={styles.precipitationDetails}>
                  <div className={styles.precipitationRow}>
                    <span>Часы с осадками:</span>
                    <span>{today.precipitationHours} ч</span>
                  </div>
                  <div className={styles.precipitationRow}>
                    <span>Влажность:</span>
                    <span>{data.hourly.relative_humidity_2m[0]}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Виджет дополнительной информации */}
            <div className={styles.weatherCard}>
              <div className={styles.weatherIcon}>📊</div>
              <div className={styles.weatherInfo}>
                <span className={styles.weatherLabel}>Дополнительно</span>
                <div className={styles.additionalDetails}>
                  <div className={styles.additionalRow}>
                    <span>Погодный код:</span>
                    <span>{today.weatherCode}</span>
                  </div>
                  <div className={styles.additionalRow}>
                    <span>Преоб. направление ветра:</span>
                    <span>{getWindDirection(today.windDirection)}</span>
                  </div>
                  <div className={styles.additionalRow}>
                    <span>Ощущается мин:</span>
                    <span>{today.feelsLikeMin}°C</span>
                  </div>
                </div>
              </div>
            </div>
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
