import { useAppearance } from "../hooks/useAppearance";
import { useEasedValue } from "../hooks/useEasedValue";
import type { CurrentWeather } from "../types/weather";
import { getWeatherIcon } from "../utils/weatherIcons";

interface CurrentWeatherCardProps {
  current: CurrentWeather;
}

export function CurrentWeatherCard({ current }: CurrentWeatherCardProps) {
  const { viewMode } = useAppearance();

  // O INMET não informa temperatura pontual; usa-se a máxima do período.
  const temp = current.temperatureC ?? current.maxTemperatureC;
  const animatedTemp = useEasedValue(temp ?? 0, 1400);

  const short = (value: number | null) =>
    value === null ? "—" : `${Math.round(value)}°`;

  return (
    <section
      aria-labelledby="current-heading"
      className="animate-fade-up flex flex-col items-center py-4 text-center"
    >
      <h2 id="current-heading" className="sr-only">
        Condições atuais
      </h2>

      <div className="relative">
        <div className="animate-sun-glow pointer-events-none absolute top-1/2 left-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 blur-3xl dark:bg-white/10" />
        <div className="animate-float relative text-sky-800 drop-shadow-[0_6px_14px_rgba(255,255,255,0.55)] dark:text-zinc-100 dark:drop-shadow-[0_6px_14px_rgba(0,0,0,0.4)]">
          {getWeatherIcon(current.description, false, "h-20 w-20", 1.25)}
        </div>
      </div>

      <p
        className="temp-gradient mt-1 text-[104px] leading-none font-extralight tracking-tighter tabular-nums"
        aria-label={temp === null ? "Temperatura indisponível" : short(temp)}
      >
        {temp === null ? "—" : `${Math.round(animatedTemp)}°`}
      </p>

      <p className="mt-3 text-xl font-medium">
        {current.description ?? "Condição indisponível"}
      </p>

      {viewMode === "detailed" && (
        <p className="text-ink-muted mt-1.5 text-base">
          Máx {short(current.maxTemperatureC)} · Mín{" "}
          {short(current.minTemperatureC)}
          {current.apparentTemperatureC !== null &&
            ` · Sensação ${short(current.apparentTemperatureC)}`}
        </p>
      )}
    </section>
  );
}
