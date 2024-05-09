import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDailyDto {
  @IsString()
  @IsNotEmpty()
  public content: string;

  @IsNumber()
  @IsNotEmpty()
  public orderId: number;
}
