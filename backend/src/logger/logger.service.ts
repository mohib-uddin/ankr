import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger;

  constructor() {
    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ level, message, timestamp }) => {
          let msg = String(message);

          // Coloring rules
          msg = msg
            // HTTP Tag
            .replace(/\[HTTP\]/g, '\x1b[36m[HTTP]\x1b[0m') // cyan
            // Method (cyan)
            .replace(/➤ (POST|GET|PUT|DELETE|PATCH)/g, '\x1b[36m➤ $1\x1b[0m')
            // Status code coloring
            .replace(/Status: (\d{3})/g, (_, code) => {
              if (code.startsWith('2')) return `\x1b[32mStatus: ${code}\x1b[0m`; // green
              if (code.startsWith('4')) return `\x1b[33mStatus: ${code}\x1b[0m`; // yellow
              if (code.startsWith('5')) return `\x1b[31mStatus: ${code}\x1b[0m`; // red
              return `Status: ${code}`;
            })
            // Keys in white
            .replace(/◈ /g, '\x1b[37m◈ \x1b[0m')
            .replace(/◉ IP:/g, '\x1b[37m◉ IP:\x1b[0m')
            .replace(/UA:/g, '\x1b[37mUA:\x1b[0m')
            .replace(/Time:/g, '\x1b[37mTime:\x1b[0m')
            .replace(/Size:/g, '\x1b[37mSize:\x1b[0m')
            .replace(/◑ Body:/g, '\x1b[37m◑ Body:\x1b[0m')
            // Separator
            .replace(/─+/g, '\x1b[37m$&\x1b[0m');

          return `${timestamp} ${level}: ${msg}`;
        }),
      ),
      transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/app.log' }),
      ],
    });
  }

  log(message: any) {
    this.logger.info(String(message));
  }
  error(message: any, trace?: string) {
    this.logger.error(String(message) + (trace ? ` -> ${trace}` : ''));
  }
  warn(message: any) {
    this.logger.warn(String(message));
  }
  debug(message: any) {
    this.logger.debug(String(message));
  }
  verbose(message: any) {
    this.logger.verbose(String(message));
  }
}
