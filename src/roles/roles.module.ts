import { Module, forwardRef } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Roles, RolesSchema} from './entities/roles.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAndRolesSchema } from './entities/userAndRoles.schema';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Roles', schema: RolesSchema }]),
    MongooseModule.forFeature([{ name: 'UserAndRoles', schema: UserAndRolesSchema }]),
    forwardRef(() => UserModule)
  ],
  providers: [RolesService],
  exports: [RolesService, MongooseModule],
})
export class RolesModule {}
