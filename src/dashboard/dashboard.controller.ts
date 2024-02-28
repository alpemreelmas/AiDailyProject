import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
    Req,
    Res,
    UseGuards,
  } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequiredRole } from 'src/roles/requiredRole.decorator';
import { CustomNotificationSenderDto } from './dto/customNotificationSender.dto';
import { DashboardService } from './dashboard.service';
import { UserService } from '../users/user.service';
import { UpdateUserInfoDto } from './dto/updateUserInfo.dto';
import { Types } from 'mongoose';

@ApiTags('Auth')
@Controller('dashboard')
@UseGuards(AuthGuard)

export class DashboardController {
    constructor(private DashboardService: DashboardService, private userService: UserService) {}

    @RequiredRole('admin')
    @Get()
    getDashboard(): string {
      return 'Dashboard content';
    }

    @RequiredRole('admin')
    @Post('/custom-notification')
    customNotificationSender(@Body() customNotificationSenderDto: CustomNotificationSenderDto){
        return this.DashboardService.customNotification(customNotificationSenderDto)
    }

    @RequiredRole('admin')
    @Get('/users')
    async listUsers(){
      return await this.DashboardService.listUsers();
    }

    @RequiredRole('admin')
    @Get('/user/:id')
    getUserInfo(@Param('id') id: string){
      return this.DashboardService.getUserInfo(id);
    }

    @RequiredRole('admin')
    @Post('/user/:id')
    updateUserInfo(@Param('id') id: Types.ObjectId, @Body() UpdateUserInfoDto: UpdateUserInfoDto ){
      return this.DashboardService.updateUserInfo(id, UpdateUserInfoDto);
    }
}
