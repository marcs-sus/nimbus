import { Loader2, RefreshCw } from "lucide-react";
import { useAppearance } from "../hooks/useAppearance";
import { CurrentWeatherCard } from "./CurrentWeatherCard";
import { ForecastList } from "./ForecastList";
import { HourlyCarousel } from "./HourlyCarousel";
import { WeatherDetailsGrid } from "./WeatherDetailsGrid";
import type { WeatherData } from "../types/weather";

interface WeatherReportProps {
  hasSelection: boolean;
  weather: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onOpenSearch?: () => void;
}

export function WeatherReport({
  hasSelection,
  weather,
  isLoading,
  error,
  onRetry,
  onOpenSearch,
}: WeatherReportProps) {
  const { surfaceClass, mutedTextClass, viewMode } = useAppearance();

  return (
    <section className="mt-2 w-full" aria-live="polite" aria-busy={isLoading}>
      {!hasSelection && !isLoading && (
        <div
          className={`animate-fade-up flex flex-col items-center rounded-[28px] p-8 text-center ${surfaceClass}`}
        >
          <h2 className="text-xl font-semibold">Qual município?</h2>
          <p className={`mt-2 max-w-xs text-base ${mutedTextClass}`}>
            Busque um município ou use sua localização para consultar a
            previsão.
          </p>

          {onOpenSearch && (
            <button
              type="button"
              onClick={onOpenSearch}
              className="btn-primary mt-6 rounded-full px-6 py-3 text-base font-semibold"
            >
              Buscar município
            </button>
          )}
        </div>
      )}

      {isLoading && (
        <div
          className={`flex flex-col items-center rounded-[28px] p-10 text-center ${surfaceClass}`}
          role="status"
        >
          <Loader2 className="h-7 w-7 animate-spin" aria-hidden="true" />
          <p className="mt-3 text-base font-medium">
            Carregando dados meteorológicos…
          </p>
        </div>
      )}

      {!isLoading && error && (
        <div className={`rounded-[28px] p-6 ${surfaceClass}`} role="alert">
          <p className="text-lg font-semibold">
            Não foi possível carregar a previsão
          </p>
          <p className={`mt-1.5 text-base ${mutedTextClass}`}>{error}</p>

          <button
            type="button"
            onClick={onRetry}
            className="btn-primary mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-base font-semibold"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Tentar novamente
          </button>
        </div>
      )}

      {!isLoading && !error && weather && (
        <div className="stagger space-y-4">
          {weather.current && <CurrentWeatherCard current={weather.current} />}
          {weather.current && <HourlyCarousel current={weather.current} />}
          {viewMode === "detailed" && weather.current && (
            <WeatherDetailsGrid current={weather.current} />
          )}
          <ForecastList forecast={weather.forecast} />
        </div>
      )}
    </section>
  );
}
