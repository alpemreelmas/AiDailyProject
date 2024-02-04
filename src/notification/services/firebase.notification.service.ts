import { Injectable } from '@nestjs/common';
import { INotificationService } from '../types/notificationService.interface';

@Injectable()
export class FirebaseNotificationService implements INotificationService {
  async sendNotification(notifiable) {
    notifiable.toFirebase();
  }
}
