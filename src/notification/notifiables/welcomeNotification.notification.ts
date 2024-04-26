import { INotifiable } from '../types/notifiable.interface';
import { User } from 'src/users/entities/user.schema';
import { join } from 'path';
import { Injectable } from '@nestjs/common';
import * as Bull from 'bull';

@Injectable()
export class welcomeNotification implements INotifiable {
  private emailQueue: Bull.Queue;
  constructor(public user: User) {
    this.emailQueue = new Bull('email');
    this.user = user;
  }

  toMail() {
    this.emailQueue.add('sendEmail', {
      to: this.user.email,
      subject: 'Welcome to AiDaily',
      template: join(__dirname, '../../email/templates' , 'notifications/welcomeNotification.ejs'),
      context: {
        user: this.user.name,
      },
    });
  }
}