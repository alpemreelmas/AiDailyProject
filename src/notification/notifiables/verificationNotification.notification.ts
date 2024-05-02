import { INotifiable } from '../types/notifiable.interface';
import { User } from 'src/users/entities/user.schema';
import { join } from 'path';
import { Injectable } from '@nestjs/common';
import * as Bull from 'bull';

@Injectable()
export class verificationNotification implements INotifiable {
  private emailQueue: Bull.Queue;
  constructor(public user: User) {
    this.emailQueue = new Bull('email');
    this.user = user;
  }

  toMail() {
    this.emailQueue.add('sendEmail', {
      to: this.user.email,
      subject: 'Verification mail',
      template: join(
        __dirname,
        '/dist/assets/email/templates',
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
