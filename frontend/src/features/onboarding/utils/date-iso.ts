/** Backend `@IsDateString()` / ISO 8601 — store UI value as `YYYY-MM-DD`, send midnight UTC. */
export function ymdToIso8601UtcMidnight(ymd: string): string | null {
  const t = ymd.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t)) return null;
  const [y, m, d] = t.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null;
  return `${t}T00:00:00.000Z`;
}
