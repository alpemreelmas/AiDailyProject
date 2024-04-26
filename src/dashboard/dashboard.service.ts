import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomNotificationSenderDto } from './dto/customNotificationSender.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/entities/user.schema';
import { NotificationService } from 'src/notification/notification.service';
import { UserService } from 'src/users/services/user.service';
import { customNotification } from 'src/notification/notifiables/customNotification.notification';
import { RolesService } from 'src/users/services/roles.service';
import { UpdateUserInfoDto } from './dto/updateUserInfo.dto';
import { Roles, rolesDocument } from 'src/users/entities/roles.schema';
import {
  UserAndRoles,
  userAndRolesDocument,
} from 'src/users/entities/userRoles';
import { Daily, DailyDocument } from 'src/daily/entities/daily.entity';
import { DailyService } from 'src/daily/daily.service';

@Injectable()
export class DashboardService {
  constructor(
    private rolesService: RolesService,
    @InjectModel(Roles.name)
    private RolesModel: Model<rolesDocument>,

    /*private dailyService: DailyService,
        @InjectModel(Daily.name)
        private DailyModel: Model<DailyDocument>,*/

    @InjectModel(UserAndRoles.name)
    private UserAndRolesModel: Model<userAndRolesDocument>,

    private userService: UserService,
    @InjectModel(User.name)
    private UserModel: Model<UserDocument>,

    private notificationService: NotificationService,
  ) {}
  async customNotification(
    customNotificationSenderDto: CustomNotificationSenderDto,
  ) {
    const users = await this.userService.findAll();

    this.notificationService.sendNotification(
      new customNotification(customNotificationSenderDto, users),
    );
  }

  async listUsers() {
    return await this.userService.findAllWithRoles();
  }

  async getUserInfo(id: string) {
    const user = await this.userService.findByIdWithRole(id);

    return user;
  }

  async updateUserInfo(id: string, UpdateUserInfoDto: UpdateUserInfoDto) {
    const user = await this.userService.findById(id);

    if (!user) return new NotFoundException("We couldn't find user.");

    await this.rolesService.removeUserRoles(id);

    const roles = UpdateUserInfoDto.role;

    for (const roleId of roles) {
      const role = await this.rolesService.findById(roleId);
      if (!role) {
        throw new NotFoundException('Role not found');
      }

      await this.UserAndRolesModel.create({
        userId: user._id,
        roleId: role._id,
      });
    }

    await this.UserModel.findByIdAndUpdate(id, {
      name: UpdateUserInfoDto.name,
      emailVerifiedAt: UpdateUserInfoDto.emailVerifiedAt,
    });
  }
}
