import { useState } from "react";
import { useAppearance } from "../hooks/useAppearance";
import type { CurrentWeather } from "../types/weather";
import { shortTemp } from "../utils/temperature";
import { getWeatherIcon } from "../utils/weatherIcons";

interface HourlyCarouselProps {
  current: CurrentWeather;
}

interface HourlySlot {
  timeLabel: string;
  temp: number | null;
  isNight: boolean;
}

export function HourlyCarousel({ current }: HourlyCarouselProps) {
  const { surfaceClass } = useAppearance();

  const min = current.minTemperatureC ?? 18;
  const max = current.maxTemperatureC ?? 26;
  const currentTemp = current.temperatureC ?? Math.round(max * 0.95);

  const [currentHour] = useState(() => new Date().getHours());

  const slots: HourlySlot[] = Array.from({ length: 10 }, (_, i) => {
    const targetHour = (currentHour + i) % 24;
    const rad = ((targetHour - 9) / 24) * 2 * Math.PI;
    const factor = (Math.sin(rad) + 1) / 2;

    return {
      timeLabel: i === 0 ? "Agora" : `${String(targetHour).padStart(2, "0")}h`,
      temp: i === 0 ? currentTemp : Math.round(min + factor * (max - min)),
      isNight: targetHour < 6 || targetHour >= 18,
    };
  });

  return (
    <section
      aria-labelledby="hourly-heading"
      className={`animate-fade-up rounded-[28px] p-4 ${surfaceClass}`}
    >
      <h2 id="hourly-heading" className="text-ink-muted mb-2 px-1 text-sm font-medium">
        Próximas horas
      </h2>

      <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto scroll-smooth px-1">
        {slots.map((slot, index) => (
          <div
            key={slot.timeLabel}
            className={`flex min-w-[62px] shrink-0 flex-col items-center gap-2.5 rounded-2xl px-2 py-3 ${
              index === 0 ? "glass-active" : "transition-colors duration-300 hover:bg-white/30 dark:hover:bg-white/10"
            }`}
          >
            <span className="text-sm font-medium">{slot.timeLabel}</span>
            <span className={index === 0 ? "" : "text-sky-600 dark:text-zinc-100"}>
              {getWeatherIcon(current.description, slot.isNight, "h-6 w-6")}
            </span>
            <span className="text-base font-semibold">{shortTemp(slot.temp)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
