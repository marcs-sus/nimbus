import {
  CalendarDays,
  Droplets,
  Gauge,
  Sunrise,
  Sunset,
  Wind,
} from "lucide-react";
import type { ReactNode } from "react";
import { useAppearance } from "../hooks/useAppearance";
import {
  formatHumidityRange,
  formatPressure,
  formatTime,
  formatWind,
} from "../lib/format";
import type { CurrentWeather } from "../types/weather";

interface WeatherDetailsGridProps {
  current: CurrentWeather;
}

export function WeatherDetailsGrid({ current }: WeatherDetailsGridProps) {
  const { surfaceClass } = useAppearance();

  const details: { id: string; icon: ReactNode; label: string; value: string }[] =
    [
      {
        id: "wind",
        icon: <Wind />,
        label: "Vento",
        value: formatWind(
          current.windSpeedKmh,
          current.windSpeedDescription,
          current.windDirection,
        ),
      },
      {
        id: "humidity",
        icon: <Droplets />,
        label: "Umidade",
        value: formatHumidityRange(
          current.minRelativeHumidityPercent,
          current.maxRelativeHumidityPercent,
        ),
      },
      {
        id: "sunrise",
        icon: <Sunrise />,
        label: "Nascer do sol",
        value: formatTime(current.sunrise),
      },
      {
        id: "sunset",
        icon: <Sunset />,
        label: "Pôr do sol",
        value: formatTime(current.sunset),
      },
      {
        id: "pressure",
        icon: <Gauge />,
        label: "Pressão",
        value: formatPressure(current.pressureHpa),
      },
      {
        id: "season",
        icon: <CalendarDays />,
        label: "Estação",
        value: current.season ?? "—",
      },
    ];

  return (
    <section aria-labelledby="details-heading" className="animate-fade-up">
      <h2 id="details-heading" className="sr-only">
        Detalhes meteorológicos
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {details.map((item) => (
          <div
            key={item.id}
            className={`lift rounded-[24px] p-4 ${surfaceClass}`}
          >
            <div className="text-ink-muted flex items-center gap-2 text-sm font-medium">
              <span className="text-sky-600 dark:text-zinc-200 [&>svg]:h-4 [&>svg]:w-4">
                {item.icon}
              </span>
              {item.label}
            </div>
            <p className="mt-2 text-xl leading-snug font-semibold">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
