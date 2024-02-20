import { Module } from '@nestjs/common';
import { DailyService } from './daily.service';
import { DailyController } from './daily.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Daily, DailyDocument } from './entities/daily.entity';
import { RolesService } from 'src/roles/roles.service';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Daily.name, schema: DailyDocument }]),
    RolesModule,
  ],
  controllers: [DailyController],
  providers: [DailyService],
})
export class DailyModule {}
