import { useCallback, useEffect, useState } from "react";
import { searchService } from "../services/weatherService";
import { getErrorMessage } from "../lib/errors";
import type { Location } from "../types/location";
import type { WeatherData } from "../types/weather";

export interface WeatherState {
  weather: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

interface LoadedWeather {
  location: Location;
  weather: WeatherData | null;
  error: string | null;
}

export function useWeather(location: Location | null): WeatherState {
  const [loaded, setLoaded] = useState<LoadedWeather | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!location) return;

    const requestedLocation = location;
    let active = true;

    async function loadWeather() {
      setIsLoading(true);

      try {
        const weather = await searchService.getWeather(requestedLocation);

        if (active) {
          setLoaded({ location: requestedLocation, weather, error: null });
        }
      } catch (err) {
        if (active) {
          setLoaded({
            location: requestedLocation,
            weather: null,
            error: getErrorMessage(
              err,
              "Não foi possível carregar os dados meteorológicos.",
            ),
          });
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadWeather();

    return () => {
      active = false;
    };
  }, [location, retryKey]);

  const retry = useCallback(() => {
    setRetryKey((key) => key + 1);
  }, []);

  if (!location) {
    return { weather: null, isLoading: false, error: null, retry };
  }

  const current = loaded?.location === location ? loaded : null;

  return {
    weather: current?.weather ?? null,
    isLoading: isLoading || current === null,
    error: current?.error ?? null,
    retry,
  };
}
