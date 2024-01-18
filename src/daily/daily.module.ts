import { Module } from '@nestjs/common';
import { DailyService } from './daily.service';
import { DailyController } from './daily.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Daily, DailyDocument } from './entities/daily.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Daily.name, schema: DailyDocument }]),
  ],
  controllers: [DailyController],
  providers: [DailyService],
})
export class DailyModule {}
