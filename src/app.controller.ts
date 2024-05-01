import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { NotificationService } from './notification/notification.service';
import { RedisService } from './redis.service';

@ApiBearerAuth()
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private notificationService: NotificationService,
    private readonly redisService: RedisService,
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

  @Get('redis-status')
  async getRedisStatus(): Promise<{ connected: boolean }> {
    return { connected: await this.redisService.isConnected() };
  }
}
