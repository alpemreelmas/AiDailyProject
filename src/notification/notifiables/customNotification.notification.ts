import { INotifiable } from '../types/notifiable.interface';
import { User } from 'src/users/entities/user.schema';
import { join } from 'path';
import { Injectable } from '@nestjs/common';
import * as Bull from 'bull';
import { CustomNotificationSenderDto } from 'src/dashboard/dto/customNotificationSender.dto';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class customNotification implements INotifiable {
  public notificationParams: CustomNotificationSenderDto;
  private users: User[];
  constructor(
    notificationParams: CustomNotificationSenderDto,
    users: User[],
    private emailQueue?,
  ) {
    this.notificationParams = notificationParams;
    this.users = users;
  }

  toMail() {
    this.users.forEach((user) => {
      this.emailQueue.add('sendEmail', {
        to: user.email,
        subject: this.notificationParams.subject,
        template: join(
          __dirname,
          '../../assets/email/templates',
          'notifications/customNotification.ejs',
        ),
        context: {
          user: user.name,
          title: this.notificationParams.title,
          content: this.notificationParams.content,
        },
      });
    });
  }
}
