import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OrderDailyDto {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @IsNumber()
  @IsNotEmpty()
  public orderId: number;
}
