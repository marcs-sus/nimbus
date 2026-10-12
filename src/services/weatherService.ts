import type { SearchService } from "./searchService";
import { InmetService } from "./inmetService";
import { OpenMeteoService } from "./openMeteoService";

const provider = import.meta.env.VITE_WEATHER_PROVIDER ?? "open-meteo";

function createWeatherService(): SearchService {
  switch (provider) {
    case "open-meteo":
      return new OpenMeteoService();
    case "inmet":
      return new InmetService();
    default:
      throw new Error(`Unknown weather provider: ${provider}`);
  }
}

export const searchService = createWeatherService();
