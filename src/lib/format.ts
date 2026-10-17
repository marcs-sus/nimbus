export function formatTemperature(value: number | null): string {
  return value === null ? "—" : `${Math.round(value)} °C`;
}

export function formatDate(value: string): string {
  const date = new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatTime(value: string | null): string {
  if (!value) return "—";

  return value.includes("T")
    ? (value.split("T")[1]?.slice(0, 5) ?? value)
    : value;
}

export function formatWind(
  speedKmh: number | null,
  description: string | null,
  direction: string | null,
): string {
  const speed = speedKmh === null ? (description ?? "—") : `${speedKmh} km/h`;

  return direction ? `${speed} · ${direction}` : speed;
}

export function formatHumidityRange(
  min: number | null,
  max: number | null,
): string {
  if (min === null && max === null) return "—";

  return `${min ?? "—"}% – ${max ?? "—"}%`;
}

export function formatPressure(value: number | null): string {
  return value === null ? "—" : `${value} hPa`;
}
