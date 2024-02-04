import { INotifiable } from './notifiable.interface';

export interface INotificationService {
  sendNotification(notifiable: INotifiable): void;
}
