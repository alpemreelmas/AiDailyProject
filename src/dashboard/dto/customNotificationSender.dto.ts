import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class CustomNotificationSenderDto {
    @IsString()
    @IsNotEmpty()
    public title: string;

    @IsString()
    @IsNotEmpty()
    public subject: string;
  
    @IsString()
    @IsNotEmpty()
    public content: string;
}
