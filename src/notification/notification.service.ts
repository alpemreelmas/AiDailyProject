import { Injectable } from '@nestjs/common';
import { INotificationService } from './types/notificationService.interface';
import { NotificationFactory } from './factories/notificationFactory';
import { ConfigService } from '@nestjs/config';
import { INotifiable } from './types/notifiable.interface';

@Injectable()
export class NotificationService {
  public notificationServices: Map<string, INotificationService>;
  public channels: Map<string, INotificationService>;
  constructor(private notificationFactory: NotificationFactory) {
    this.notificationServices = this.notificationFactory.getInstances();
  }

  sendNotification(notifiable: INotifiable) {
    if (this.channels?.size > 0) {
      this.channels.forEach((notificationService) => {
        notificationService.sendNotification(notifiable);
      });
    } else {
      this.notificationServices.forEach((notificationService) => {
        notificationService.sendNotification(notifiable);
      });
    }
    this.channels = new Map();
  }

  channel(channels: string | Array<string>) {
    const channelsArray = Array.isArray(channels)
      ? channels
      : channels.split('|');
    this.channels = this.notificationFactory.getChannelInstances(channelsArray);
    this.notificationFactory.setChannelInstances();
    return this;
  }
}
