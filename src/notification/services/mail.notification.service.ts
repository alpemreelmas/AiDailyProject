import { Injectable } from '@nestjs/common';
import { INotificationService } from '../INotificationService';

@Injectable()
export class MailNotificationService implements INotificationService {
  async sendNotification() {
    console.log('mail notification');
  }
}
