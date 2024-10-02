import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP'); // Logger with context 'HTTP'

  use(request: Request, response: Response, next: NextFunction): void {
    const startTime = Date.now();
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const endTime = Date.now();
      const processTime = endTime - startTime;
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      this.logger.log(
        `${method} ${originalUrl} Query: ${JSON.stringify(request.query)} ${statusCode} ${contentLength} - ${userAgent} ${ip}\nProcess Time: ${processTime}ms`,
      );
    });

    next();
  }
}
