export function shortTemp(value: number | null): string {
  return value === null ? "—" : `${Math.round(value)}°`;
}
