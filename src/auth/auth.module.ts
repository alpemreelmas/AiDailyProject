import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../users/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthToken, AuthTokenSchema } from './entities/auth_token.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailService } from '../email/email.service';
import { EmailModule } from '../email/email.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: AuthToken.name, schema: AuthTokenSchema },
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '30m' },
    }),
    EmailModule,
    BullModule.registerQueue({ name: 'email' }),
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService],
  exports: [MongooseModule],
})
export class AuthModule {}
