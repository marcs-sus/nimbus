import {
  AlertCircle,
  CheckCircle2,
  Compass,
  Loader2,
  MapPin,
  Search,
} from "lucide-react";
import { useAppearance } from "../hooks/useAppearance";
import type { MunicipalitySearch } from "../hooks/useMunicipalitySearch";

interface LocationSearchProps {
  search: MunicipalitySearch;
  sourceLabel: string;
}

export function LocationSearch({ search, sourceLabel }: LocationSearchProps) {
  const { surfaceClass, mutedTextClass, highContrastDark } = useAppearance();
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

  return (
    <section
      className={`mt-4 rounded-3xl p-5 sm:p-6 ${surfaceClass}`}
      aria-labelledby="location-heading"
    >
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-sky-500" />
        <h2 id="location-heading" className="text-base font-bold">
          Buscar município
        </h2>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void runSearch();
        }}
        className="flex flex-col gap-2.5 sm:flex-row"
      >
        <label htmlFor="municipality-search" className="sr-only">
          Nome do município
        </label>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
          <input
            id="municipality-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Digite o nome do município (ex: Curitiba)"
            className={`w-full rounded-2xl border pl-10 pr-4 py-2.5 text-sm transition-all outline-none focus:ring-2 focus:ring-sky-500/50 ${
              highContrastDark
                ? "border-white bg-black text-white placeholder-slate-400"
                : "border-white/30 bg-white/20 dark:bg-black/25 placeholder-current/50"
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

      <button
        type="button"
        disabled={isBusy}
        onClick={() => void locate()}
        className={`mt-3 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-2 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
          highContrastDark
            ? "border-white hover:bg-white hover:text-black"
            : "border-white/25 bg-white/15 dark:bg-black/20 hover:bg-white/25"
        }`}
      >
        {isLocating ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
            <span>Identificando localização…</span>
          </>
        ) : (
          <>
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>Usar minha localização</span>
          </>
        )}
      </button>

      {error && (
        <div
          className={`mt-3 flex items-start gap-2 rounded-2xl p-3 text-xs ${
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

      {results.length > 0 && (
        <ul className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-1 no-scrollbar">
          {results.map((location) => (
            <li key={location.ibgeCode}>
              <button
                type="button"
                disabled={isSelecting || isLocating}
                onClick={() => void select(location)}
                className={`flex w-full items-center justify-between gap-4 rounded-2xl border p-3 text-left transition-all active:scale-[0.99] ${
                  highContrastDark
                    ? "border-white hover:bg-white hover:text-black"
                    : "border-white/20 bg-white/15 dark:bg-black/20 hover:bg-white/30"
                }`}
              >
                <span className="font-semibold text-sm">
                  {location.name}, {location.state}
                </span>
                <span className={`text-xs ${mutedTextClass}`}>
                  IBGE {location.ibgeCode}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {isSelecting && (
        <div className="flex items-center gap-2 mt-3 text-xs" role="status">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
          <span>Selecionando município…</span>
        </div>
      )}

      {selectedLocation && (
        <div
          className={`mt-4 rounded-2xl border p-4 ${
            highContrastDark
              ? "border-white bg-black"
              : "border-white/20 bg-white/20 dark:bg-black/20"
          }`}
        >
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Município Ativo</span>
          </div>
          <h3 className="font-bold text-base">
            {selectedLocation.name}, {selectedLocation.state}
          </h3>
          <div
            className={`mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs ${mutedTextClass}`}
          >
            <p>Código IBGE: {selectedLocation.ibgeCode}</p>
            <p>Fonte meteorológica: {sourceLabel}</p>
          </div>
        </div>
      )}
    </section>
  );
}
