import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSun,
  Moon,
  Sun,
  SunMedium,
} from "lucide-react";
import type { ReactNode } from "react";

export function getWeatherIcon(
  description: string | null,
  isNight = false,
  className = "w-6 h-6",
): ReactNode {
  if (!description) {
    return isNight ? (
      <Moon className={`${className} text-sky-200`} />
    ) : (
      <Sun className={`${className} text-amber-400`} />
    );
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
    return <CloudLightning className={`${className} text-amber-300`} />;
  }

  if (text.includes("chuvisco") || text.includes("garoa")) {
    return <CloudDrizzle className={`${className} text-sky-300`} />;
  }

  if (
    text.includes("chuva") ||
    text.includes("chuvoso") ||
    text.includes("pancada")
  ) {
    return <CloudRain className={`${className} text-blue-400`} />;
  }

  if (text.includes("nevoeiro") || text.includes("nevoa")) {
    return <CloudFog className={`${className} text-slate-300`} />;
  }

  if (text.includes("encoberto")) {
    return <Cloud className={`${className} text-slate-400`} />;
  }

  if (text.includes("nublado") || text.includes("nuvens") || text.includes("parcial")) {
    return isNight ? (
      <CloudMoon className={`${className} text-sky-300`} />
    ) : (
      <CloudSun className={`${className} text-amber-300`} />
    );
  }

  if (
    text.includes("sol") ||
    text.includes("claro") ||
    text.includes("ensolarado") ||
    text.includes("limpo")
  ) {
    return isNight ? (
      <Moon className={`${className} text-sky-200`} />
    ) : (
      <SunMedium className={`${className} text-amber-400`} />
    );
  }

  return isNight ? (
    <Moon className={`${className} text-sky-200`} />
  ) : (
    <Sun className={`${className} text-amber-400`} />
  );
}
