import type { Location } from "../types/location";

const IBGE_API_URL =
  "https://servicodados.ibge.gov.br/api/v1/localidades/municipios?";

const NOMINATIM_API_URL = "https://nominatim.openstreetmap.org/search?";

const NOMINATIM_REVERSE_API_URL =
  "https://nominatim.openstreetmap.org/reverse?";

interface IbgeMunicipality {
  "municipio-id": number;
  "municipio-nome": string;
  "UF-sigla": string;
}

let municipalitiesCache: IbgeMunicipality[] | null = null;
let municipalitiesRequest: Promise<IbgeMunicipality[]> | null = null;

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

async function getMunicipalities(): Promise<IbgeMunicipality[]> {
  if (municipalitiesCache) {
    return municipalitiesCache;
  }

  if (!municipalitiesRequest) {
    const params = new URLSearchParams({
      view: "nivelado",
      orderBy: "nome",
    });

    municipalitiesRequest = fetch(IBGE_API_URL + params)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`IBGE request failed: ${response.status}`);
        }

        const data = (await response.json()) as IbgeMunicipality[];

        municipalitiesCache = data;
        return data;
      })
      .catch((error: unknown) => {
        municipalitiesRequest = null;
        throw error;
      });
  }

  return municipalitiesRequest;
}

interface NominatimResult {
  lat: string;
  lon: string;
}

interface NominatimReverseResponse {
  address?: {
    municipality?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country_code?: string;
    "ISO3166-2-lvl4"?: string;
  };
}

export async function findCurrentMunicipality(): Promise<Location> {
  const coordinates = await new Promise<{
    latitude: number;
    longitude: number;
  }>((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        const message =
          error.code === 1
            ? "Location permission was denied. You can search for a municipality instead."
            : error.code === 3
              ? "Location request timed out. Please try again."
              : "Unable to determine your location. Please try again.";

        reject(new Error(message));
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  });

  await waitForNominatimSlot();

  const params = new URLSearchParams({
    lat: String(coordinates.latitude),
    lon: String(coordinates.longitude),
    format: "jsonv2",
    addressdetails: "1",
    zoom: "10",
    layer: "address",
    "accept-language": "pt-BR",
  });

  const response = await fetch(NOMINATIM_REVERSE_API_URL + params);

  if (!response.ok) {
    throw new Error(`Nominatim request failed: ${response.status}`);
  }

  const result = (await response.json()) as NominatimReverseResponse;
  const address = result.address;

  if (address?.country_code?.toLowerCase() !== "br") {
    throw new Error(
      "Your location could not be identified as being in Brazil.",
    );
  }

  const stateCode = address["ISO3166-2-lvl4"]?.match(/^BR-([A-Z]{2})$/)?.[1];

  const candidates = [
    address.municipality,
    address.city,
    address.town,
    address.village,
    address.county,
  ].filter((name): name is string => Boolean(name?.trim()));

  const municipalities = await getMunicipalities();
  let ambiguousMatch = false;

  for (const candidate of candidates) {
    const normalizedName = normalizeSearchText(candidate);

    const matches = municipalities.filter(
      (municipality) =>
        normalizeSearchText(municipality["municipio-nome"]) ===
          normalizedName &&
        (!stateCode || municipality["UF-sigla"] === stateCode),
    );

    if (matches.length === 1) {
      const municipality = matches[0];

      return {
        name: municipality["municipio-nome"],
        state: municipality["UF-sigla"],
        ibgeCode: String(municipality["municipio-id"]),
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      };
    }

    if (matches.length > 1) {
      ambiguousMatch = true;
    }
  }

  if (ambiguousMatch) {
    throw new Error(
      "Your location matched multiple municipalities. Please search by municipality name instead.",
    );
  }

  throw new Error(
    "Could not match your location to an IBGE municipality. Please search by municipality name instead.",
  );
}

export async function searchMunicipalities(query: string): Promise<Location[]> {
  const term = normalizeSearchText(query);

  if (term.length < 2) {
    return [];
  }

  const municipalities = await getMunicipalities();

  return municipalities
    .filter((municipality) => {
      const name = municipality["municipio-nome"];

      return (
        municipality["municipio-id"] != null &&
        Boolean(name) &&
        Boolean(municipality["UF-sigla"]) &&
        normalizeSearchText(name).includes(term)
      );
    })
    .slice(0, 15)
    .map((municipality) => ({
      name: municipality["municipio-nome"],
      state: municipality["UF-sigla"],
      ibgeCode: String(municipality["municipio-id"]),
    }));
}

let lastNominatimRequestAt = 0;
let nominatimQueue = Promise.resolve();

async function waitForNominatimSlot(): Promise<void> {
  let release!: () => void;
  const previous = nominatimQueue;

  nominatimQueue = new Promise<void>((resolve) => {
    release = resolve;
  });

  await previous;

  const delay = Math.max(0, 1100 - (Date.now() - lastNominatimRequestAt));

  if (delay > 0) {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, delay);
    });
  }

  lastNominatimRequestAt = Date.now();
  release();
}

export async function resolveMunicipalityCoordinates(
  location: Location,
): Promise<Location> {
  await waitForNominatimSlot();

  const params = new URLSearchParams({
    q: `${location.name}, ${location.state}, Brazil`,
    format: "jsonv2",
    limit: "1",
    countrycodes: "br",
  });

  const response = await fetch(NOMINATIM_API_URL + params);

  if (!response.ok) {
    throw new Error(`Nominatim request failed: ${response.status}`);
  }

  const results = (await response.json()) as NominatimResult[];
  const result = results[0];

  if (!result) {
    throw new Error("Could not resolve the municipality coordinates.");
  }

  const latitude = Number(result.lat);
  const longitude = Number(result.lon);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error("The municipality coordinates are invalid.");
  }

  return {
    ...location,
    latitude,
    longitude,
  };
}
