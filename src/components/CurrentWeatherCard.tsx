import { useAppearance } from "../hooks/useAppearance";
import type { CurrentWeather } from "../types/weather";
import { shortTemp } from "../utils/temperature";
import { getWeatherIcon } from "../utils/weatherIcons";

interface CurrentWeatherCardProps {
  current: CurrentWeather;
}

export function CurrentWeatherCard({ current }: CurrentWeatherCardProps) {
  const { viewMode } = useAppearance();

  // O INMET não informa temperatura pontual; usa-se a máxima do período.
  const displayTemp = shortTemp(current.temperatureC ?? current.maxTemperatureC);

  return (
    <section
      aria-labelledby="current-heading"
      className="animate-fade-up flex flex-col items-center py-4 text-center"
    >
      <h2 id="current-heading" className="sr-only">
        Condições atuais
      </h2>

      <div className="animate-float text-sky-800 drop-shadow-[0_6px_14px_rgba(255,255,255,0.55)] dark:text-zinc-100 dark:drop-shadow-[0_6px_14px_rgba(0,0,0,0.4)]">
        {getWeatherIcon(current.description, false, "h-20 w-20", 1.25)}
      </div>

      <p className="mt-1 text-[96px] leading-none font-extralight tracking-tighter">
        {displayTemp}
      </p>

      <p className="mt-3 text-xl font-medium">
        {current.description ?? "Condição indisponível"}
      </p>

      {viewMode === "detailed" && (
        <p className="text-ink-muted mt-1.5 text-base">
          Máx {shortTemp(current.maxTemperatureC)} · Mín{" "}
          {shortTemp(current.minTemperatureC)}
          {current.apparentTemperatureC !== null &&
            ` · Sensação ${shortTemp(current.apparentTemperatureC)}`}
        </p>
      )}
    </section>
  );
}
