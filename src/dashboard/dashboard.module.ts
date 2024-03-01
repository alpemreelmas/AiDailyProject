import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { RolesService } from 'src/users/services/roles.service';
import { UserModule } from 'src/users/user.module';
import { UserService } from 'src/users/services/user.service';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationModule } from 'src/notification/notification.module';
import { DailyModule } from 'src/daily/daily.module';
import { DailyService } from 'src/daily/daily.service';

@Module({
  imports:[
    UserModule,
    NotificationModule,
  ],
  providers: [DashboardService, RolesService, UserService, NotificationService],
  controllers: [DashboardController]
})
export class DashboardModule {}
