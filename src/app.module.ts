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
import { NotificationModule } from './notification/notification.module';
import { NotificationService } from './notification/notification.service';
import notificationConfig from './config/notification';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DashboardModule } from './dashboard/dashboard.module';
import { RolesModule } from './roles/roles.module';
import { RolesService } from './roles/roles.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [notificationConfig],
      envFilePath: '.env'
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 60,
    }]),
    BullModule.registerQueue({ name: 'email' }),
    UserModule,
    AuthModule,
    EmailModule,
    DailyModule,
    ResetPasswordModule,
    NotificationModule,
    DashboardModule,
    RolesModule,
  ],
  controllers: [AppController, AuthController, UserController],
  providers: [
    AppService,
    AuthService,
    UserService,
    EmailService,
    NotificationService,
    RolesService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  /*  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }*/
}
