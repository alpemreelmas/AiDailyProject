import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @MaxLength(50)
  @MinLength(8)
  @IsNotEmpty()
  public newPassword: string;
}
