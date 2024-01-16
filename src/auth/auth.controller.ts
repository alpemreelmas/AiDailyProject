import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh_token.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

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

  @HttpCode(HttpStatus.OK)
  @Post('/refresh-token')
  refresh_token(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.AuthService.generateToken(refreshTokenDto);
  }
}
