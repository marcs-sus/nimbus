import { buttonClass, useAppearance } from "../hooks/useAppearance";
import { CurrentWeatherCard } from "./CurrentWeatherCard";
import { ForecastList } from "./ForecastList";
import type { WeatherData } from "../types/weather";

interface WeatherReportProps {
  hasSelection: boolean;
  weather: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function WeatherReport({
  hasSelection,
  weather,
  isLoading,
  error,
  onRetry,
}: WeatherReportProps) {
  const { surfaceClass, mutedTextClass } = useAppearance();

  return (
    <section className="mt-6" aria-live="polite" aria-busy={isLoading}>
      {!hasSelection && !isLoading && (
        <p className={`py-8 ${mutedTextClass}`}>
          Busque um município ou use sua localização para consultar a previsão.
        </p>
      )}

      {isLoading && (
        <p className="py-8" role="status">
          Carregando dados meteorológicos…
        </p>
      )}

      {!isLoading && error && (
        <div className={`rounded-lg border p-4 ${surfaceClass}`} role="alert">
          <p className="font-semibold">Não foi possível carregar a previsão</p>
          <p className={`mt-2 text-sm ${mutedTextClass}`}>{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className={`mt-4 ${buttonClass}`}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!isLoading && !error && weather && (
        <div className="space-y-8">
          {weather.current && <CurrentWeatherCard current={weather.current} />}
          <ForecastList forecast={weather.forecast} />
        </div>
      )}
    </section>
  );
}
