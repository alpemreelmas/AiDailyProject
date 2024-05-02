import { INotifiable } from '../types/notifiable.interface';
import { User } from 'src/users/entities/user.schema';
import { join } from 'path';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class verificationNotification implements INotifiable {
  constructor(public user: User, private emailQueue?) {
    this.user = user;
  }

  toMail() {
    this.emailQueue.add('sendEmail', {
      to: this.user.email,
      subject: 'Verification mail',
      template: join(
        __dirname,
        '../../assets/email/templates',
        'notifications/emailVerificationNotification.ejs',
      ),
      context: {
        user: this.user.name,
        verificationLink:
          process.env.SITE_URL +
          `auth/verify?token=${this.user.verificationToken}`,
      },
    });
  }
}
