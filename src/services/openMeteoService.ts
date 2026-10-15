import type { SearchService } from "./searchService";
import type { Location } from "../types/location";
import type { DailyForecast, WeatherData } from "../types/weather";

export class OpenMeteoService implements SearchService {
  async getWeather(_location: Location): Promise<WeatherData> {
    return {
      current: null,
      forecast: {} as DailyForecast[],
    };
  }
}
