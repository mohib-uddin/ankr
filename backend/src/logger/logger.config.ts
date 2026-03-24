export interface LoggerConfig {
  level: string;
  colorize: boolean;
  includeRequestBody: boolean;
  sanitizeSensitiveData: boolean;
  timestampFormat: string;
  maxBodyLength: number;
  fileRotation: {
    maxSize: string;
    maxFiles: string;
  };
}

export const defaultLoggerConfig: LoggerConfig = {
  level: process.env.LOG_LEVEL || 'info',
  colorize: process.env.NODE_ENV !== 'production',
  includeRequestBody: process.env.LOG_REQUEST_BODY !== 'false',
  sanitizeSensitiveData: true,
  timestampFormat: 'YYYY-MM-DD HH:mm:ss',
  maxBodyLength: 1000,
  fileRotation: {
    maxSize: '20m',
    maxFiles: '14d',
  },
};

export const logColors = {
  info: '\x1b[32m',    // Green
  warn: '\x1b[33m',    // Yellow
  error: '\x1b[31m',   // Red
  debug: '\x1b[36m',   // Cyan
  verbose: '\x1b[35m', // Magenta
  reset: '\x1b[0m',    // Reset
  bold: '\x1b[1m',     // Bold
  dim: '\x1b[2m',      // Dim
  blue: '\x1b[34m',    // Blue
  magenta: '\x1b[35m', // Magenta
  white: '\x1b[37m',   // White
};

export const sensitiveFields = [
  'password',
  'token',
  'secret',
  'key',
  'authorization',
  'auth',
  'apiKey',
  'api_key',
  'accessToken',
  'access_token',
  'refreshToken',
  'refresh_token',
  'privateKey',
  'private_key',
  'publicKey',
  'public_key',
  'sessionId',
  'session_id',
  'clientSecret',
  'client_secret',
];

export function getStatusColor(statusCode: number): string {
  if (statusCode >= 500) return logColors.error;
  if (statusCode >= 400) return logColors.warn;
  if (statusCode >= 300) return logColors.blue;
  return logColors.info;
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}