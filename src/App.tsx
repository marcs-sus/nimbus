import { AppearanceProvider } from "./components/AppearanceProvider";
import { LocationSearch } from "./components/LocationSearch";
import { WeatherReport } from "./components/WeatherReport";
import { buttonClass, useAppearance } from "./hooks/useAppearance";
import { useMunicipalitySearch } from "./hooks/useMunicipalitySearch";
import { useWeather } from "./hooks/useWeather";
import { weatherProvider } from "./services/weatherService";

const sourceLabel = weatherProvider === "inmet" ? "INMET" : "Open-Meteo";

function AppContent() {
  const { highContrastDark, toggle, pageClass, mutedTextClass } =
    useAppearance();
  const search = useMunicipalitySearch();
  const { weather, isLoading, error, retry } = useWeather(
    search.selectedLocation,
  );

  return (
    <main className={`min-h-screen w-full ${pageClass}`}>
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Nimbus</h1>
            <p className={`mt-1 text-sm ${mutedTextClass}`}>
              Previsão do tempo
            </p>
          </div>

          <button
            type="button"
            aria-pressed={highContrastDark}
            onClick={toggle}
            className={buttonClass}
          >
            {highContrastDark ? "Modo claro" : "Modo escuro de alto contraste"}
          </button>
        </header>

        <LocationSearch search={search} sourceLabel={sourceLabel} />

        <WeatherReport
          hasSelection={search.selectedLocation !== null}
          weather={weather}
          isLoading={isLoading}
          error={error}
          onRetry={retry}
        />

        <footer className={`mt-8 text-xs ${mutedTextClass}`}>
          Geocodificação ©{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            colaboradores do OpenStreetMap
          </a>
        </footer>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <AppearanceProvider>
      <AppContent />
    </AppearanceProvider>
  );
}
