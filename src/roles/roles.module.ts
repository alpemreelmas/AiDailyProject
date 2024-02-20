import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Roles, RolesSchema} from './entities/roles.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Roles', schema: RolesSchema }]),
  ],
  providers: [RolesService],
  exports: [RolesService, MongooseModule],
})
export class RolesModule {}
