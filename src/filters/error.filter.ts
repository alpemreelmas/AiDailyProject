import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger;
  constructor() {
    this.logger = new Logger();
  }
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let status;
    let exceptionMessage;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      exceptionMessage = exception.getResponse().hasOwnProperty('message') ? exception.getResponse().message : exception.message;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      exceptionMessage = 'Something went wrong.';
      this.logger.error(`[${ctx.getRequest().method}] ${ctx.getRequest().originalUrl} ${status} - User-Agent:${ctx.getRequest().get('user-agent')} Request-Ip: ${ctx.getRequest().ip} stack:[${exception}]`);
    }
    response.status(status).json({
      is_error: true,
      message: exceptionMessage,
      status_code: status,
    });
  }
}
