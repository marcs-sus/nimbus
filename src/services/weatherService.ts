import type { SearchService } from "./searchService";
import { InmetService } from "./inmetService";
import { OpenMeteoService } from "./openMeteoService";

export type WeatherProvider = "inmet" | "open-meteo";

export const weatherProvider: WeatherProvider =
  import.meta.env.VITE_WEATHER_PROVIDER === "open-meteo"
    ? "open-meteo"
    : "inmet";

function createWeatherService(): SearchService {
  return weatherProvider === "open-meteo"
    ? new OpenMeteoService()
    : new InmetService();
}

export const searchService = createWeatherService();
