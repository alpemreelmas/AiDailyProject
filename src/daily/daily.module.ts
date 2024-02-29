import { Module } from '@nestjs/common';
import { DailyService } from './daily.service';
import { DailyController } from './daily.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Daily, DailyDocument } from './entities/daily.entity';
import { UserModule } from 'src/users/user.module';
import { RolesService } from 'src/users/services/roles.service';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: Daily.name, schema: DailyDocument }]),
  ],
  controllers: [DailyController],
  providers: [DailyService,RolesService],
})
export class DailyModule {}
