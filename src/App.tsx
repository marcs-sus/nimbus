import { useState } from "react";
import { AppearanceProvider } from "./components/AppearanceProvider";
import { Header } from "./components/Header";
import { SearchModal } from "./components/SearchModal";
import { SettingsModal } from "./components/SettingsModal";
import { WeatherBackground } from "./components/WeatherBackground";
import { WeatherReport } from "./components/WeatherReport";
import { useAppearance } from "./hooks/useAppearance";
import { useMunicipalitySearch } from "./hooks/useMunicipalitySearch";
import { useWeather } from "./hooks/useWeather";
import { weatherProvider } from "./services/weatherService";

const sourceLabel = weatherProvider === "inmet" ? "INMET" : "Open-Meteo";

function AppContent() {
  const { pageClass, mutedTextClass } = useAppearance();
  const search = useMunicipalitySearch();
  const { weather, isLoading, error, retry } = useWeather(
    search.selectedLocation,
  );

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  return (
    <div className={`relative min-h-screen w-full flex flex-col ${pageClass}`}>
      {/* Fundo Dinâmico com Gradients CSS e Animações Sutis */}
      <WeatherBackground
        description={weather?.current?.description ?? null}
        sunrise={weather?.current?.sunrise}
        sunset={weather?.current?.sunset}
      />

      {/* Container Principal Mobile-First Centralizado em Telas Maiores */}
      <main className="mx-auto flex-1 w-full max-w-xl px-4 py-4 sm:px-6 flex flex-col justify-between">
        <div className="space-y-4">
          {/* 1. Header (Localização clicável + Contraste + Menu de Opções) */}
          <Header
            selectedLocation={search.selectedLocation}
            onOpenSearch={() => setIsSearchModalOpen(true)}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
          />

          {/* 2 a 5. Conteúdo Meteorológico (Clima Atual, Horária, Detalhes, 5 Dias) */}
          <WeatherReport
            hasSelection={search.selectedLocation !== null}
            weather={weather}
            isLoading={isLoading}
            error={error}
            onRetry={retry}
            onOpenSearch={() => setIsSearchModalOpen(true)}
          />
        </div>

        {/* Rodapé com Atribuição OpenStreetMap (Preservado fielmente) */}
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

      {/* Modal de Busca de Cidades (Design Liquid Glass) */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        search={search}
        sourceLabel={sourceLabel}
      />

      {/* Modal de Configurações (Acessibilidade, Tema, Visão Detalhada) */}
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
