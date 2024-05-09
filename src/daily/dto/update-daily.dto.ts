import { PartialType } from '@nestjs/swagger';
import { CreateDailyDto } from './create-daily.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateDailyDto extends PartialType(CreateDailyDto) {
  @IsNumber()
  @IsOptional()
  public orderId: number;
}
