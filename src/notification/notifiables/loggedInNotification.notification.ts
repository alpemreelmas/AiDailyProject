import { INotifiable } from '../types/notifiable.interface';
import { User } from 'src/users/entities/user.schema';
import { join } from 'path';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggedInNotification implements INotifiable {
  constructor(public user: User, private emailQueue?) {}

  toMail() {
    this.emailQueue.add('sendEmail', {
      to: this.user.email,
      subject: 'New device logged in with your account.',
      template: join(
        __dirname,
        '../../assets/email/templates',
        'notifications/newLoggedInNotification.ejs',
      ),
      context: {
        user: this.user.name,
      },
    });
  }
}
