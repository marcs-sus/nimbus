import { ChevronDown, MapPin, Moon, SlidersHorizontal, Sun } from "lucide-react";
import { useAppearance } from "../hooks/useAppearance";
import type { Location } from "../types/location";

interface HeaderProps {
  selectedLocation: Location | null;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
}

export function Header({
  selectedLocation,
  onOpenSearch,
  onOpenSettings,
}: HeaderProps) {
  const { highContrastDark, theme, setTheme } = useAppearance();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <header className="flex items-center justify-between gap-3 pt-2">
      <h1 className="sr-only">Nimbus</h1>

      <button
        type="button"
        onClick={onOpenSearch}
        aria-label="Alterar município"
        className="glass-pill group flex h-11 min-w-0 items-center gap-2 rounded-full pr-3 pl-4"
      >
        <MapPin className="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />
        <span className="min-w-0 truncate text-base font-semibold tracking-tight">
          {selectedLocation ? selectedLocation.name : "Escolher município"}
        </span>
        {selectedLocation && (
          <span className="text-ink-muted shrink-0 text-sm font-medium">
            {selectedLocation.state}
          </span>
        )}
        <ChevronDown
          className="text-ink-muted h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-y-0.5"
          aria-hidden="true"
        />
      </button>

      <div className="flex shrink-0 items-center gap-2.5">
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          disabled={highContrastDark}
          aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
          title={
            highContrastDark
              ? "Desative o alto contraste nas opções para trocar o tema"
              : isDark
                ? "Tema claro"
                : "Tema escuro"
          }
          className="glass-pill flex h-11 w-11 items-center justify-center rounded-full"
        >
          {isDark ? (
            <Sun className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Moon className="h-5 w-5" aria-hidden="true" />
          )}
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          aria-label="Abrir opções"
          className="glass-pill flex h-11 w-11 items-center justify-center rounded-full"
        >
          <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
