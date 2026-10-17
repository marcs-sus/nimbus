import { useAppearance } from "../hooks/useAppearance";
import {
  formatDate,
  formatHumidityRange,
  formatTemperature,
  formatTime,
  formatWind,
} from "../lib/format";
import type { DailyForecast } from "../types/weather";

interface ForecastListProps {
  forecast: DailyForecast[];
}

export function ForecastList({ forecast }: ForecastListProps) {
  const { mutedTextClass } = useAppearance();

  return (
    <section aria-labelledby="forecast-heading">
      <h2 id="forecast-heading" className="text-lg font-semibold">
        Previsão para cinco dias
      </h2>

      {forecast.length > 0 ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {forecast.map((day) => (
            <ForecastDayCard key={day.date} day={day} />
          ))}
        </div>
      ) : (
        <p className={`mt-3 ${mutedTextClass}`}>
          Nenhuma previsão futura disponível.
        </p>
      )}
    </section>
  );
}

interface ForecastDayCardProps {
  day: DailyForecast;
}

function ForecastDayCard({ day }: ForecastDayCardProps) {
  const { surfaceClass, mutedTextClass } = useAppearance();

  return (
    <article className={`rounded-xl border p-4 ${surfaceClass}`}>
      <h3 className="font-semibold">{formatDate(day.date)}</h3>

      <p className="mt-3 text-xl font-bold">
        {formatTemperature(day.maxTemperatureC)}
        {" / "}
        {formatTemperature(day.minTemperatureC)}
      </p>

      <p className={`mt-2 text-sm ${mutedTextClass}`}>
        {day.description ?? "Condição indisponível"}
      </p>

      <dl className="mt-4 space-y-2 text-sm">
        <ForecastRow
          label="Vento"
          value={formatWind(
            day.windSpeedKmh,
            day.windSpeedDescription,
            day.windDirection,
          )}
        />
        <ForecastRow
          label="Umidade"
          value={formatHumidityRange(
            day.minRelativeHumidityPercent,
            day.maxRelativeHumidityPercent,
          )}
        />
        <ForecastRow label="Nascer do sol" value={formatTime(day.sunrise)} />
        <ForecastRow label="Pôr do sol" value={formatTime(day.sunset)} />
      </dl>
    </article>
  );
}

interface ForecastRowProps {
  label: string;
  value: string;
}

function ForecastRow({ label, value }: ForecastRowProps) {
  const { mutedTextClass } = useAppearance();

  return (
    <div className="flex justify-between gap-3">
      <dt className={mutedTextClass}>{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}
