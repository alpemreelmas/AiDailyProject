import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { NotificationService } from './notification/notification.service';
import { RedisService } from './redis.service';
import { join } from 'path';
import * as Bull from 'bull';
import { InjectQueue } from '@nestjs/bull';

@ApiBearerAuth()
@Controller()
export class AppController {
  private user;
  constructor(
    private redisService: RedisService,
    @InjectQueue('email') private emailQueue,
  ) {
    this.user = {
      email: 'elmasalpemre@gmail.com',
      name: 'Alp Emre Elmas,',
    };
  }

  @Get()
  @UseGuards(AuthGuard)
  getHello(): string {
    return 'ok';
  }

  @Get('/test')
  getHi() {
    return this.emailQueue.add('sendEmail', {
      to: this.user.email,
      subject: 'New device logged in with your account.',
      template: join(
        __dirname,
        '/assets/email/templates',
        'notifications/newLoggedInNotification.ejs',
      ),
      context: {
        user: this.user.name,
      },
    });
  }

  @Get('redis-status')
  async getRedisStatus(): Promise<{ connected: boolean }> {
    return { connected: await this.redisService.isConnected() };
  }
}
