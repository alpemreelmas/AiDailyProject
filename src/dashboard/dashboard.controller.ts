import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequiredRole } from 'src/roles/requiredRole.decorator';

@ApiTags('Auth')
@Controller('dashboard')
export class DashboardController {
    @Get()
    @UseGuards(AuthGuard)
    @RequiredRole('admin')

    getDashboard(): string {
      return 'Dashboard content';
    }
}
