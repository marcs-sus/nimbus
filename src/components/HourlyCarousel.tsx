import { useState } from "react";
import { Clock } from "lucide-react";
import { useAppearance } from "../hooks/useAppearance";
import { formatTemperature } from "../lib/format";
import type { CurrentWeather } from "../types/weather";
import { getWeatherIcon } from "../utils/weatherIcons";

interface HourlyCarouselProps {
  current: CurrentWeather;
}

interface HourlySlot {
  timeLabel: string;
  hour: number;
  temp: number | null;
  isNight: boolean;
  description: string | null;
}

export function HourlyCarousel({ current }: HourlyCarouselProps) {
  const { surfaceClass, mutedTextClass, highContrastDark } = useAppearance();

  const min = current.minTemperatureC ?? 18;
  const max = current.maxTemperatureC ?? 26;
  const currentTemp = current.temperatureC ?? Math.round(max * 0.95);

  const [currentHour] = useState(() => new Date().getHours());

  // Gerar slots para as próximas 10 horas baseados na curva natural do dia
  const slots: HourlySlot[] = Array.from({ length: 10 }, (_, i) => {
    const targetHour = (currentHour + i) % 24;
    const isNight = targetHour < 6 || targetHour >= 18;

    // Aproximação da temperatura ao longo do dia com pico às 15h e mínimo às 6h
    // Usando função senoidal suave entre min e max
    const rad = ((targetHour - 9) / 24) * 2 * Math.PI;
    const factor = (Math.sin(rad) + 1) / 2; // 0 a 1
    const estimated = Math.round(min + factor * (max - min));

    const temp = i === 0 ? currentTemp : estimated;
    const timeLabel =
      i === 0 ? "Agora" : `${String(targetHour).padStart(2, "0")}:00`;

    return {
      timeLabel,
      hour: targetHour,
      temp,
      isNight,
      description: current.description,
    };
  });

  return (
    <section aria-labelledby="hourly-heading" className="w-full">
      <div className="flex items-center gap-2 mb-2 px-1">
        <Clock className="w-4 h-4 opacity-75" />
        <h2 id="hourly-heading" className="text-sm font-bold tracking-tight">
          Previsão para as próximas horas
        </h2>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth">
        {slots.map((slot, index) => (
          <div
            key={slot.timeLabel}
            className={`flex flex-col items-center justify-between min-w-[76px] sm:min-w-[82px] p-3 rounded-2xl text-center shrink-0 transition-transform hover:-translate-y-0.5 ${
              index === 0
                ? highContrastDark
                  ? "border-2 border-white bg-white text-black font-bold"
                  : "border border-white/40 bg-white/30 dark:bg-sky-500/20 backdrop-blur-xl shadow-md font-bold"
                : surfaceClass
            }`}
          >
            <span
              className={`text-xs font-semibold ${
                index === 0 ? "" : mutedTextClass
              }`}
            >
              {slot.timeLabel}
            </span>

            <div className="my-2.5">
              {getWeatherIcon(slot.description, slot.isNight, "w-6 h-6")}
            </div>

            <span className="text-sm font-extrabold tracking-tight">
              {formatTemperature(slot.temp)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
