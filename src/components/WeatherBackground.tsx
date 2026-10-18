import { useAppearance } from "../hooks/useAppearance";

interface WeatherBackgroundProps {
  description: string | null;
}

type Kind = "clear" | "clouds" | "rain" | "storm" | "fog";

function getKind(description: string | null): Kind {
  const text = (description ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (/tempestade|trovoada|raio/.test(text)) return "storm";
  if (/chuva|chuvisco|chuvoso|pancada|garoa/.test(text)) return "rain";
  if (/nevoeiro|nevoa/.test(text)) return "fog";
  if (/nublado|encoberto|nuvens|parcial/.test(text)) return "clouds";
  return "clear";
}

const KINDS: Kind[] = ["clear", "clouds", "rain", "storm", "fog"];

// Tema claro: quanto pior o tempo, mais escuro. Tema escuro: quanto pior, mais claro.
const GRADIENTS: Record<Kind, string> = {
  clear:
    "from-[#f6fbff] via-[#cfeaff] to-[#8fcdf8] dark:from-[#131315] dark:via-[#1b1b1e] dark:to-[#242427]",
  clouds:
    "from-[#e9f1f8] via-[#c9dcee] to-[#a2c1dc] dark:from-[#1a1a1d] dark:via-[#232327] dark:to-[#2c2c31]",
  fog: "from-[#f3f8fc] via-[#dbe7f1] to-[#bccfe0] dark:from-[#1d1d20] dark:via-[#27272b] dark:to-[#303035]",
  rain: "from-[#d3e0ec] via-[#a4c0d8] to-[#7699b9] dark:from-[#222226] dark:via-[#2c2c31] dark:to-[#37373d]",
  storm:
    "from-[#bccddd] via-[#8fadc8] to-[#6d8fb0] dark:from-[#2a2a2f] dark:via-[#35353b] dark:to-[#414148]",
};

const DROPS = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 5.7 + 2) % 100}%`,
  delay: `${(i * 0.37) % 1.6}s`,
  duration: `${0.8 + (i % 4) * 0.2}s`,
  height: 56 + (i % 3) * 18,
}));

export function WeatherBackground({ description }: WeatherBackgroundProps) {
  const { highContrastDark } = useAppearance();

  if (highContrastDark) {
    return (
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-black"
        aria-hidden="true"
      />
    );
  }

  const kind = getKind(description);
  const raining = kind === "rain" || kind === "storm";

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Camadas de degradê com crossfade suave entre climas */}
      {KINDS.map((k) => (
        <div
          key={k}
          className={`absolute inset-0 bg-linear-to-b transition-opacity duration-[1600ms] ease-in-out ${GRADIENTS[k]} ${
            k === kind ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {/* Massas fluidas: dão o que refratar ao vidro */}
      <div className="animate-blob-a absolute -top-28 -left-28 h-[28rem] w-[28rem] rounded-full bg-white/75 blur-3xl dark:bg-white/[0.06]" />
      <div className="animate-blob-b absolute top-1/3 -right-36 h-[26rem] w-[26rem] rounded-full bg-sky-300/60 blur-3xl dark:bg-white/[0.05]" />
      <div className="animate-blob-c absolute -bottom-36 left-1/4 h-[30rem] w-[30rem] rounded-full bg-sky-200/80 blur-3xl dark:bg-zinc-300/[0.06]" />

      {kind === "clear" && (
        <div className="animate-sun-glow absolute top-12 right-10 h-24 w-24 rounded-full bg-white shadow-[0_0_90px_36px_rgba(255,255,255,0.85)] dark:opacity-40" />
      )}

      {(kind === "clouds" || kind === "rain" || kind === "storm") && (
        <>
          <div className="animate-cloud-slow absolute top-[12%] -left-1/4 h-52 w-[150%] rounded-full bg-white/55 blur-3xl dark:bg-white/10" />
          <div className="animate-cloud-reverse absolute top-[38%] -right-1/4 h-60 w-[140%] rounded-full bg-white/40 blur-3xl dark:bg-white/5" />
        </>
      )}

      {raining &&
        DROPS.map((drop, i) => (
          <div
            key={i}
            className="animate-rain absolute -top-24 w-px bg-linear-to-b from-transparent to-sky-700/45 dark:to-white/60"
            style={{
              left: drop.left,
              height: drop.height,
              animationDelay: drop.delay,
              animationDuration: drop.duration,
            }}
          />
        ))}

      {kind === "storm" && (
        <div className="animate-lightning absolute inset-0 bg-white/50" />
      )}

      {kind === "fog" && (
        <>
          <div className="animate-fog absolute top-1/4 -left-10 h-48 w-[120%] rounded-full bg-white/70 blur-3xl dark:bg-white/10" />
          <div className="animate-fog absolute top-3/5 -left-10 h-56 w-[120%] rounded-full bg-white/60 blur-3xl [animation-direction:reverse] dark:bg-white/10" />
        </>
      )}
    </div>
  );
}
