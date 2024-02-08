import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailProcessor } from './email.processor';
import { BullModule } from '@nestjs/bull';


@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get("REDIS_HOST"),
          port: configService.get("REDIS_PORT"),
        },
        }),
        inject: [ConfigService]
    }),
    BullModule.registerQueue({
      name: 'email',
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get("MAIL_HOST"),
          port: configService.get<Number>("MAIL_PORT"),
          secure: configService.get("MAIL_SECURE") == "false" ? false : true,
          auth: {
            user: configService.get("MAIL_USERNAME"),
            pass: configService.get("MAIL_PASSWORD"),
          },
        },
        defaults: {
          from: configService.get("MAIL_DEFAULT_FROM"),
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new EjsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService]
    }),
  ],
  providers: [EmailService, EmailProcessor],
  exports: [EmailService],
})
export class EmailModule {}
