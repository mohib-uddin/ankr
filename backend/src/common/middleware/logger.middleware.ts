import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly morganMiddleware: any;

  constructor(private readonly logger: LoggerService) {
    // Custom Morgan token for request body logging
    morgan.token('body', (req: Request) => {
      if (req.body && Object.keys(req.body).length > 0) {
        const redacted = { ...req.body };
        if (redacted.password) redacted.password = '[REDACTED]';
        return JSON.stringify(redacted, null, 2);
      }
      return '';
    });

    // Custom Morgan token for response body logging
    morgan.token('resBody', (req: any) => {
      return req.resBody ? JSON.stringify(req.resBody, null, 2) : '';
    });

    // Define pretty log format
    const format = (tokens, req: any, res: Response) => {
      const status = tokens.status(req, res);
      const method = tokens.method(req, res);
      const url = tokens.url(req, res);
      const responseTime = tokens['response-time'](req, res);
      const contentLength = tokens.res(req, res, 'content-length') || '0';
      const ip = req.ip || req.connection.remoteAddress;
      const ua = req.headers['user-agent'] || 'N/A';
      const body = tokens.body(req, res);
      const resBody = tokens.resBody(req, res);

      return (
        `${new Date().toISOString()} INFO   [HTTP]\n` +
        `  ➤ ${method}   ${url}\n` +
        `  ◈ Status: ${status} | Time: ${responseTime}ms | Size: ${contentLength} B\n` +
        `  ◉ IP: ${ip} | UA: ${ua}\n` +
        (body ? `  ◑ Body:\n    ${body}\n` : '') +
        (resBody ? `  ✔ Response:\n    ${resBody}\n` : '') +
        `  ────────────────────────────────────────────────────────────────────────────────`
      );
    };

    // Wrap Morgan with Winston
    this.morganMiddleware = morgan(format, {
      stream: {
        write: (message: string) => this.logger.log(message.trim()),
      },
    });
  }

  use(req: any, res: Response, next: NextFunction) {
    const rawResponse = res.send;
    res.send = (body: any) => {
      res.send = rawResponse;
      try {
        req.resBody = typeof body === 'string' ? JSON.parse(body) : body;
      } catch (err) {
        req.resBody = body;
      }
      return res.send(body);
    };

    this.morganMiddleware(req, res, next);
  }
}
