import { useEffect, useRef, useState } from "react";
import { AppearanceProvider } from "./components/AppearanceProvider";
import { Header } from "./components/Header";
import { SearchModal } from "./components/SearchModal";
import { SettingsModal } from "./components/SettingsModal";
import { WeatherBackground } from "./components/WeatherBackground";
import { WeatherReport } from "./components/WeatherReport";
import { useAppearance } from "./hooks/useAppearance";
import { useMunicipalitySearch } from "./hooks/useMunicipalitySearch";
import { useWeather } from "./hooks/useWeather";
import { findCurrentMunicipality } from "./services/locationService";
import { weatherProvider } from "./services/weatherService";
import type { Location } from "./types/location";

const DEFAULT_LOCATION: Location = {
  name: import.meta.env.VITE_DEFAULT_LOCATION_NAME,
  state: import.meta.env.VITE_DEFAULT_LOCATION_STATE,
  ibgeCode: import.meta.env.VITE_DEFAULT_LOCATION_IBGE,
};

const LOCATION_TIMEOUT_MS = 2000;

const sourceLabel = weatherProvider === "inmet" ? "INMET" : "Open-Meteo";

function AppContent() {
  const { pageClass, mutedTextClass } = useAppearance();
  const search = useMunicipalitySearch();
  const { select } = search;
  const { weather, isLoading, error, retry } = useWeather(
    search.selectedLocation,
  );

  const [isResolvingDefault, setIsResolvingDefault] = useState(true);
  const startedRef = useRef(false);
  const selectedRef = useRef<Location | null>(null);

  useEffect(() => {
    selectedRef.current = search.selectedLocation;
  }, [search.selectedLocation]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    async function loadDefaultLocation() {
      let location = DEFAULT_LOCATION;

      try {
        location = await Promise.race([
          findCurrentMunicipality(),
          new Promise<never>((_, reject) => {
            setTimeout(
              () => reject(new Error("Tempo de busca excedido.")),
              LOCATION_TIMEOUT_MS,
            );
          }),
        ]);
      } catch {
        // permission denied
      }

      if (!selectedRef.current) {
        await select(location);
      }

      setIsResolvingDefault(false);
    }

    void loadDefaultLocation();
  }, [select]);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  return (
    <div className={`relative min-h-screen w-full flex flex-col ${pageClass}`}>
      <WeatherBackground description={weather?.current?.description ?? null} />

      <main className="mx-auto flex-1 w-full max-w-md px-4 py-4 flex flex-col justify-between">
        <div className="space-y-4">
          <Header
            selectedLocation={search.selectedLocation}
            onOpenSearch={() => setIsSearchModalOpen(true)}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
          />

          <WeatherReport
            hasSelection={search.selectedLocation !== null}
            weather={weather}
            isLoading={isLoading || isResolvingDefault}
            error={error}
            onRetry={retry}
            onOpenSearch={() => setIsSearchModalOpen(true)}
          />
        </div>

        <footer className={`mt-10 mb-4 text-center text-xs ${mutedTextClass}`}>
          Geocodificação ©{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noreferrer"
            className="underline hover:opacity-80 transition-opacity"
          >
            colaboradores do OpenStreetMap
          </a>
        </footer>
      </main>

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        search={search}
        sourceLabel={sourceLabel}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppearanceProvider>
      <AppContent />
    </AppearanceProvider>
  );
}
