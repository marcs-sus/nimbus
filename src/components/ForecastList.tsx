import { useState } from "react";
import { useAppearance } from "../hooks/useAppearance";
import {
  formatDate,
  formatHumidityRange,
  formatTime,
  formatWind,
} from "../lib/format";
import type { DailyForecast } from "../types/weather";
import { shortTemp } from "../utils/temperature";
import { getWeatherIcon } from "../utils/weatherIcons";

interface ForecastListProps {
  forecast: DailyForecast[];
}

export function ForecastList({ forecast }: ForecastListProps) {
  const { surfaceClass, mutedTextClass } = useAppearance();

  const mins = forecast
    .map((d) => d.minTemperatureC)
    .filter((v): v is number => v !== null);
  const maxs = forecast
    .map((d) => d.maxTemperatureC)
    .filter((v): v is number => v !== null);
  const weekMin = mins.length > 0 ? Math.min(...mins) : 0;
  const weekMax = maxs.length > 0 ? Math.max(...maxs) : 0;

  return (
    <section
      aria-labelledby="forecast-heading"
      className={`animate-fade-up rounded-[28px] p-4 ${surfaceClass}`}
    >
      <h2
        id="forecast-heading"
        className="text-ink-muted mb-1 px-1 text-sm font-medium"
      >
        Previsão para 5 dias
      </h2>

      {forecast.length > 0 ? (
        <div className="divide-glass">
          {forecast.map((day) => (
            <ForecastDayRow
              key={day.date}
              day={day}
              weekMin={weekMin}
              weekMax={weekMax}
            />
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

export const DailyForecastList = ForecastList;

interface ForecastDayRowProps {
  day: DailyForecast;
  weekMin: number;
  weekMax: number;
}

function ForecastDayRow({ day, weekMin, weekMax }: ForecastDayRowProps) {
  const { mutedTextClass, viewMode } = useAppearance();
  const [override, setOverride] = useState<boolean | null>(null);

  const isExpanded = override ?? viewMode === "detailed";

  const span = weekMax - weekMin;
  const lo = day.minTemperatureC ?? weekMin;
  const hi = day.maxTemperatureC ?? weekMax;
  const left = span > 0 ? ((lo - weekMin) / span) * 100 : 0;
  const width = span > 0 ? Math.max(((hi - lo) / span) * 100, 12) : 100;

  return (
    <article className="py-3">
      <button
        type="button"
        onClick={() => setOverride(!isExpanded)}
        aria-expanded={isExpanded}
        className="flex w-full items-center gap-3 text-left"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-base font-semibold capitalize">
            {formatDate(day.date)}
          </span>
          <span className={`block truncate text-sm ${mutedTextClass}`}>
            {day.description ?? "Sem descrição"}
          </span>
        </span>

        <span className="shrink-0 text-sky-600 dark:text-zinc-100">
          {getWeatherIcon(day.description, false, "h-7 w-7")}
        </span>

        <span className={`w-9 shrink-0 text-right text-base ${mutedTextClass}`}>
          {shortTemp(day.minTemperatureC)}
        </span>

        <span className="range-track relative h-1.5 w-16 shrink-0 rounded-full">
          <span
            className="range-fill absolute inset-y-0 rounded-full"
            style={{
              left: `${left}%`,
              width: `${Math.min(width, 100 - left)}%`,
            }}
          />
        </span>

        <span className="w-9 shrink-0 text-base font-semibold">
          {shortTemp(day.maxTemperatureC)}
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
        aria-hidden={!isExpanded}
      >
        <div className="overflow-hidden">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-3 pl-0.5 text-sm">
            <Info
              label="Vento"
              value={formatWind(
                day.windSpeedKmh,
                day.windSpeedDescription,
                day.windDirection,
              )}
            />
            <Info
              label="Umidade"
              value={formatHumidityRange(
                day.minRelativeHumidityPercent,
                day.maxRelativeHumidityPercent,
              )}
            />
            <Info label="Nascer do sol" value={formatTime(day.sunrise)} />
            <Info label="Pôr do sol" value={formatTime(day.sunset)} />
          </dl>
        </div>
      </div>
    </article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  const { mutedTextClass } = useAppearance();

  return (
    <div>
      <dt className={mutedTextClass}>{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
