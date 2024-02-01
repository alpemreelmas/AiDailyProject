import { Injectable } from '@nestjs/common';
import { INotificationService } from './types/notificationService.interface';
import { NotificationFactory } from './notificationFactory';

@Injectable()
export class NotificationService {
  public notificationServices: INotificationService[];
  constructor(private notificationFactory: NotificationFactory) {
    this.notificationServices = this.notificationFactory.getInstance();
  }

  async sendNotification() {
    this.notificationServices.forEach((notificationService) => {
      notificationService.sendNotification();
    });
  }
}
