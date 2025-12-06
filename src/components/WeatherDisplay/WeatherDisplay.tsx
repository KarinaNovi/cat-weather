import React, { useState, useEffect, useMemo } from "react";
import { getDominantColor } from "../../utils/colorUtils";
import { getWeatherDescription, getWeatherIcon } from "../../utils/weatherUtils";
import { WeatherData } from "../../types/weather";
import {
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  ReferenceLine,
  ReferenceDot,
} from "recharts";
import styles from "./WeatherDisplay.module.scss";
import SunriseSunsetWidget from '../SunriseSunsetWidget/SunriseSunsetWidget';
import TemperatureWidget from '../TemperatureWidget/TemperatureWidget';
import WindWidget from '../WindWidget/WindWidget';
import PrecipitationWidget from '../PrecipitationWidget/PrecipitationWidget';
import AdditionalInfoWidget from '../AdditionalInfoWidget/AdditionalInfoWidget';

const WeatherDisplay: React.FC<{ data: WeatherData; image: string }> = ({
  data,
  image,
}) => {
  const [bgColor, setBgColor] = useState("#87CEEB");
  const [isHovering, setIsHovering] = useState<{ [key: string]: boolean }>({
    temperature: false,
    humidity: false,
    windspeed: false,
  });

  useEffect(() => {
    handleImageLoad();
  }, [image]);

  const handleImageLoad = () => {
    getDominantColor(image)
      .then((color) => setBgColor(color))
      .catch(() => setBgColor("#87CEEB"));
  };

  // Подготавливаем данные для графиков и находим "текущую" точку,
  // мемоизируем чтобы избежать лишних пересчётов и перерисовок графиков
  const {
    chartData,
    nowCity,
    currentChartIdx,
    currentChartTime,
    pastData,
    futureData,
  } = useMemo(() => {
    const empty = {
      chartData: [] as any[],
      nowCity: null as Date | null,
      currentChartIdx: 0,
      currentChartTime: null as Date | null,
      pastData: [] as any[],
      futureData: [] as any[],
    };

    if (!data?.hourly || !data.hourly.time) {
      return empty;
    }

    const offset = data.utc_offset_seconds || 0;

    const chartData = data.hourly.time.map((time, i) => {
      // API возвращает время в ISO формате (UTC), конвертируем в локальное время города
      const utcDate = new Date(time);
      const cityDate = new Date(utcDate.getTime() + offset * 1000);

      const day = cityDate.getDate().toString().padStart(2, "0");
      const month = (cityDate.getMonth() + 1).toString().padStart(2, "0");
      const timeStr = cityDate.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      });

      return {
        fullTime: cityDate,
        timestamp: cityDate.getTime(), // Для Recharts
        displayTime: `${day}.${month} ${timeStr}`,
        humidity: Math.round(data.hourly.relative_humidity_2m?.[i] ?? 0),
        temperature: Math.round(data.hourly.temperature_2m?.[i] ?? 0),
        windspeed: Math.round(data.hourly.windspeed_10m?.[i] ?? 0),
      };
    });

    // Текущее время в часовом поясе города без округления до часа
    const clientOffsetSeconds = -new Date().getTimezoneOffset() * 60;
    const nowCity = new Date(
      Date.now() + (offset - clientOffsetSeconds) * 1000
    );

    // Находим индекс первой точки, которая >= текущего времени города
    let currentChartIdx = chartData.findIndex(
      (d) => d.fullTime.getTime() >= nowCity.getTime()
    );
    if (currentChartIdx === -1) currentChartIdx = chartData.length; // всё прошлое

    // Определяем время для ReferenceLine (используем ближайшую точку к текущему времени)
    const currentChartTime =
      currentChartIdx < chartData.length
        ? chartData[currentChartIdx]?.fullTime
        : chartData.length > 0
        ? chartData[chartData.length - 1]?.fullTime
        : null;

    // pastData включает все точки до текущей включительно (для непрерывности линии)
    const pastData =
      currentChartIdx >= 0 ? chartData.slice(0, currentChartIdx + 1) : [];
    // futureData всегда начиная с текущей точки (может быть весь массив, если всё будущее)
    // Включаем текущую точку для непрерывности линии
    const futureData = chartData.slice(
      currentChartIdx >= 0 ? currentChartIdx : 0
    );

    return {
      chartData,
      nowCity,
      currentChartIdx,
      currentChartTime,
      pastData,
      futureData,
    };
  }, [data]);

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

  // УНИВЕРСАЛЬНЫЙ КАСТОМНЫЙ TOOLTIP
  const CustomTooltip = ({active, payload, chartData, currentChartIdx, param, isHovering}: {
    active?: boolean;
    payload?: any[];
    chartData: any[];
    currentChartIdx: number;
    param: string;
    isHovering: boolean;
  }) => {
    // Если активно наведение - показываем точку, на которую навели
    if (active && isHovering && payload && payload.length && payload[0].payload) {
      const point = payload[0].payload;
      let value;
      if (param === "temperature") value = `${point.temperature}°C`;
      else if (param === "humidity") value = `${point.humidity}%`;
      else if (param === "windspeed") value = `${point.windspeed} км/ч`;

      const isCurrentPoint =
        nowCity &&
        currentChartTime &&
        point.fullTime &&
        point.fullTime.getTime &&
        point.fullTime.getTime() === currentChartTime.getTime();

      const labelTime = isCurrentPoint
        ? nowCity.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        : point.displayTime;

      return (
        <div className={styles.chartTooltip}>
          <div className={styles.time}>{labelTime}</div>
          <div className={styles.value}>{value}</div>
        </div>
      );
    }

    // В состоянии без ховера показываем отдельный статичный тултип вне Recharts,
    // поэтому здесь ничего не рендерим
    return null;
  };

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
          <h2 className={styles.cityName}>
            {data.cityName} {getWeatherIcon(currentWeather.weatherCode)}
          </h2>
          <span className={styles.span}>
            {currentWeather.currentTemp} °C
          </span>
          <span className={styles.span}>
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
        <div 
          className={styles.chartContainer}
          onMouseEnter={() => setIsHovering(prev => ({ ...prev, temperature: true }))}
          onMouseLeave={() => setIsHovering(prev => ({ ...prev, temperature: false }))}
        >
          <h3>Температура</h3>

          {!isHovering.temperature && chartData.length > 0 && nowCity && (
            <div className={styles.staticTooltip}>
              <div className={styles.time}>
                {nowCity.toLocaleTimeString("ru-RU", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </div>
              <div className={styles.value}>
                {chartData[
                  currentChartIdx < chartData.length
                    ? currentChartIdx
                    : chartData.length - 1
                ]?.temperature}
                °C
              </div>
            </div>
          )}

          <ResponsiveContainer width="100%" height={90}>
            <AreaChart data={chartData} margin={{top:5,right:0,left:0,bottom:0}}>
              <XAxis
                dataKey='timestamp'
                type='number'
                scale='time'
                domain={['dataMin', 'dataMax']}
                tickFormatter={v => new Date(v).toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})}
                axisLine={false}
                tickLine={false}
                tick={{fill:'#fff', fontSize:12}}
              />
              {currentChartTime && (
                <ReferenceLine
                  x={currentChartTime.getTime()}
                  stroke="#ffffff"
                  strokeDasharray=""
                  strokeWidth={3}
                  ifOverflow="extendDomain"
                />
              )}
              {chartData.length > 0 && currentChartTime && (
                <ReferenceDot
                  x={currentChartTime.getTime()}
                  y={
                    chartData[
                      currentChartIdx < chartData.length
                        ? currentChartIdx
                        : chartData.length - 1
                    ]?.temperature
                  }
                  r={4}
                  fill="#ffffff"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              )}
              <Tooltip 
                content={props => (
                  <CustomTooltip
                    active={props.active}
                    payload={props.payload}
                    chartData={chartData}
                    currentChartIdx={currentChartIdx}
                    param='temperature'
                    isHovering={isHovering.temperature}
                  />
                )}
                active={true}
              />
              {pastData.length > 0 && (
                <Area type="monotone" dataKey="temperature" stroke="#b0b0b0" fill="rgba(180,180,180,0.18)" strokeWidth={2} dot={false} activeDot={false} isAnimationActive={false} data={pastData} />
              )}
              {futureData.length > 0 && (
                <Area type="monotone" dataKey="temperature" stroke="#8884d8" fill="rgba(136,132,216,0.32)" strokeWidth={2} dot={false} activeDot={{stroke:'#fff',strokeWidth:2,r:5,fill:'#8884d8'}} isAnimationActive={false} data={futureData} />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Влажность */}
        <div 
          className={styles.chartContainer}
          onMouseEnter={() => setIsHovering(prev => ({ ...prev, humidity: true }))}
          onMouseLeave={() => setIsHovering(prev => ({ ...prev, humidity: false }))}
        >
          <h3>Влажность</h3>

          {!isHovering.humidity && chartData.length > 0 && nowCity && (
            <div className={styles.staticTooltip}>
              <div className={styles.time}>
                {nowCity.toLocaleTimeString("ru-RU", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </div>
              <div className={styles.value}>
                {chartData[
                  currentChartIdx < chartData.length
                    ? currentChartIdx
                    : chartData.length - 1
                ]?.humidity}
                %
              </div>
            </div>
          )}

          <ResponsiveContainer width="100%" height={60}>
            <AreaChart data={chartData} margin={{top:5,right:0,left:0,bottom:0}}>
              <XAxis
                dataKey='timestamp'
                type='number'
                scale='time'
                domain={['dataMin', 'dataMax']}
                tickFormatter={v => new Date(v).toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})}
                axisLine={false}
                tickLine={false}
                tick={{fill:'#fff', fontSize:12}}
              />
              {currentChartTime && (
                <ReferenceLine
                  x={currentChartTime.getTime()}
                  stroke="#ffffff"
                  strokeDasharray=""
                  strokeWidth={3}
                  ifOverflow="extendDomain"
                />
              )}
              {chartData.length > 0 && currentChartTime && (
                <ReferenceDot
                  x={currentChartTime.getTime()}
                  y={
                    chartData[
                      currentChartIdx < chartData.length
                        ? currentChartIdx
                        : chartData.length - 1
                    ]?.humidity
                  }
                  r={4}
                  fill="#ffffff"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              )}
              <Tooltip 
                content={props => (
                  <CustomTooltip
                    active={props.active}
                    payload={props.payload}
                    chartData={chartData}
                    currentChartIdx={currentChartIdx}
                    param='humidity'
                    isHovering={isHovering.humidity}
                  />
                )}
                active={true}
              />
              {pastData.length > 0 && (
                <Area type="monotone" dataKey="humidity" stroke="#b0b0b0" fill="rgba(180,180,180,0.16)" strokeWidth={2} dot={false} activeDot={false} isAnimationActive={false} data={pastData} />
              )}
              {futureData.length > 0 && (
                <Area type="monotone" dataKey="humidity" stroke="#8884d8" fill="rgba(136,132,216,0.26)" strokeWidth={2} dot={false} activeDot={{stroke:'#fff',strokeWidth:2,r:5,fill:'#8884d8'}} isAnimationActive={false} data={futureData} />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Ветер */}
        <div 
          className={styles.chartContainer}
          onMouseEnter={() => setIsHovering(prev => ({ ...prev, windspeed: true }))}
          onMouseLeave={() => setIsHovering(prev => ({ ...prev, windspeed: false }))}
        >
          <h3>Скорость ветра</h3>

          {!isHovering.windspeed && chartData.length > 0 && nowCity && (
            <div className={styles.staticTooltip}>
              <div className={styles.time}>
                {nowCity.toLocaleTimeString("ru-RU", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </div>
              <div className={styles.value}>
                {chartData[
                  currentChartIdx < chartData.length
                    ? currentChartIdx
                    : chartData.length - 1
                ]?.windspeed}
                {" "}
                км/ч
              </div>
            </div>
          )}

          <ResponsiveContainer width="100%" height={60}>
            <AreaChart data={chartData} margin={{top:5,right:0,left:0,bottom:0}}>
              <XAxis
                dataKey='timestamp'
                type='number'
                scale='time'
                domain={['dataMin', 'dataMax']}
                tickFormatter={v => new Date(v).toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})}
                axisLine={false}
                tickLine={false}
                tick={{fill:'#fff', fontSize:12}}
              />
              {currentChartTime && (
                <ReferenceLine
                  x={currentChartTime.getTime()}
                  stroke="#ffffff"
                  strokeDasharray=""
                  strokeWidth={3}
                  ifOverflow="extendDomain"
                />
              )}
              {chartData.length > 0 && currentChartTime && (
                <ReferenceDot
                  x={currentChartTime.getTime()}
                  y={
                    chartData[
                      currentChartIdx < chartData.length
                        ? currentChartIdx
                        : chartData.length - 1
                    ]?.windspeed
                  }
                  r={4}
                  fill="#ffffff"
                  stroke="#ffc658"
                  strokeWidth={2}
                />
              )}
              <Tooltip 
                content={props => (
                  <CustomTooltip
                    active={props.active}
                    payload={props.payload}
                    chartData={chartData}
                    currentChartIdx={currentChartIdx}
                    param='windspeed'
                    isHovering={isHovering.windspeed}
                  />
                )}
                active={true}
              />
              {pastData.length > 0 && (
                <Area type="monotone" dataKey="windspeed" stroke="#b0b0b0" fill="rgba(180,180,180,0.13)" strokeWidth={2} dot={false} activeDot={false} isAnimationActive={false} data={pastData} />
              )}
              {futureData.length > 0 && (
                <Area type="monotone" dataKey="windspeed" stroke="#ffc658" fill="rgba(255,198,88,0.27)" strokeWidth={2} dot={false} activeDot={{stroke:'#fff',strokeWidth:2,r:5,fill:'#ffc658'}} isAnimationActive={false} data={futureData} />
              )}
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
