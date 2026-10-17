import type { ReactNode } from "react";
import { useAppearance } from "../hooks/useAppearance";
import {
  formatHumidityRange,
  formatPressure,
  formatTemperature,
  formatTime,
  formatWind,
} from "../lib/format";
import type { CurrentWeather } from "../types/weather";

interface CurrentWeatherCardProps {
  current: CurrentWeather;
}

export function CurrentWeatherCard({ current }: CurrentWeatherCardProps) {
  const { surfaceClass, mutedTextClass } = useAppearance();

  return (
    <section aria-labelledby="current-heading">
      <h2 id="current-heading" className="text-lg font-semibold">
        Condições atuais
      </h2>

      <div className={`mt-3 rounded-xl border p-5 ${surfaceClass}`}>
        {current.temperatureC !== null && (
          <p className="text-4xl font-bold">
            {formatTemperature(current.temperatureC)}
          </p>
        )}
        <p className={`mt-2 ${mutedTextClass}`}>
          {current.description ?? "Condição indisponível"}
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3">
          <Metric
            label="Temperatura mínima"
            value={formatTemperature(current.minTemperatureC)}
          />
          <Metric
            label="Temperatura máxima"
            value={formatTemperature(current.maxTemperatureC)}
          />
          <Metric
            label="Sensação térmica"
            value={formatTemperature(current.apparentTemperatureC)}
          />
          <Metric
            label="Vento"
            value={formatWind(
              current.windSpeedKmh,
              current.windSpeedDescription,
              current.windDirection,
            )}
          />
          <Metric
            label="Umidade relativa"
            value={formatHumidityRange(
              current.minRelativeHumidityPercent,
              current.maxRelativeHumidityPercent,
            )}
          />
          <Metric
            label="Pressão atmosférica"
            value={formatPressure(current.pressureHpa)}
          />
          <Metric label="Nascer do sol" value={formatTime(current.sunrise)} />
          <Metric label="Pôr do sol" value={formatTime(current.sunset)} />
          <Metric label="Estação do ano" value={current.season ?? "—"} />
        </dl>
      </div>
    </section>
  );
}

interface MetricProps {
  label: string;
  value: ReactNode;
}

function Metric({ label, value }: MetricProps) {
  const { mutedTextClass } = useAppearance();

  return (
    <div>
      <dt className={mutedTextClass}>{label}</dt>
      <dd className="mt-1 font-semibold">{value}</dd>
    </div>
  );
}
