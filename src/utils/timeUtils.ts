export const getDaylightDuration = (sunrise: string, sunset: string): string => {
  if (!sunrise || !sunset) return "";

  const sunriseDate = new Date(sunrise);
  const sunsetDate = new Date(sunset);

  if (isNaN(sunriseDate.getTime()) || isNaN(sunsetDate.getTime())) {
    return "";
  }

  const duration = sunsetDate.getTime() - sunriseDate.getTime();

  const hours = Math.floor(duration / (1000 * 60 * 60));
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}ч ${minutes}м`;
};


