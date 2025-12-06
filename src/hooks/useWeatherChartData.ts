import { useMemo } from "react";
import { WeatherData } from "../types/weather";

interface ChartPoint {
  fullTime: Date;
  timestamp: number;
  displayTime: string;
  humidity: number;
  temperature: number;
  windspeed: number;
}

interface UseWeatherChartDataResult {
  chartData: ChartPoint[];
  nowCity: Date | null;
  currentChartIdx: number;
  currentChartTime: Date | null;
  pastData: ChartPoint[];
  futureData: ChartPoint[];
}

export const useWeatherChartData = (data: WeatherData): UseWeatherChartDataResult => {
  return useMemo(() => {
    const empty: UseWeatherChartDataResult = {
      chartData: [],
      nowCity: null,
      currentChartIdx: 0,
      currentChartTime: null,
      pastData: [],
      futureData: [],
    };

    if (!data?.hourly || !data.hourly.time) {
      return empty;
    }

    const offset = data.utc_offset_seconds || 0;

    const chartData: ChartPoint[] = data.hourly.time.map((time, i) => {
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
        timestamp: cityDate.getTime(),
        displayTime: `${day}.${month} ${timeStr}`,
        humidity: Math.round(data.hourly.relative_humidity_2m?.[i] ?? 0),
        temperature: Math.round(data.hourly.temperature_2m?.[i] ?? 0),
        windspeed: Math.round(data.hourly.windspeed_10m?.[i] ?? 0),
      };
    });

    // текущее локальное время города (с учётом разницы таймзон между клиентом и городом)
    const clientOffsetSeconds = -new Date().getTimezoneOffset() * 60;
    const nowCity = new Date(
      Date.now() + (offset - clientOffsetSeconds) * 1000
    );

    let currentChartIdx = chartData.findIndex(
      (d) => d.fullTime.getTime() >= nowCity.getTime()
    );
    if (currentChartIdx === -1) currentChartIdx = chartData.length;

    const currentChartTime =
      currentChartIdx < chartData.length
        ? chartData[currentChartIdx]?.fullTime
        : chartData.length > 0
        ? chartData[chartData.length - 1]?.fullTime
        : null;

    const pastData =
      currentChartIdx >= 0 ? chartData.slice(0, currentChartIdx + 1) : [];

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
};


