/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** e.g. `http://localhost:3000/api` — must match Nest `APP_PREFIX`. */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
