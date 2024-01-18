import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger();
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const { originalUrl, method, ip } = context.switchToHttp().getRequest();
    const userAgent =
      context.switchToHttp().getRequest().get('user-agent') || '';
    const { statusCode } = context.switchToHttp().getResponse();

    return next.handle().pipe(
      tap(() => {
        if (
          statusCode === 401 ||
          statusCode === 404 ||
          statusCode === 405 ||
          statusCode === 403
        ) {
          console.log(context.switchToHttp().getResponse());
          this.logger.warn(
            `[${method}] ${originalUrl} ${statusCode} - User-Agent:${userAgent} Request-Ip: ${ip} - ${
              Date.now() - now
            }ms`,
          );
        } else if (statusCode < 500) {
          this.logger.log(
            `[${method}] ${originalUrl} ${statusCode} - User-Agent:${userAgent} Request-Ip: ${ip} - ${
              Date.now() - now
            }ms`,
          );
        }
      }),
    );
  }
}
