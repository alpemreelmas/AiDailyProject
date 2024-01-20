import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { UserController } from './users/user.controller';
import { UserService } from './users/user.service';
import { EmailModule } from './email/email.module';
import { EmailService } from './email/email.service';
import { DailyModule } from './daily/daily.module';
import { BullModule } from '@nestjs/bull';
import { ResetPasswordModule } from './reset-password/reset-password.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    BullModule.registerQueue({ name: 'email' }),
    UserModule,
    AuthModule,
    EmailModule,
    DailyModule,
    ResetPasswordModule,
  ],
  controllers: [AppController, AuthController, UserController],
  providers: [AppService, AuthService, UserService, EmailService],
})
export class AppModule {
  /*  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }*/
}
