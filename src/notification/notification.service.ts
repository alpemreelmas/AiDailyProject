import { Injectable } from '@nestjs/common';
import { INotificationService } from './INotificationService';
import { NotificationFactory } from './notificationFactory';

@Injectable()
export class NotificationService {
  public notificationService: INotificationService;
  constructor(private notificationFactory: NotificationFactory) {
    this.notificationService = this.notificationFactory.getInstance();
  }

  async sendNotification() {
    this.notificationService.sendNotification();
  }
}
