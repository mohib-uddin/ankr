function resolveApiBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  if (typeof window !== 'undefined') return `${window.location.origin}/api`;
  return '/api';
}

export function getFileUrl(filePath: string): string {
  if (!filePath) return '';
  if (/^https?:\/\//i.test(filePath)) return filePath;

  const apiBase = resolveApiBaseUrl();
  const cleaned = filePath.replace(/^\/+/, '');

  // Already includes API media segment.
  if (cleaned.startsWith('api/media/')) {
    const origin = apiBase.replace(/\/api$/, '');
    return `${origin}/${cleaned}`;
  }

  // Already includes media segment without /api.
  if (cleaned.startsWith('media/')) {
    return `${apiBase}/${cleaned}`;
  }

  // Backend stores local uploads as plain filenames.
  return `${apiBase}/media/${cleaned}`;
}
