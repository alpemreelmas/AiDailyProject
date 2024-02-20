import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
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

@ApiTags('Auth')
@Controller('dashboard')
@UseGuards(AuthGuard)
@RequiredRole('admin')
export class DashboardController {
    constructor(private DashboardService: DashboardService) {}

    @Get()
    getDashboard(): string {
      return 'Dashboard content';
    }

    @Post('/custom-notification')
    customNotificationSender(@Body() customNotificationSenderDto: CustomNotificationSenderDto){
        return this.DashboardService.customNotification(customNotificationSenderDto)
    }
}
