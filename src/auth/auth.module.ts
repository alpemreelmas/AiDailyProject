import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: AuthToken.name, schema: AuthTokenSchema },
    ]),
    MongooseModule.forFeature([{ name: 'ResetPassword', schema: ResetPasswordSchema }]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '30m' },
    }),
    EmailModule,
    BullModule.registerQueue({ name: 'email' }),
    NotificationModule,
    
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService, NotificationService, RolesService],
  exports: [MongooseModule, RolesService],
})
export class AuthModule {}
