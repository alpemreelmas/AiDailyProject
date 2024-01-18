import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDailyDto {
  @IsString()
  @IsNotEmpty()
  public content: string;
}
