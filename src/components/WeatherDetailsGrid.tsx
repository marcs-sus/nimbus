import { useEffect, useState } from "react";
import { ArrowUp, CalendarDays, Droplets, Gauge, Sunrise, Wind } from "lucide-react";
import type { ReactNode } from "react";
import { useAppearance } from "../hooks/useAppearance";
import { useEasedValue } from "../hooks/useEasedValue";
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

const WIND_DEGREES: Record<string, number> = {
  n: 0,
  norte: 0,
  ne: 45,
  nordeste: 45,
  e: 90,
  l: 90,
  leste: 90,
  se: 135,
  sudeste: 135,
  s: 180,
  sul: 180,
  so: 225,
  sw: 225,
  sudoeste: 225,
  o: 270,
  w: 270,
  oeste: 270,
  no: 315,
  nw: 315,
  noroeste: 315,
};

/** Direção de onde o vento sopra, em graus, ou null se não reconhecida. */
function windDegrees(direction: string | null): number | null {
  if (!direction) return null;

  const token = direction
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .split(/[\s/,-]+/)[0];

  return WIND_DEGREES[token] ?? null;
}

function toMinutes(value: string | null): number | null {
  const match = value?.match(/(\d{1,2}):(\d{2})/);

  return match ? Number(match[1]) * 60 + Number(match[2]) : null;
}

export function WeatherDetailsGrid({ current }: WeatherDetailsGridProps) {
  const { surfaceClass, mutedTextClass } = useAppearance();

  const degrees = windDegrees(current.windDirection);
  const humidityValues = [
    current.minRelativeHumidityPercent,
    current.maxRelativeHumidityPercent,
  ].filter((v): v is number => v !== null);
  const humidityAvg =
    humidityValues.length > 0
      ? humidityValues.reduce((a, b) => a + b, 0) / humidityValues.length
      : null;

  return (
    <section aria-labelledby="details-heading" className="animate-fade-up">
      <h2 id="details-heading" className="sr-only">
        Detalhes meteorológicos
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <DetailCard
          icon={<Wind />}
          label="Vento"
          value={formatWind(
            current.windSpeedKmh,
            current.windSpeedDescription,
            current.windDirection,
          )}
          aside={degrees !== null ? <WindCompass degrees={degrees} /> : null}
          surfaceClass={surfaceClass}
          mutedTextClass={mutedTextClass}
        />

        <DetailCard
          icon={<Droplets />}
          label="Umidade"
          value={formatHumidityRange(
            current.minRelativeHumidityPercent,
            current.maxRelativeHumidityPercent,
          )}
          aside={humidityAvg !== null ? <WaveGauge percent={humidityAvg} /> : null}
          surfaceClass={surfaceClass}
          mutedTextClass={mutedTextClass}
        />

        <SunCard
          sunrise={current.sunrise}
          sunset={current.sunset}
          surfaceClass={surfaceClass}
          mutedTextClass={mutedTextClass}
        />

        <DetailCard
          icon={<Gauge />}
          label="Pressão"
          value={formatPressure(current.pressureHpa)}
          surfaceClass={surfaceClass}
          mutedTextClass={mutedTextClass}
        />

        <DetailCard
          icon={<CalendarDays />}
          label="Estação"
          value={current.season ?? "—"}
          surfaceClass={surfaceClass}
          mutedTextClass={mutedTextClass}
        />
      </div>
    </section>
  );
}

interface DetailCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  aside?: ReactNode;
  surfaceClass: string;
  mutedTextClass: string;
}

function DetailCard({
  icon,
  label,
  value,
  aside,
  surfaceClass,
  mutedTextClass,
}: DetailCardProps) {
  return (
    <div
      className={`lift flex items-center justify-between gap-2 rounded-[24px] p-4 ${surfaceClass}`}
    >
      <div className="min-w-0">
        <div
          className={`flex items-center gap-2 text-sm font-medium ${mutedTextClass}`}
        >
          <span className="text-sky-600 dark:text-zinc-200 [&>svg]:h-4 [&>svg]:w-4">
            {icon}
          </span>
          {label}
        </div>
        <p className="mt-2 text-xl leading-snug font-semibold">{value}</p>
      </div>
      {aside}
    </div>
  );
}

function WindCompass({ degrees }: { degrees: number }) {
  // O vento "vem de" `degrees`; a seta aponta para onde ele sopra.
  const angle = useEasedValue((degrees + 180) % 360, 1400);

  return (
    <div
      className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/40 ring-1 ring-sky-900/10 dark:bg-white/5 dark:ring-white/10"
      aria-hidden="true"
    >
      <span className="text-ink-muted absolute top-1 text-[9px] font-semibold">
        N
      </span>
      <ArrowUp
        className="mt-1 h-6 w-6 text-sky-700 dark:text-zinc-100"
        strokeWidth={2.25}
        style={{ transform: `rotate(${angle}deg)` }}
      />
    </div>
  );
}

function WaveGauge({ percent }: { percent: number }) {
  const level = useEasedValue(Math.min(Math.max(percent, 0), 100), 1600);

  return (
    <div
      className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-white/40 ring-1 ring-sky-900/10 dark:bg-white/5 dark:ring-white/10"
      aria-hidden="true"
    >
      <div
        className="absolute inset-x-0 bottom-0 bg-sky-400/70 dark:bg-zinc-300/55"
        style={{ height: `${level}%` }}
      >
        <svg
          className="animate-wave absolute -top-[7px] left-0 h-2 w-[200%] fill-sky-400/70 dark:fill-zinc-300/55"
          viewBox="0 0 120 10"
          preserveAspectRatio="none"
        >
          <path d="M0 5 Q15 0 30 5 T60 5 T90 5 T120 5 V10 H0 Z" />
        </svg>
      </div>
    </div>
  );
}

interface SunCardProps {
  sunrise: string | null;
  sunset: string | null;
  surfaceClass: string;
  mutedTextClass: string;
}

function SunCard({ sunrise, sunset, surfaceClass, mutedTextClass }: SunCardProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);

    return () => clearInterval(id);
  }, []);

  const rise = toMinutes(sunrise);
  const set = toMinutes(sunset);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const valid = rise !== null && set !== null && set > rise;
  const raw = valid ? (nowMin - rise) / (set - rise) : 0;
  const isDay = valid && raw >= 0 && raw <= 1;
  const progress = useEasedValue(Math.min(Math.max(raw, 0), 1), 1800);

  const x = 100 - 80 * Math.cos(Math.PI * progress);
  const y = 95 - 80 * Math.sin(Math.PI * progress);

  return (
    <div className={`lift col-span-2 rounded-[24px] p-4 ${surfaceClass}`}>
      <div
        className={`flex items-center justify-between text-sm font-medium ${mutedTextClass}`}
      >
        <span className="flex items-center gap-2">
          <Sunrise
            className="h-4 w-4 text-sky-600 dark:text-zinc-200"
            aria-hidden="true"
          />
          Sol
        </span>
        {valid && <span>{isDay ? "Dia" : "Noite"}</span>}
      </div>

      {valid && (
        <svg
          viewBox="0 0 200 104"
          className="mt-1 w-full"
          role="img"
          aria-label={`Posição do sol: ${isDay ? "dia" : "noite"}`}
        >
          <line
            x1="8"
            y1="95"
            x2="192"
            y2="95"
            stroke="currentColor"
            strokeOpacity="0.18"
            strokeWidth="1"
          />
          <path
            d="M 20 95 A 80 80 0 0 1 180 95"
            pathLength={100}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.16"
            strokeWidth="3"
            strokeDasharray="1 3"
            strokeLinecap="round"
          />
          <path
            d="M 20 95 A 80 80 0 0 1 180 95"
            pathLength={100}
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${progress * 100} 100`}
            className="stroke-sky-500 dark:stroke-zinc-200"
          />
          <g
            style={{ transform: `translate(${x}px, ${y}px)` }}
            opacity={isDay ? 1 : 0.55}
          >
            <circle
              r="15"
              className="animate-sun-glow fill-sky-400/30 dark:fill-white/20"
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
            <circle
              r="7"
              strokeWidth="3"
              className="fill-white stroke-sky-500 dark:stroke-zinc-300"
            />
          </g>
        </svg>
      )}

      <div className="mt-1 flex justify-between">
        <div>
          <p className={`text-sm ${mutedTextClass}`}>Nascer do sol</p>
          <p className="text-xl font-semibold">{formatTime(sunrise)}</p>
        </div>
        <div className="text-right">
          <p className={`text-sm ${mutedTextClass}`}>Pôr do sol</p>
          <p className="text-xl font-semibold">{formatTime(sunset)}</p>
        </div>
      </div>
    </div>
  );
}
