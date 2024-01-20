import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { ApiTags } from '@nestjs/swagger';
import { ResetPasswordDto } from './dto/reset-password-token.dto';

@ApiTags('resetPassword')
@Controller('reset-password')
export class ResetPasswordController {
  constructor(private resetPasswordService: ResetPasswordService) {}

  @Post()
  async requestPasswordReset(@Body('email') email: string)
  {
    return this.resetPasswordService.sendForgotPasswordEmail(email);
  }

  @Get('reset')
  async checkToken(@Query('token') resetToken: string)
  {
    return this.resetPasswordService.checkToken(resetToken);
  }

  @Post('reset')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Query('token') resetToken: string)
  {
    return this.resetPasswordService.resetPassword(resetPasswordDto, resetToken);
  }
}
