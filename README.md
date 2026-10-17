# nimbus

## Summary

Nimbus is a single-page weather forecast web app (pt-BR) for Brazilian municipalities. It displays current conditions and a five-day forecast for the selected location, with a high-contrast dark mode.

Meteorological data comes from **INMET**, consumed through a shared `SearchService` contract so the UI is independent of the provider.

Locations are resolved through:

- **IBGE Localidades**, municipality name search and IBGE municipality codes;
- **Nominatim (OpenStreetMap)**, reverse geocoding of device coordinates to a Brazilian municipality.

The weather provider is selected once at the composition boundary via the `VITE_WEATHER_PROVIDER` environment variable.

## Installation

Prerequisites: Node.js `^20.19.0 || >=22.12.0` (required by Vite, `@vitejs/plugin-react`, and oxlint) and npm.

```bash
# 1. Install dependencies
npm install

# 2. Configure the environment (optional; defaults to "inmet")
cp .env.example .env.local
```

`VITE_WEATHER_PROVIDER` selects the weather backend:

- `inmet`, implemented (default);
- `open-meteo`, reserved for the Open-Meteo adapter (_not yet implemented_);

`.env.local` is git-ignored.

### Scripts

```bash
npm run dev       # start the Vite dev server
npm run build     # typecheck (tsc -b) and build for production
npm run preview   # preview the production build
npm run lint      # run oxlint
```

## Technologies

- **React** 19 (`react`, `react-dom`)
- **TypeScript** ~6.0
- **Vite** 8 (with `@vitejs/plugin-react`)
- **Tailwind CSS** 4 (via `@tailwindcss/vite`)
- **oxlint** for linting
- **npm** for dependency management

External services: INMET (`apiprevmet3.inmet.gov.br`), IBGE Localidades, and Nominatim (OpenStreetMap).

## Functional Requirements

### Location

- Search Brazilian municipalities by name (minimum 2 characters) using the IBGE Localidades dataset; results show municipality name, state, and IBGE code.
- Determine the current municipality from device coordinates, with explicit browser permission, by reverse geocoding through Nominatim and matching the result to an IBGE municipality. Only locations within Brazil are accepted.
- Select exactly one municipality at a time; selecting a new one replaces the previous selection.

### Weather

- Load meteorological data from INMET using the selected municipality's IBGE code.
- Display **current conditions** for the selected municipality: minimum temperature, maximum temperature, apparent (feels-like) temperature, wind, relative humidity, atmospheric pressure, weather summary, sunrise, sunset, and current season. Current conditions reflect the INMET forecast period (morning/afternoon/evening) matching the time of the request.
- Display a **five-day forecast** (the current day plus the next four), with per day: minimum temperature, maximum temperature, wind, relative humidity, general conditions, sunrise, and sunset.
- Normalize both INMET response shapes, period-based objects (`manha`/`tarde`/`noite`) and single daily objects, into provider-independent application types before they reach the UI.
- Values not supplied by INMET (apparent temperature, numeric wind speed, atmospheric pressure, and a single relative-humidity value) are shown as unavailable (`—`) and are never fabricated; relative humidity is presented as a min–max range.

### Provider abstraction

- Expose weather and location operations through a shared `SearchService` contract; the React UI must not depend on INMET-specific response formats.
- Select the active provider once, via `VITE_WEATHER_PROVIDER` (`inmet` is implemented; `open-meteo` is a stub, `[functional requirements to be defined]`).

### Interface

- Provide loading, error (with retry), and empty states.
- Provide a high-contrast dark mode with semantic markup, keyboard accessibility, and readable contrast.
