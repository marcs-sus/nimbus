import type { SearchService } from "./searchService";
import type { Location } from "../types/location";
import type {
  CurrentWeather,
  DailyForecast,
  WeatherData,
} from "../types/weather";

export class OpenMeteoService implements SearchService {
  async getWeather(location: Location): Promise<WeatherData> {
    return {
      current: null,
      forecast: {} as DailyForecast[],
    };
  }
}
