import { useAppearance } from "../hooks/useAppearance";

interface WeatherBackgroundProps {
  description: string | null;
  sunrise?: string | null;
  sunset?: string | null;
}

type WeatherType =
  | "clear-day"
  | "clear-night"
  | "clouds-day"
  | "clouds-night"
  | "rain"
  | "storm"
  | "fog"
  | "default";

function isNightTime(sunrise?: string | null, sunset?: string | null): boolean {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  if (sunrise && sunset) {
    const parseTime = (timeStr: string) => {
      const match = timeStr.match(/(\d{1,2}):(\d{2})/);
      if (match) {
        return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
      }
      return null;
    };

    const riseMinutes = parseTime(sunrise);
    const setMinutes = parseTime(sunset);

    if (riseMinutes !== null && setMinutes !== null) {
      return currentMinutes < riseMinutes || currentMinutes >= setMinutes;
    }
  }

  const hour = now.getHours();
  return hour < 6 || hour >= 18;
}

function getWeatherType(
  description: string | null,
  isNight: boolean,
): WeatherType {
  if (!description) {
    return isNight ? "clear-night" : "clear-day";
  }

  const text = description
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (
    text.includes("tempestade") ||
    text.includes("trovoada") ||
    text.includes("raio")
  ) {
    return "storm";
  }

  if (
    text.includes("chuva") ||
    text.includes("chuvisco") ||
    text.includes("chuvoso") ||
    text.includes("pancada")
  ) {
    return "rain";
  }

  if (text.includes("nevoeiro") || text.includes("nevoa")) {
    return "fog";
  }

  if (
    text.includes("nublado") ||
    text.includes("encoberto") ||
    text.includes("nuvens") ||
    text.includes("parcial")
  ) {
    return isNight ? "clouds-night" : "clouds-day";
  }

  if (
    text.includes("sol") ||
    text.includes("claro") ||
    text.includes("ensolarado") ||
    text.includes("limpo")
  ) {
    return isNight ? "clear-night" : "clear-day";
  }

  return isNight ? "clear-night" : "clear-day";
}

export function WeatherBackground({
  description,
  sunrise,
  sunset,
}: WeatherBackgroundProps) {
  const { highContrastDark } = useAppearance();

  if (highContrastDark) {
    return (
      <div
        className="fixed inset-0 -z-10 bg-black pointer-events-none"
        aria-hidden="true"
      />
    );
  }

  const isNight = isNightTime(sunrise, sunset);
  const weatherType = getWeatherType(description, isNight);

  const getGradient = () => {
    switch (weatherType) {
      case "clear-day":
        return "from-sky-400 via-sky-300 to-amber-200 dark:from-sky-800 dark:via-blue-900 dark:to-indigo-950";
      case "clear-night":
        return "from-slate-950 via-indigo-950 to-slate-900";
      case "clouds-day":
        return "from-slate-400 via-sky-300 to-slate-300 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950";
      case "clouds-night":
        return "from-slate-900 via-slate-950 to-zinc-950";
      case "rain":
        return "from-slate-700 via-blue-950 to-slate-900";
      case "storm":
        return "from-slate-950 via-indigo-950 to-purple-950";
      case "fog":
        return "from-slate-400 via-zinc-400 to-stone-300 dark:from-slate-800 dark:via-zinc-900 dark:to-slate-900";
      default:
        return "from-sky-400 via-blue-500 to-indigo-600 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-950";
    }
  };

  return (
    <div
      className={`fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br ${getGradient()} transition-colors duration-1000 pointer-events-none`}
      aria-hidden="true"
    >
      {/* Sol radiante animado em dias claros */}
      {weatherType === "clear-day" && (
        <div className="absolute -top-12 -right-12 h-80 w-80 rounded-full bg-amber-300/40 blur-3xl animate-sun-glow dark:bg-amber-500/20" />
      )}

      {/* Lua / Brilho suave em noites claras */}
      {weatherType === "clear-night" && (
        <>
          <div className="absolute top-12 right-16 h-36 w-36 rounded-full bg-sky-200/20 blur-2xl" />
          <div className="absolute top-16 right-20 h-16 w-16 rounded-full bg-slate-100/40 blur-sm" />
          {/* Estrelas sutis com pontos pontilhados */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        </>
      )}

      {/* Nuvens dinâmicas em movimento */}
      {(weatherType === "clouds-day" || weatherType === "clouds-night") && (
        <>
          <div className="absolute top-1/4 -left-1/4 h-64 w-[150%] rounded-full bg-white/20 dark:bg-white/5 blur-3xl animate-cloud-slow" />
          <div className="absolute top-1/2 -right-1/4 h-72 w-[140%] rounded-full bg-slate-100/25 dark:bg-black/30 blur-3xl animate-cloud-reverse" />
        </>
      )}

      {/* Chuva e partículas de água caindo */}
      {(weatherType === "rain" || weatherType === "storm") && (
        <>
          <div className="absolute inset-0 bg-black/15" />
          {/* Gotas de chuva CSS puro */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-0 left-1/4 h-24 w-0.5 bg-gradient-to-b from-transparent to-white animate-rain-1" />
            <div className="absolute top-0 left-1/2 h-28 w-0.5 bg-gradient-to-b from-transparent to-white animate-rain-2" />
            <div className="absolute top-0 left-3/4 h-20 w-0.5 bg-gradient-to-b from-transparent to-white animate-rain-3" />
            <div className="absolute top-0 left-1/6 h-22 w-0.5 bg-gradient-to-b from-transparent to-white animate-rain-2" />
            <div className="absolute top-0 left-5/6 h-26 w-0.5 bg-gradient-to-b from-transparent to-white animate-rain-1" />
          </div>
        </>
      )}

      {/* Relâmpagos para tempestades */}
      {weatherType === "storm" && (
        <div className="absolute inset-0 bg-indigo-100/30 dark:bg-purple-200/25 animate-lightning" />
      )}

      {/* Névoa / Nevoeiro */}
      {weatherType === "fog" && (
        <>
          <div className="absolute inset-0 bg-white/30 dark:bg-black/40 blur-xl animate-fog" />
          <div className="absolute inset-0 opacity-50 bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:16px_16px]" />
        </>
      )}

      {/* Vinheta suave nos cantos para elegância visual */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/25 dark:to-black/50" />
    </div>
  );
}
