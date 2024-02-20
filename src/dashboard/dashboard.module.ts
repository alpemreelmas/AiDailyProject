import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { RolesService } from 'src/roles/roles.service';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports:[
    RolesModule
  ],
  providers: [DashboardService, RolesService],
  controllers: [DashboardController]
})
export class DashboardModule {}
