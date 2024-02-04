import { INotifiable } from '../types/notifiable.interface';
import { User } from 'src/users/entities/user.schema';
import { join } from 'path';
import { Injectable } from '@nestjs/common';
import * as Bull from 'bull';

@Injectable()
export class LoggedInNotification implements INotifiable {
  private emailQueue: Bull.Queue;
  constructor(public user: User) {
    this.emailQueue = new Bull('email');
    this.user = user;
  }

  toMail() {
    this.emailQueue.add('sendEmail', {
      to: this.user.email,
      subject: 'New device logged in with your account.',
      template: join(
        __dirname,
        'templates',
        'notifications/newLoggedInNotification.ejs',
      ),
      context: {
        user: this.user.name,
      },
    });
  }
}
