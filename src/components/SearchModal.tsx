import { useEffect } from "react";
import {
  Compass,
  MapPin,
  Search as SearchIcon,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAppearance } from "../hooks/useAppearance";
import type { MunicipalitySearch } from "../hooks/useMunicipalitySearch";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  search: MunicipalitySearch;
  sourceLabel: string;
}

export function SearchModal({
  isOpen,
  onClose,
  search,
  sourceLabel,
}: SearchModalProps) {
  const { highContrastDark, mutedTextClass } = useAppearance();
  const {
    query,
    setQuery,
    results,
    selectedLocation,
    isSearching,
    isSelecting,
    isLocating,
    isBusy,
    error,
    search: runSearch,
    select,
    locate,
  } = search;

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        className={`relative z-10 w-full max-w-lg rounded-3xl p-6 transition-all shadow-2xl flex flex-col max-h-[85vh] ${
          highContrastDark
            ? "border-2 border-white bg-black text-white"
            : "border border-white/30 bg-white/40 dark:bg-slate-900/60 backdrop-blur-2xl text-slate-900 dark:text-white"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-current/15">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-500" />
            <h2 id="search-modal-title" className="text-lg font-bold">
              Buscar município
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar busca de município"
            className="rounded-full p-2 hover:bg-white/20 dark:hover:bg-black/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-4 flex-1 overflow-y-auto pr-1 no-scrollbar space-y-4">
          {/* Formulário de Busca */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void runSearch();
            }}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <label htmlFor="modal-municipality-search" className="sr-only">
              Nome do município
            </label>

            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
              <input
                id="modal-municipality-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Digite o nome do município (ex: São Paulo)"
                autoFocus
                className={`w-full rounded-2xl border pl-10 pr-4 py-2.5 text-sm transition-all outline-none focus:ring-2 focus:ring-sky-500/50 ${
                  highContrastDark
                    ? "border-white bg-black text-white placeholder-slate-400"
                    : "border-white/30 bg-white/25 dark:bg-black/30 placeholder-current/50"
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={isBusy}
              className={`rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                highContrastDark
                  ? "border-2 border-white bg-white text-black"
                  : "bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-500/20"
              }`}
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Pesquisando…</span>
                </>
              ) : (
                "Buscar"
              )}
            </button>
          </form>

          {/* Botão Usar Minha Localização */}
          <button
            type="button"
            disabled={isBusy}
            onClick={async () => {
              await locate();
              onClose();
            }}
            className={`w-full flex items-center justify-center gap-2 rounded-2xl border p-3 text-sm font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
              highContrastDark
                ? "border-white hover:bg-white hover:text-black"
                : "border-white/25 bg-white/20 dark:bg-black/20 hover:bg-white/30"
            }`}
          >
            {isLocating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                <span>Identificando localização…</span>
              </>
            ) : (
              <>
                <Compass className="w-4 h-4 text-sky-400" />
                <span>Usar minha localização</span>
              </>
            )}
          </button>

          {/* Erro de busca ou geolocalização */}
          {error && (
            <div
              className={`flex items-start gap-2.5 rounded-2xl p-3 text-sm ${
                highContrastDark
                  ? "border border-white bg-black text-white"
                  : "bg-red-500/15 border border-red-500/30 text-red-900 dark:text-red-200"
              }`}
              role="alert"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Lista de Resultados */}
          {results.length > 0 && (
            <div className="space-y-2">
              <p className={`text-xs font-semibold uppercase tracking-wider ${mutedTextClass}`}>
                Municípios encontrados ({results.length})
              </p>
              <ul className="space-y-2 max-h-56 overflow-y-auto pr-1 no-scrollbar">
                {results.map((location) => (
                  <li key={location.ibgeCode}>
                    <button
                      type="button"
                      disabled={isSelecting || isLocating}
                      onClick={async () => {
                        await select(location);
                        onClose();
                      }}
                      className={`flex w-full items-center justify-between gap-4 rounded-2xl border p-3 text-left transition-all active:scale-[0.98] ${
                        highContrastDark
                          ? "border-white hover:bg-white hover:text-black"
                          : "border-white/20 bg-white/20 dark:bg-black/25 hover:bg-white/35 dark:hover:bg-black/40"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                        <span className="font-semibold text-sm">
                          {location.name}, {location.state}
                        </span>
                      </div>
                      <span className={`text-xs ${mutedTextClass}`}>
                        IBGE {location.ibgeCode}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isSelecting && (
            <div className="flex items-center justify-center gap-2 py-3" role="status">
              <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
              <p className="text-sm">Selecionando município…</p>
            </div>
          )}

          {/* Localização selecionada no momento */}
          {selectedLocation && (
            <div
              className={`mt-4 rounded-2xl border p-4 ${
                highContrastDark
                  ? "border-white bg-black"
                  : "border-white/20 bg-white/20 dark:bg-black/20"
              }`}
            >
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Localização Ativa</span>
              </div>
              <h3 className="font-bold text-base">
                {selectedLocation.name}, {selectedLocation.state}
              </h3>
              <div className={`mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs ${mutedTextClass}`}>
                <p>Código IBGE: {selectedLocation.ibgeCode}</p>
                <p>Fonte meteorológica: {sourceLabel}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
