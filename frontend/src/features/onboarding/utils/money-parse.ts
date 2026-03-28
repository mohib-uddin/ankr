/** Parses currency-like user input to a finite number, or null if empty / invalid. */
export function parseMoneyInput(raw: string): number | null {
  const t = raw.trim();
  if (t === '') return null;
  const normalized = t.replace(/[$,\s]/g, '');
  const n = Number.parseFloat(normalized);
  return Number.isFinite(n) ? n : null;
}

export function parsePercentInput(raw: string): number | null {
  const t = raw.trim().replace(/%/g, '');
  if (t === '') return null;
  const n = Number.parseFloat(t);
  return Number.isFinite(n) ? n : null;
}
