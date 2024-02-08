import { Module } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordController } from './reset-password.controller';
import { ResetPassword, ResetPasswordSchema} from './entities/reset-password.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../users/user.module';
import { EmailModule } from 'src/email/email.module';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationFactory } from 'src/notification/factories/notificationFactory';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    UserModule,
    EmailModule,
    MongooseModule.forFeature([{ name: 'ResetPassword', schema: ResetPasswordSchema }]),
    NotificationModule,
  ],
  controllers: [ResetPasswordController],
  providers: [ResetPasswordService, NotificationService]
})
export class ResetPasswordModule {}
