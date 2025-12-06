import React, { useState, useEffect } from "react";
import { getDominantColor } from "../../utils/colorUtils";
import { getWeatherDescription, getWeatherIcon } from "../../utils/weatherUtils";
import { getDaylightDuration } from "../../utils/timeUtils";
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
import { useWeatherChartData } from "../../hooks/useWeatherChartData";
import SunriseSunsetWidget from '../SunriseSunsetWidget/SunriseSunsetWidget';
import TemperatureWidget from '../TemperatureWidget/TemperatureWidget';
import WindWidget from '../WindWidget/WindWidget';
import PrecipitationWidget from '../PrecipitationWidget/PrecipitationWidget';
import AdditionalInfoWidget from '../AdditionalInfoWidget/AdditionalInfoWidget';
import MoonWidget from "../MoonWidget/MoonWidget";

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

  const {
    chartData,
    nowCity,
    currentChartIdx,
    currentChartTime,
    pastData,
    futureData,
  } = useWeatherChartData(data);

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
            <div className={styles.temperatureWidget}>
              <TemperatureWidget
                currentTemp={currentWeather.currentTemp}
                tempMax={today.tempMax}
                tempMin={today.tempMin}
                feelsLikeMax={today.feelsLikeMax}
              />
            </div>

            <div className={styles.windWidget}>
              <WindWidget
                windSpeed={currentWeather.windSpeed}
                windGustsMax={today.windGustsMax}
                windSpeedMax={today.windSpeedMax}
                windDirection={currentWeather.windDirection}
              />
            </div>

            <div className={styles.sunriseWidget}>
              <SunriseSunsetWidget
                sunrise={today.sunrise}
                sunset={today.sunset}
              />
            </div>

            <div className={styles.precipitationWidget}>
              <PrecipitationWidget
                precipitation={today.precipitation}
                precipitationHours={today.precipitationHours}
                humidity={data.hourly.relative_humidity_2m[0]}
              />
            </div>

            <div className={styles.additionalInfoWidget}>
              <AdditionalInfoWidget
                daylightDuration={getDaylightDuration(today.sunrise, today.sunset)}
                windDirectionDominant={today.windDirection}
                feelsLikeMin={today.feelsLikeMin}
              />
            </div>

            <div className={styles.moonWidget}>
              <MoonWidget />
            </div>
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
