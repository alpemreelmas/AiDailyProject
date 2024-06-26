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
import { LoginDto } from '../dto/login.dto';
import { AuthService } from '../services/auth.service';
import { RefreshTokenDto } from '../dto/refresh_token.dto';
import { RegisterDto } from '../dto/register.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateProfileDto } from '../dto/updateProfile.dto';
import { AuthGuard } from '../guards/auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private AuthService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.AuthService.login(loginDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/register')
  register(@Body() registerDto: RegisterDto) {
    return this.AuthService.register(registerDto);
  }

  @Get('/verify')
  async verifyEmail(@Query('token') verificationToken: string, @Res() res) {
    await this.AuthService.verifyEmail(verificationToken);
    return res.redirect('/verified');
  }

  @Post('/resend-verification')
  async resendVerificationEmail(@Body('email') email: string) {
    return this.AuthService.resendVerificationEmail(email);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/refresh-token')
  refresh_token(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.AuthService.generateToken(refreshTokenDto);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/profile')
  profile(@Req() req) {
    return this.AuthService.getProfile(req.user.sub);
  }
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/profile')
  profilePost(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.AuthService.updateProfile(updateProfileDto, req.user.sub);
  }
}
