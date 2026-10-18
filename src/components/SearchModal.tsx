import { useEffect } from "react";
import { Compass, Loader2, Search as SearchIcon, X } from "lucide-react";
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
  const { mutedTextClass } = useAppearance();
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
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh] sm:items-center sm:pt-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
    >
      <div
        className="animate-fade fixed inset-0 bg-sky-950/20 backdrop-blur-sm dark:bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="glass-strong animate-pop relative z-10 flex max-h-[80vh] w-full max-w-md flex-col rounded-[32px] p-6">
        <div className="flex items-center justify-between">
          <h2 id="search-modal-title" className="text-xl font-semibold">
            Buscar município
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar busca de município"
            className="glass-pill flex h-9 w-9 items-center justify-center rounded-full"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void runSearch();
          }}
          className="mt-5 flex gap-2"
        >
          <label htmlFor="modal-municipality-search" className="sr-only">
            Nome do município
          </label>

          <div className="relative min-w-0 flex-1">
            <SearchIcon
              className="text-ink-muted absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              id="modal-municipality-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Digite o nome do município"
              autoFocus
              className="glass-input w-full rounded-full py-3 pr-4 pl-11 text-base"
            />
          </div>

          <button
            type="submit"
            disabled={isBusy}
            className="btn-primary flex shrink-0 items-center gap-2 rounded-full px-5 text-base font-semibold"
          >
            {isSearching ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span className="sr-only">Pesquisando…</span>
              </>
            ) : (
              "Buscar"
            )}
          </button>
        </form>

        <button
          type="button"
          disabled={isBusy}
          onClick={async () => {
            await locate();
            onClose();
          }}
          className="glass-pill mt-3 flex w-full items-center justify-center gap-2 rounded-full py-3 text-base font-medium"
        >
          {isLocating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Identificando localização…
            </>
          ) : (
            <>
              <Compass className="h-4 w-4" aria-hidden="true" />
              Usar minha localização
            </>
          )}
        </button>

        {error && (
          <p className="glass mt-3 rounded-2xl px-4 py-3 text-sm" role="alert">
            {error}
          </p>
        )}

        <div className="no-scrollbar mt-4 min-h-0 flex-1 overflow-y-auto">
          {results.length > 0 && (
            <ul className="space-y-2">
              {results.map((location) => (
                <li key={location.ibgeCode}>
                  <button
                    type="button"
                    disabled={isSelecting || isLocating}
                    onClick={async () => {
                      await select(location);
                      onClose();
                    }}
                    className="glass-pill flex w-full items-center justify-between gap-4 rounded-2xl px-4 py-3.5 text-left"
                  >
                    <span className="text-base font-medium">
                      {location.name}, {location.state}
                    </span>
                    <span className={`shrink-0 text-xs ${mutedTextClass}`}>
                      IBGE {location.ibgeCode}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {isSelecting && (
            <p
              className="flex items-center justify-center gap-2 py-3 text-sm"
              role="status"
            >
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Selecionando município…
            </p>
          )}

          {selectedLocation && (
            <div className={`mt-3 px-1 text-sm ${mutedTextClass}`}>
              <p className="text-ink text-base font-semibold">
                {selectedLocation.name}, {selectedLocation.state}
              </p>
              <p>Código IBGE: {selectedLocation.ibgeCode}</p>
              <p>Fonte meteorológica: {sourceLabel}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
