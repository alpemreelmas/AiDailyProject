import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
export class CreateUserDto {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  public name: string;
  @IsEmail()
  @IsNotEmpty()
  public email: string;
  @IsString()
  @MaxLength(50)
  @MinLength(8)
  @IsNotEmpty()
  public password: string;
}
