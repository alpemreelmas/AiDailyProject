import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../users/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthToken, AuthTokenSchema } from './entities/auth_token.schema';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { EmailService } from '../email/email.service';
import { EmailModule } from '../email/email.module';
import { BullModule } from '@nestjs/bull';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationModule } from 'src/notification/notification.module';
import { RolesService } from 'src/users/services/roles.service';
import { ResetPasswordSchema } from './entities/reset-password.schema';
import { ResetPasswordController } from './controllers/reset-password.controller';
import { ResetPasswordService } from './services/reset-password.service';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: AuthToken.name, schema: AuthTokenSchema },
    ]),
    MongooseModule.forFeature([
      { name: 'ResetPassword', schema: ResetPasswordSchema },
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '30m' },
    }),
    EmailModule,
    BullModule.registerQueue({ name: 'email' }),
    NotificationModule,
  ],
  controllers: [AuthController, ResetPasswordController],
  providers: [
    AuthService,
    EmailService,
    NotificationService,
    RolesService,
    ResetPasswordService,
  ],
  exports: [MongooseModule, RolesService, AuthService],
})
export class AuthModule {}
