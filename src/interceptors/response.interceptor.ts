import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor {
  intercept(context, next) {
    return next.handle().pipe(
      map((data) => ({
        is_error: false,
        status_code: context.switchToHttp().getResponse().statusCode,
        data: data,
      })),
    );
  }
}
