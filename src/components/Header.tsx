import { ChevronDown, Cloud, MapPin, SlidersHorizontal, Sun, Eye } from "lucide-react";
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
  const { highContrastDark, toggle, mutedTextClass } = useAppearance();

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 py-4">
      {/* Canto Esquerdo: Marca & Botão de Localização Clicável */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/20 text-sky-500 dark:text-sky-300">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">Nimbus</h1>
            <p className={`text-xs ${mutedTextClass}`}>Previsão do tempo</p>
          </div>
        </div>

        {/* Localização Atual Clicável (Abre Modal de Busca) */}
        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Alterar município"
          className={`group mt-1 inline-flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-xs font-semibold transition-all active:scale-95 ${
            highContrastDark
              ? "border-white bg-black text-white hover:bg-white hover:text-black"
              : "border-white/20 bg-white/20 dark:bg-black/25 backdrop-blur-md hover:bg-white/35 dark:hover:bg-black/40 text-slate-900 dark:text-white shadow-sm"
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-sky-500 shrink-0 group-hover:scale-110 transition-transform" />
          <span className="truncate max-w-[180px] sm:max-w-[260px]">
            {selectedLocation
              ? `${selectedLocation.name}, ${selectedLocation.state}`
              : "Buscar município"}
          </span>
          <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:translate-y-0.5 transition-transform shrink-0" />
        </button>
      </div>

      {/* Canto Direito: Toggle Rápido de Alto Contraste & Botão de Menu de Configurações */}
      <div className="flex items-center gap-2">
        {/* Botão original essencial do App.tsx de Alto Contraste */}
        <button
          type="button"
          aria-pressed={highContrastDark}
          onClick={toggle}
          title={highContrastDark ? "Mudar para modo claro" : "Mudar para modo escuro de alto contraste"}
          className={`inline-flex items-center gap-2 rounded-xl border-2 px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${
            highContrastDark
              ? "border-white bg-white text-black"
              : "border-current/40 bg-white/15 dark:bg-black/25 backdrop-blur-md hover:bg-white/25"
          }`}
        >
          {highContrastDark ? (
            <>
              <Sun className="w-4 h-4" />
              <span className="hidden sm:inline">Modo claro</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Modo escuro de alto contraste</span>
            </>
          )}
        </button>

        {/* Botão de Opções / Menu (Acessibilidade, Tema, Visão) */}
        <button
          type="button"
          onClick={onOpenSettings}
          aria-label="Abrir configurações de exibição e acessibilidade"
          className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all active:scale-95 ${
            highContrastDark
              ? "border-white bg-black text-white hover:bg-white hover:text-black"
              : "border-white/20 bg-white/20 dark:bg-black/25 backdrop-blur-md hover:bg-white/35 dark:hover:bg-black/40 text-slate-900 dark:text-white shadow-sm"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
