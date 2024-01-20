import { Body, Controller, Post, Query } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('resetPassword')
@Controller('reset-password')
export class ResetPasswordController {
  constructor(private resetPasswordService: ResetPasswordService) {}

  @Post()
  async requestPasswordReset(@Body('email') email: string)
  {
    return this.resetPasswordService.sendForgotPasswordEmail(email);
  }

  @Post('reset')
  async resetPassword(@Body('email') email:string, @Query('token') resetToken: string, @Body('newPassword') newPassword: string): Promise<void>
  {
    return this.resetPasswordService.resetPassword(email, resetToken, newPassword);
  }
}
