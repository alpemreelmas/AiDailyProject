import { Injectable } from '@nestjs/common';
import { INotificationService } from './INotificationService';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class NotificationFactory {
  private notificationService: INotificationService;
  constructor(private configService: ConfigService) {}

  public getInstance(): INotificationService {
    if (!this.notificationService) {
      const serviceType = this.configService.get('notification.default');
      const factory = this.configService.get(
        `notification.${serviceType}.factory`,
      );
      console.log(factory);
      this.notificationService = new factory();
    }
    return this.notificationService;
  }
}
