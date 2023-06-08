import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger();

  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      const statusCode = res.statusCode;
      const { ip, method, originalUrl } = req;
      const userAgent = req.get('user-agent') || '';
      if (
        statusCode === 401 ||
        statusCode === 404 ||
        statusCode === 405 ||
        statusCode === 403
      ) {
        console.log(res);
        this.logger.warn(
          `[${method}] ${originalUrl} ${statusCode} - User-Agent:${userAgent} Request-Ip: ${ip}`,
        );
      } else if (statusCode < 500) {
        const contentLength = res.get('content-length');
        this.logger.log(
          `[${method}] ${originalUrl} ${statusCode} Content-Length:${contentLength} - User-Agent:${userAgent} Request-Ip: ${ip}`,
        );
      }
    });

    next();
  }
}
