import { Injectable } from '@nestjs/common';
import { INotificationService } from '../types/notificationService.interface';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class NotificationFactory {
  private notificationServices = new Map();
  private notificationChannelServices = new Map();
  constructor(private configService: ConfigService) {
    const serviceTypeArray = this.configService
      .get('notification.default')
      .split('|');
    serviceTypeArray.forEach((serviceType) => {
      const factory = this.configService.get(
        `notification.${serviceType}.factory`,
      );
      this.notificationServices.set(serviceType, new factory());
    });
  }

  public getInstances() {
    return this.notificationServices;
  }

  public getChannelInstances(channels: Array<string>) {
    channels.forEach((channel) => {
      const factory = this.configService.get(`notification.${channel}.factory`);
      if (!this.notificationChannelServices.get(factory)) {
        const factory = this.configService.get(
          `notification.${channel}.factory`,
        );
        const factoryInstance = new factory();
        this.notificationChannelServices.set(channel, factoryInstance);
      }
    });
    return this.notificationChannelServices;
  }
}
