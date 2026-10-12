export interface CurrentWeather {
  temperatureC: number | null;
  minTemperatureC: number | null;
  maxTemperatureC: number | null;
  apparentTemperatureC: number | null;
  windSpeedKmh: number | null;
  windDirectionDegrees: number | null;
  relativeHumidityPercent: number | null;
  pressureHpa: number | null;
  description: string | null;
  sunrise: string | null;
  sunset: string | null;
  season: string | null;
}

export interface DailyForecast {
  date: string;
  minTemperatureC: number | null;
  maxTemperatureC: number | null;
  windSpeedKmh: number | null;
  windDirectionDegrees: number | null;
  relativeHumidityPercent: number | null;
  description: string | null;
  sunrise: string | null;
  sunset: string | null;
}

export interface WeatherData {
  current: CurrentWeather | null;
  forecast: DailyForecast[];
}
