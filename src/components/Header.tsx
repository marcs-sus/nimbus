import { ChevronDown, Contrast, SlidersHorizontal } from "lucide-react";
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
  const { highContrastDark, toggle } = useAppearance();

  return (
    <header className="flex items-center justify-between gap-3 pt-2">
      <h1 className="sr-only">Nimbus</h1>

      <button
        type="button"
        onClick={onOpenSearch}
        aria-label="Alterar município"
        className="group flex min-w-0 items-center gap-1.5 rounded-2xl px-1 py-1 text-left"
      >
        <span className="min-w-0">
          <span className="block truncate text-[26px] leading-tight font-semibold tracking-tight">
            {selectedLocation ? selectedLocation.name : "Escolher município"}
          </span>
          {selectedLocation && (
            <span className="text-ink-muted block text-sm">
              {selectedLocation.state}
            </span>
          )}
        </span>
        <ChevronDown
          className="text-ink-muted h-5 w-5 shrink-0 transition-transform group-hover:translate-y-0.5"
          aria-hidden="true"
        />
      </button>

      <div className="flex shrink-0 items-center gap-2.5">
        <button
          type="button"
          aria-pressed={highContrastDark}
          aria-label={
            highContrastDark ? "Desativar alto contraste" : "Ativar alto contraste"
          }
          title={highContrastDark ? "Modo claro" : "Modo escuro de alto contraste"}
          onClick={toggle}
          className={`flex h-11 w-11 items-center justify-center rounded-full ${
            highContrastDark ? "glass-active" : "glass-pill"
          }`}
        >
          <Contrast className="h-5 w-5" aria-hidden="true" />
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
