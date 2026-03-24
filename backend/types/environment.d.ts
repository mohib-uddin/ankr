declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Application
      ENVIRONMENT: 'development' | 'production';
      PORT: string;

      DB_HOST: string;
      DB_PORT: string;
      DB_USER: string;
      DB_PASS: string;
      DB_NAME: string;

      APP_NAME: string;
      APP_TIMEZONE: string;
      AT_KEY: string;
      AT_EXPIRY: string;

      APP_PREFIX: string;
      DOCS_PREFIX: string;

      // Mail
      EMAIL_HOST: string;
      EMAIL_PORT: string;
      EMAIL_USER: string;
      EMAIL_PASS: string;

      // Storage
      STORAGE_PROVIDER: string;
      STORAGE_PATH: string;

    }
  }
}

export {};
