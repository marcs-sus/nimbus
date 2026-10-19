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
} from "lucide-react";
import type { ReactNode } from "react";

export function getWeatherIcon(
  description: string | null,
  isNight = false,
  className = "w-6 h-6",
  strokeWidth = 1.75,
): ReactNode {
  const props = { className, strokeWidth, "aria-hidden": true } as const;
  const text = (description ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (/tempestade|trovoada|raio/.test(text))
    return <CloudLightning {...props} />;
  if (/chuvisco|garoa/.test(text)) return <CloudDrizzle {...props} />;
  if (/chuva|chuvoso|pancada/.test(text)) return <CloudRain {...props} />;
  if (/nevoeiro|nevoa/.test(text)) return <CloudFog {...props} />;
  if (/encoberto/.test(text)) return <Cloud {...props} />;
  if (/nublado|nuvens|parcial/.test(text)) {
    return isNight ? <CloudMoon {...props} /> : <CloudSun {...props} />;
  }

  return isNight ? <Moon {...props} /> : <Sun {...props} />;
}
