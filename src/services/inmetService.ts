import type { SearchService } from "./searchService";
import type { Location } from "../types/location";
import type { DailyForecast, WeatherData } from "../types/weather";

const INMET_API_URL = "https://apiprevmet3.inmet.gov.br/previsao/";

interface InmetPeriod {
  temp_min?: number | string | null;
  temp_max?: number | string | null;
  dir_vento?: string | null;
  int_vento?: string | null;
  umidade_min?: number | string | null;
  umidade_max?: number | string | null;
  tempo?: string | null;
  resumo?: string | null;
  nascer?: string | null;
  ocaso?: string | null;
}

interface InmetDay extends InmetPeriod {
  manha?: InmetPeriod;
  tarde?: InmetPeriod;
  noite?: InmetPeriod;
}

type InmetResponse = Record<string, Record<string, InmetDay>>;

function toNumber(value: number | string | null | undefined): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== "string" || value.trim() === "") {
    return null;
  }

  const result = Number(value.replace(",", "."));

  return Number.isFinite(result) ? result : null;
}

function toIsoDate(value: string): string | null {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);

  if (!match) {
    return null;
  }

  const [, day, month, year] = match;

  return `${year}-${month}-${day}`;
}

function localDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function numericValues(
  periods: InmetPeriod[],
  select: (period: InmetPeriod) => number | string | null | undefined,
): number[] {
  return periods
    .map((period) => toNumber(select(period)))
    .filter((value): value is number => value !== null);
}

function minValue(
  periods: InmetPeriod[],
  select: (period: InmetPeriod) => number | string | null | undefined,
): number | null {
  const values = numericValues(periods, select);

  return values.length > 0 ? Math.min(...values) : null;
}

function maxValue(
  periods: InmetPeriod[],
  select: (period: InmetPeriod) => number | string | null | undefined,
): number | null {
  const values = numericValues(periods, select);

  return values.length > 0 ? Math.max(...values) : null;
}

function firstText(
  periods: InmetPeriod[],
  select: (period: InmetPeriod) => string | null | undefined,
): string | null {
  for (const period of periods) {
    const value = select(period)?.trim();

    if (value) {
      return value;
    }
  }

  return null;
}

export class InmetService implements SearchService {
  async getWeather(location: Location): Promise<WeatherData> {
    if (!location.ibgeCode) {
      throw new Error("An IBGE municipality code is required for INMET");
    }

    const response = await fetch(INMET_API_URL + location.ibgeCode);

    if (!response.ok) {
      throw new Error(`INMET request failed: ${response.status}`);
    }

    const data = (await response.json()) as InmetResponse;
    const municipalityForecast = data[location.ibgeCode];

    if (!municipalityForecast) {
      throw new Error("INMET returned no forecast for this municipality");
    }

    const today = localDate();

    const dates = Object.keys(municipalityForecast)
      .map((rawDate) => ({
        rawDate,
        date: toIsoDate(rawDate),
      }))
      .filter(
        (item): item is { rawDate: string; date: string } =>
          item.date !== null && item.date >= today,
      )
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5);

    const forecast: DailyForecast[] = dates.map(({ rawDate, date }) => {
      const day = municipalityForecast[rawDate];

      const periods = [day.manha, day.tarde, day.noite].filter(
        (period): period is InmetPeriod => period !== undefined,
      );

      const isPeriodBased = periods.length > 0;
      const records = isPeriodBased ? periods : [day];

      const descriptions = [
        ...new Set(
          records
            .map((period) => period.resumo?.trim() || period.tempo?.trim())
            .filter((value): value is string => Boolean(value)),
        ),
      ];

      return {
        date,
        minTemperatureC: minValue(records, (period) => period.temp_min),
        maxTemperatureC: maxValue(records, (period) => period.temp_max),
        windSpeedKmh: null,
        windSpeedDescription: firstText(records, (period) => period.int_vento),
        windDirection: firstText(records, (period) => period.dir_vento),
        minRelativeHumidityPercent: minValue(
          records,
          (period) => period.umidade_min,
        ),
        maxRelativeHumidityPercent: maxValue(
          records,
          (period) => period.umidade_max,
        ),
        description: descriptions.length > 0 ? descriptions.join("; ") : null,
        sunrise: firstText(records, (period) => period.nascer),
        sunset: firstText(records, (period) => period.ocaso),
      };
    });

    return {
      current: null,
      forecast,
    };
  }
}
