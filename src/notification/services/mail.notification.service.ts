import { Injectable } from '@nestjs/common';
import { INotificationService } from '../types/notificationService.interface';

@Injectable()
export class MailNotificationService implements INotificationService {
  async sendNotification() {
    console.log('mail notification');
  }
}
