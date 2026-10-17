import { buttonClass, useAppearance } from "../hooks/useAppearance";
import type { MunicipalitySearch } from "../hooks/useMunicipalitySearch";

interface LocationSearchProps {
  search: MunicipalitySearch;
  sourceLabel: string;
}

export function LocationSearch({ search, sourceLabel }: LocationSearchProps) {
  const { surfaceClass, mutedTextClass } = useAppearance();
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
    <section className="mt-8" aria-labelledby="location-heading">
      <h2 id="location-heading" className="text-xl font-semibold">
        Buscar município
      </h2>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void runSearch();
        }}
        className="mt-4 flex flex-col gap-3 sm:flex-row"
      >
        <label htmlFor="municipality-search" className="sr-only">
          Nome do município
        </label>

        <input
          id="municipality-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Digite o nome do município"
          className="min-w-0 flex-1 rounded-md border-2 border-current bg-transparent px-3 py-2"
        />

        <button type="submit" disabled={isBusy} className={buttonClass}>
          {isSearching ? "Pesquisando…" : "Buscar"}
        </button>
      </form>

      <button
        type="button"
        disabled={isBusy}
        onClick={() => void locate()}
        className={`mt-3 ${buttonClass}`}
      >
        {isLocating ? "Identificando localização…" : "Usar minha localização"}
      </button>

      {error && (
        <p className="mt-3 text-sm" role="alert">
          {error}
        </p>
      )}

      {results.length > 0 && (
        <ul className="mt-4 space-y-2">
          {results.map((location) => (
            <li key={location.ibgeCode}>
              <button
                type="button"
                disabled={isSelecting || isLocating}
                onClick={() => void select(location)}
                className={`flex w-full items-center justify-between gap-4 rounded-lg border-2 p-3 text-left ${surfaceClass}`}
              >
                <span className="font-medium">
                  {location.name}, {location.state}
                </span>
                <span className={`text-sm ${mutedTextClass}`}>
                  IBGE {location.ibgeCode}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {isSelecting && (
        <p className="mt-3 text-sm" role="status">
          Selecionando município…
        </p>
      )}

      {selectedLocation && (
        <div className="mt-4">
          <h3 className="font-semibold">
            {selectedLocation.name}, {selectedLocation.state}
          </h3>
          <p className={`mt-1 text-sm ${mutedTextClass}`}>
            Código IBGE: {selectedLocation.ibgeCode}
          </p>
          <p className={`text-sm ${mutedTextClass}`}>
            Fonte meteorológica: {sourceLabel}
          </p>
        </div>
      )}
    </section>
  );
}
