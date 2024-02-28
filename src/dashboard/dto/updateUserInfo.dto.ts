import { IsNotEmpty, IsString, IsEmail, IsDate, IsArray, IsDateString } from 'class-validator';

export class UpdateUserInfoDto {

    @IsString()
    @IsNotEmpty()
    public name: string;
 
    @IsDateString()
    @IsNotEmpty()
    public emailVerifiedAt: Date;
  
    @IsArray()
    @IsNotEmpty()
    public role: string[];
}
