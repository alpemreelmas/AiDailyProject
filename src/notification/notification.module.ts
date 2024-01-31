import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ConfigModule } from '@nestjs/config';
import { NotificationFactory } from './notificationFactory';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [NotificationService, NotificationFactory],
  exports: [NotificationFactory],
})
export class NotificationModule {}
