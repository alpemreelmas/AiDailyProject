import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
export class CreateUserDto {
  @ApiProperty({
    example: 'mehmet'
  })
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  public name: string;
  @ApiProperty({
    example: 'example@gmail.com'
  })
  @IsEmail()
  @IsNotEmpty()
  public email: string;
  @ApiProperty({
    example: '123456789'
  })
  @IsString()
  @MaxLength(50)
  @MinLength(8)
  @IsNotEmpty()
  public password: string;
}
