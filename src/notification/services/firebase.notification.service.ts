import { Injectable } from '@nestjs/common';
import { INotificationService } from '../INotificationService';

@Injectable()
export class FirebaseNotificationService implements INotificationService {
  async sendNotification() {
    console.log('firebase notification');
  }
}
