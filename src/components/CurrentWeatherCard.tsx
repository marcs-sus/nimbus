import { ArrowDown, ArrowUp, Thermometer } from "lucide-react";
import { useAppearance } from "../hooks/useAppearance";
import { formatTemperature } from "../lib/format";
import type { CurrentWeather } from "../types/weather";
import { getWeatherIcon } from "../utils/weatherIcons";

interface CurrentWeatherCardProps {
  current: CurrentWeather;
}

export function CurrentWeatherCard({ current }: CurrentWeatherCardProps) {
  const { surfaceClass, mutedTextClass, viewMode, highContrastDark } =
    useAppearance();

  // Se a temperatura pontual for null (comum na API do INMET que retorna faixas min/max),
  // exibe a temperatura máxima ou média do período como temperatura de destaque.
  const displayTemp =
    current.temperatureC !== null
      ? formatTemperature(current.temperatureC)
      : current.maxTemperatureC !== null
        ? formatTemperature(current.maxTemperatureC)
        : "—";

  return (
    <section aria-labelledby="current-heading" className="w-full">
      <h2 id="current-heading" className="sr-only">
        Condições atuais
      </h2>

      <div
        className={`relative overflow-hidden p-6 sm:p-8 text-center flex flex-col items-center justify-center ${surfaceClass}`}
      >
        {/* Glow de fundo sutil atrás do ícone se não estiver em alto contraste */}
        {!highContrastDark && (
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-sky-400/20 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        )}

        {/* Ícone Dinâmico Grande */}
        <div className="relative mb-3 transition-transform hover:scale-105 duration-300">
          {getWeatherIcon(current.description, false, "w-20 h-20 sm:w-24 sm:h-24")}
        </div>

        {/* Temperatura Principal em Destaque */}
        <div className="flex items-baseline justify-center">
          <p className="text-6xl sm:text-7xl font-black tracking-tighter">
            {displayTemp}
          </p>
        </div>

        {/* Descrição do Clima */}
        <p className="mt-2 text-lg sm:text-xl font-semibold capitalize tracking-wide">
          {current.description ?? "Condição indisponível"}
        </p>

        {/* Sensação Térmica (se disponível) */}
        {current.apparentTemperatureC !== null && (
          <div
            className={`mt-1 flex items-center gap-1.5 text-xs font-medium ${mutedTextClass}`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>
              Sensação térmica: {formatTemperature(current.apparentTemperatureC)}
            </span>
          </div>
        )}

        {/* Máxima e Mínima do Dia (Destaque principal no Modo Detalhado ou sempre visível resumido) */}
        {(current.maxTemperatureC !== null || current.minTemperatureC !== null) && (
          <div
            className={`mt-4 inline-flex items-center gap-4 rounded-full px-4 py-1.5 text-xs font-bold ${
              highContrastDark
                ? "border border-white bg-black text-white"
                : "border border-white/20 bg-white/20 dark:bg-black/30 backdrop-blur-md"
            }`}
          >
            {current.maxTemperatureC !== null && (
              <span className="inline-flex items-center gap-1 text-red-500 dark:text-red-400">
                <ArrowUp className="w-3.5 h-3.5" />
                Máx: {formatTemperature(current.maxTemperatureC)}
              </span>
            )}
            {current.minTemperatureC !== null && (
              <span className="inline-flex items-center gap-1 text-blue-500 dark:text-blue-400">
                <ArrowDown className="w-3.5 h-3.5" />
                Mín: {formatTemperature(current.minTemperatureC)}
              </span>
            )}
          </div>
        )}

        {/* Informação extra no modo detalhado: Estação do ano */}
        {viewMode === "detailed" && current.season && (
          <p className={`mt-3 text-xs uppercase tracking-wider font-medium ${mutedTextClass}`}>
            Estação: {current.season}
          </p>
        )}
      </div>
    </section>
  );
}
