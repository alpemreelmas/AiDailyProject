import { INotifiable } from '../types/notifiable.interface';
import { User } from 'src/users/entities/user.schema';
import { join } from 'path';
import { Injectable } from '@nestjs/common';
import * as Bull from 'bull';
import { CustomNotificationSenderDto } from 'src/dashboard/dto/customNotificationSender.dto';

@Injectable()
export class customNotification implements INotifiable {
  private emailQueue: Bull.Queue;
  public notificationParams: CustomNotificationSenderDto;
  private users: User[];
  constructor(notificationParams: CustomNotificationSenderDto, users: User[]) {
    this.emailQueue = new Bull('email');
    this.notificationParams = notificationParams;
    this.users = users;
  }

  toMail() {
    this.users.forEach(user => {
      this.emailQueue.add('sendEmail', {
        to: user.email,
        subject: this.notificationParams.subject,
        template: join(__dirname, '../../email/templates' , 'notifications/customNotification.ejs'),
        context: {
          user: user.name,
          title: this.notificationParams.title,
          content: this.notificationParams.content,
        },
      });  
    });
    
  }
}
