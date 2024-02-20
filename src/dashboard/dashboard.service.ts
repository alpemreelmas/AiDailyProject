import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomNotificationSenderDto } from './dto/customNotificationSender.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/entities/user.schema';
import { NotificationService } from 'src/notification/notification.service';
import { UserService } from '../users/user.service';
import { customNotification } from 'src/notification/notifiables/customNotification.notification';

@Injectable()
export class DashboardService {
    constructor(
        private userService: UserService,
        @InjectModel(User.name)
        private UserModel: Model<UserDocument>,
        private notificationService: NotificationService,
      ) {}
    async customNotification(customNotificationSenderDto: CustomNotificationSenderDto){
        const users = await this.userService.findAll();

        this.notificationService.sendNotification(new customNotification(customNotificationSenderDto, users));
    }

}
