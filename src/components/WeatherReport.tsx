import { AlertCircle, CloudRain, Loader2, RefreshCw, Search } from "lucide-react";
import { buttonClass, useAppearance } from "../hooks/useAppearance";
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
  const { surfaceClass, mutedTextClass, viewMode, highContrastDark } =
    useAppearance();

  return (
    <section className="mt-4 w-full" aria-live="polite" aria-busy={isLoading}>
      {/* 1. Estado: Nenhuma cidade selecionada */}
      {!hasSelection && !isLoading && (
        <div
          className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-3xl ${surfaceClass}`}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-500 mb-4">
            <CloudRain className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold">Nenhum município selecionado</h2>
          <p className={`mt-2 max-w-sm text-sm ${mutedTextClass}`}>
            Busque um município ou use sua localização para consultar a previsão.
          </p>

          {onOpenSearch && (
            <button
              type="button"
              onClick={onOpenSearch}
              className={`mt-6 flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold shadow transition-all active:scale-95 ${
                highContrastDark
                  ? "border-2 border-white bg-white text-black"
                  : "bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/25"
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Buscar município agora</span>
            </button>
          )}
        </div>
      )}

      {/* 2. Estado: Carregando dados meteorológicos */}
      {isLoading && (
        <div
          className={`flex flex-col items-center justify-center p-12 text-center rounded-3xl ${surfaceClass}`}
          role="status"
        >
          <Loader2 className="w-8 h-8 animate-spin text-sky-500 mb-3" />
          <p className="text-base font-semibold">
            Carregando dados meteorológicos…
          </p>
          <p className={`mt-1 text-xs ${mutedTextClass}`}>
            Obtendo informações atualizadas da estação meteorológica
          </p>
        </div>
      )}

      {/* 3. Estado: Erro ao carregar previsão */}
      {!isLoading && error && (
        <div
          className={`rounded-3xl p-6 text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-4 ${surfaceClass}`}
          role="alert"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/20 text-red-500">
            <AlertCircle className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <p className="font-bold text-base">
              Não foi possível carregar a previsão
            </p>
            <p className={`mt-1.5 text-sm ${mutedTextClass}`}>{error}</p>

            <button
              type="button"
              onClick={onRetry}
              className={`mt-4 inline-flex items-center gap-2 ${buttonClass}`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Tentar novamente</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Estado: Clima carregado com sucesso */}
      {!isLoading && !error && weather && (
        <div className="space-y-6">
          {/* Card Central de Clima Atual */}
          {weather.current && <CurrentWeatherCard current={weather.current} />}

          {/* Carrossel de Previsão Horária */}
          {weather.current && <HourlyCarousel current={weather.current} />}

          {/* Grade de Detalhes Meteorológicos (Visível no Modo Detalhado) */}
          {viewMode === "detailed" && weather.current && (
            <WeatherDetailsGrid current={weather.current} />
          )}

          {/* Lista de Previsão para 5 Dias */}
          <ForecastList forecast={weather.forecast} />
        </div>
      )}
    </section>
  );
}
