import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { NotificationService } from './notification/notification.service';

@ApiBearerAuth()
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private notificationService: NotificationService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  getHello(): string {
    return 'ok';
  }

  @Get('/test')
  getHi(): string {
    return 'ok';
  }
}
