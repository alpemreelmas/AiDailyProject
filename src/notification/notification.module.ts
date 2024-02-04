import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ConfigModule } from '@nestjs/config';
import { NotificationFactory } from './factories/notificationFactory';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule,
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  controllers: [],
  providers: [NotificationService, NotificationFactory],
  exports: [NotificationFactory],
})
export class NotificationModule {}
