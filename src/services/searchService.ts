import type { Location } from "../types/location";
import type { WeatherData } from "../types/weather";

export interface SearchService {
  getWeather(location: Location): Promise<WeatherData>;
}
