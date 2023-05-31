import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;
  @IsString()
  @MaxLength(50)
  @MinLength(8)
  @IsNotEmpty()
  public password: string;
}
