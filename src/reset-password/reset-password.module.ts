import { Module } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordController } from './reset-password.controller';
import { ResetPassword, ResetPasswordSchema} from './entities/reset-password.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../users/user.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    UserModule,
    EmailModule,
    MongooseModule.forFeature([{ name: 'ResetPassword', schema: ResetPasswordSchema }]),
  ],
  controllers: [ResetPasswordController],
  providers: [ResetPasswordService]
})
export class ResetPasswordModule {}
