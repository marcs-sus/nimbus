import { useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Droplets,
  Sunrise,
  Sunset,
  Wind,
} from "lucide-react";
import { useAppearance } from "../hooks/useAppearance";
import {
  formatDate,
  formatHumidityRange,
  formatTemperature,
  formatTime,
  formatWind,
} from "../lib/format";
import type { DailyForecast } from "../types/weather";
import { getWeatherIcon } from "../utils/weatherIcons";

interface ForecastListProps {
  forecast: DailyForecast[];
}

export function ForecastList({ forecast }: ForecastListProps) {
  const { mutedTextClass } = useAppearance();

  return (
    <section aria-labelledby="forecast-heading" className="w-full">
      <div className="flex items-center gap-2 mb-3 px-1">
        <CalendarDays className="w-4 h-4 opacity-75" />
        <h2 id="forecast-heading" className="text-sm font-bold tracking-tight">
          Previsão para cinco dias
        </h2>
      </div>

      {forecast.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {forecast.map((day) => (
            <ForecastDayRow key={day.date} day={day} />
          ))}
        </div>
      ) : (
        <p className={`mt-3 px-1 text-sm ${mutedTextClass}`}>
          Nenhuma previsão futura disponível.
        </p>
      )}
    </section>
  );
}

// Alias para atender o nome mencionado no plan.md
export const DailyForecastList = ForecastList;

interface ForecastDayRowProps {
  day: DailyForecast;
}

function ForecastDayRow({ day }: ForecastDayRowProps) {
  const { surfaceClass, mutedTextClass, viewMode, highContrastDark } =
    useAppearance();
  const [isManuallyExpanded, setIsManuallyExpanded] = useState(false);

  // No modo detalhado expande por padrão, ou se o usuário clicou para ver
  const isExpanded = viewMode === "detailed" || isManuallyExpanded;

  return (
    <article
      className={`rounded-2xl p-4 transition-all duration-200 overflow-hidden ${surfaceClass}`}
    >
      {/* Linha Principal do Dia */}
      <button
        type="button"
        onClick={() => setIsManuallyExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
        className="w-full flex items-center justify-between gap-3 text-left focus:outline-none"
      >
        {/* Dia da semana e ícone */}
        <div className="flex items-center gap-3 min-w-[130px] sm:min-w-[170px]">
          <div className="shrink-0">
            {getWeatherIcon(day.description, false, "w-6 h-6")}
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base capitalize">
              {formatDate(day.date)}
            </h3>
            <p className={`text-xs truncate max-w-[140px] sm:max-w-[200px] ${mutedTextClass}`}>
              {day.description ?? "Sem descrição"}
            </p>
          </div>
        </div>

        {/* Faixa de temperatura Mín e Máx */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="font-extrabold text-sm sm:text-base text-red-500 dark:text-red-400">
              {formatTemperature(day.maxTemperatureC)}
            </span>
            <span className={`mx-1 text-xs ${mutedTextClass}`}>/</span>
            <span className={`text-xs sm:text-sm font-semibold text-blue-500 dark:text-blue-400`}>
              {formatTemperature(day.minTemperatureC)}
            </span>
          </div>

          <div
            className={`p-1 rounded-full transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 opacity-60" />
            ) : (
              <ChevronDown className="w-4 h-4 opacity-60" />
            )}
          </div>
        </div>
      </button>

      {/* Detalhes Expandidos (Modo Detalhado ou clique) */}
      {isExpanded && (
        <div
          className={`mt-4 pt-3 border-t grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs ${
            highContrastDark ? "border-white" : "border-current/15"
          }`}
        >
          <div className="flex items-center gap-2">
            <Wind className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <div>
              <p className={mutedTextClass}>Vento</p>
              <p className="font-semibold truncate">
                {formatWind(
                  day.windSpeedKmh,
                  day.windSpeedDescription,
                  day.windDirection,
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Droplets className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <div>
              <p className={mutedTextClass}>Umidade</p>
              <p className="font-semibold">
                {formatHumidityRange(
                  day.minRelativeHumidityPercent,
                  day.maxRelativeHumidityPercent,
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Sunrise className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <div>
              <p className={mutedTextClass}>Nascer do sol</p>
              <p className="font-semibold">{formatTime(day.sunrise)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Sunset className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <div>
              <p className={mutedTextClass}>Pôr do sol</p>
              <p className="font-semibold">{formatTime(day.sunset)}</p>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
