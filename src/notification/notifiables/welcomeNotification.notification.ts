import { INotifiable } from '../types/notifiable.interface';
import { User } from 'src/users/entities/user.schema';
import { join } from 'path';
import { Injectable } from '@nestjs/common';
import * as Bull from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class welcomeNotification implements INotifiable {
  constructor(public user: User, private emailQueue?) {
    this.user = user;
  }

  toMail() {
    this.emailQueue.add('sendEmail', {
      to: this.user.email,
      subject: 'Welcome to AiDaily',
      template: join(
        __dirname,
        '../../assets/email/templates',
        'notifications/welcomeNotification.ejs',
      ),
      context: {
        user: this.user.name,
      },
    });
  }
}
