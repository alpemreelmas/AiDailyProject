import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { RolesService } from 'src/roles/roles.service';
import { RolesModule } from 'src/roles/roles.module';
import { UserModule } from 'src/users/user.module';
import { UserService } from 'src/users/user.service';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports:[
    RolesModule,
    UserModule,
    NotificationModule,
  ],
  providers: [DashboardService, RolesService, UserService, NotificationService],
  controllers: [DashboardController]
})
export class DashboardModule {}
