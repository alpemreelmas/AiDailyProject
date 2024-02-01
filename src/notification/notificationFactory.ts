import { Injectable } from '@nestjs/common';
import { INotificationService } from './types/notificationService.interface';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class NotificationFactory {
  private notificationServices = [];
  constructor(private configService: ConfigService) {}

  public getInstance(): INotificationService[] {
    if (this.notificationServices.length <= 0) {
      const serviceTypeArray = this.configService
        .get('notification.default')
        .split('|');
      serviceTypeArray.forEach((serviceType) => {
        const factory = this.configService.get(
          `notification.${serviceType}.factory`,
        );
        this.notificationServices.push(new factory());
      });
    }
    console.log(this.notificationServices);
    return this.notificationServices;
  }
}
