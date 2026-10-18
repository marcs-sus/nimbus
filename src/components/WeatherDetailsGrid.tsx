import {
  Compass,
  Droplets,
  Gauge,
  Sunrise,
  Sunset,
  Wind,
  Calendar,
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
  const { surfaceClass, mutedTextClass } = useAppearance();

  const details = [
    {
      id: "wind",
      icon: <Wind className="w-5 h-5 text-sky-400" />,
      label: "Vento",
      value: formatWind(
        current.windSpeedKmh,
        current.windSpeedDescription,
        current.windDirection,
      ),
      subtext: current.windDirection ? `Direção: ${current.windDirection}` : undefined,
    },
    {
      id: "humidity",
      icon: <Droplets className="w-5 h-5 text-blue-400" />,
      label: "Umidade Relativa",
      value: formatHumidityRange(
        current.minRelativeHumidityPercent,
        current.maxRelativeHumidityPercent,
      ),
      subtext: "Faixa mínima e máxima",
    },
    {
      id: "sunrise",
      icon: <Sunrise className="w-5 h-5 text-amber-400" />,
      label: "Nascer do Sol",
      value: formatTime(current.sunrise),
      subtext: "Horário estimado",
    },
    {
      id: "sunset",
      icon: <Sunset className="w-5 h-5 text-orange-400" />,
      label: "Pôr do Sol",
      value: formatTime(current.sunset),
      subtext: "Horário estimado",
    },
    {
      id: "pressure",
      icon: <Gauge className="w-5 h-5 text-indigo-400" />,
      label: "Pressão Atmosférica",
      value: formatPressure(current.pressureHpa),
      subtext: "Nível médio",
    },
    {
      id: "season",
      icon: <Calendar className="w-5 h-5 text-emerald-400" />,
      label: "Estação do Ano",
      value: current.season ?? "—",
      subtext: "Vigente no Brasil",
    },
  ];

  return (
    <section aria-labelledby="details-heading" className="w-full">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Compass className="w-4 h-4 opacity-75" />
        <h2 id="details-heading" className="text-sm font-bold tracking-tight">
          Detalhes meteorológicos
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {details.map((item) => (
          <DetailCard
            key={item.id}
            icon={item.icon}
            label={item.label}
            value={item.value}
            subtext={item.subtext}
            surfaceClass={surfaceClass}
            mutedTextClass={mutedTextClass}
          />
        ))}
      </div>
    </section>
  );
}

interface DetailCardProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  subtext?: string;
  surfaceClass: string;
  mutedTextClass: string;
}

function DetailCard({
  icon,
  label,
  value,
  subtext,
  surfaceClass,
  mutedTextClass,
}: DetailCardProps) {
  return (
    <div
      className={`flex flex-col justify-between p-4 rounded-2xl transition-transform hover:-translate-y-0.5 ${surfaceClass}`}
    >
      <div className="flex items-center gap-2">
        <div className="shrink-0">{icon}</div>
        <span className={`text-xs font-semibold ${mutedTextClass}`}>{label}</span>
      </div>

      <div className="mt-3">
        <p className="text-base sm:text-lg font-bold tracking-tight">{value}</p>
        {subtext && (
          <p className={`mt-0.5 text-[11px] truncate ${mutedTextClass}`}>
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}
