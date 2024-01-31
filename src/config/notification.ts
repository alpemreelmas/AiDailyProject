import { registerAs } from '@nestjs/config';
import { FirebaseNotificationService } from 'src/notification/services/firebase.notification.service';
import { MailNotificationService } from 'src/notification/services/mail.notification.service';

export default registerAs('notification', () => ({
  default: process.env.NOTIFICATION_CHANNEL || 'mail',
  mail: {
    smtp: {
      transport: 'smtp',
      host: process.env.MAIL_HOST || 'smtp.mailgun.org',
      port: Number(process.env.MAIL_PORT) || 587,
      secure: process.env.MAIL_SECURE || false,
      username: process.env.MAIL_USERNAME,
      password: process.env.MAIL_PASSWORD,
      timeout: undefined,
      local_domain: process.env.MAIL_DEFAULT_FROM || 'http://localhost.com',
    },
    factory: MailNotificationService,
  },
  firebase: {
    factory: FirebaseNotificationService,
  },
}));
