import { useState } from "react";
import {
  findCurrentMunicipality,
  resolveMunicipalityCoordinates,
  searchMunicipalities,
} from "../services/locationService";
import { weatherProvider } from "../services/weatherService";
import { getErrorMessage } from "../lib/errors";
import type { Location } from "../types/location";

export interface MunicipalitySearch {
  query: string;
  setQuery: (value: string) => void;
  results: Location[];
  selectedLocation: Location | null;
  isSearching: boolean;
  isSelecting: boolean;
  isLocating: boolean;
  isBusy: boolean;
  error: string | null;
  search: () => Promise<void>;
  select: (location: Location) => Promise<void>;
  locate: () => Promise<void>;
}

export function useMunicipalitySearch(): MunicipalitySearch {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  const [isSearching, setIsSearching] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function search() {
    const term = query.trim();

    if (term.length < 2) {
      setError("Digite pelo menos dois caracteres.");
      return;
    }

    setIsSearching(true);
    setError(null);
    setResults([]);
    setSelectedLocation(null);

    try {
      const found = await searchMunicipalities(term);

      setResults(found);

      if (found.length === 0) {
        setError("Nenhum município encontrado.");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Não foi possível pesquisar municípios."));
    } finally {
      setIsSearching(false);
    }
  }

  async function select(location: Location) {
    setIsSelecting(true);
    setError(null);
    setSelectedLocation(null);

    try {
      // Open-Meteo needs coordinates, so resolve them before selecting.
      // INMET works directly from the IBGE municipality code.
      const prepared =
        weatherProvider === "open-meteo"
          ? await resolveMunicipalityCoordinates(location)
          : location;

      setQuery(prepared.name);
      setSelectedLocation(prepared);
    } catch (err) {
      setError(
        getErrorMessage(err, "Não foi possível selecionar este município."),
      );
    } finally {
      setIsSelecting(false);
    }
  }

  async function locate() {
    setIsLocating(true);
    setError(null);
    setResults([]);
    setSelectedLocation(null);

    try {
      const location = await findCurrentMunicipality();

      setQuery(location.name);
      setSelectedLocation(location);
    } catch (err) {
      setError(
        getErrorMessage(err, "Não foi possível identificar sua localização."),
      );
    } finally {
      setIsLocating(false);
    }
  }

  return {
    query,
    setQuery,
    results,
    selectedLocation,
    isSearching,
    isSelecting,
    isLocating,
    isBusy: isSearching || isSelecting || isLocating,
    error,
    search,
    select,
    locate,
  };
}
