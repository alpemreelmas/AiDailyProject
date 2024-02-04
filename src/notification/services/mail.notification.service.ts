import { Injectable } from '@nestjs/common';
import { INotificationService } from '../types/notificationService.interface';
import { INotifiable } from '../types/notifiable.interface';

@Injectable()
export class MailNotificationService implements INotificationService {
  sendNotification(notifiable: INotifiable) {
    notifiable.toMail();
    console.log('mail notification');
  }
}
