import { seeder } from 'nestjs-seeder';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users/entities/user.schema';
import { UsersSeeder } from './users/seeders/users.seeder';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import notificationConfig from './config/notification';
import rolesConfig from './config/roles';
import { RolesSeeder } from './users/seeders/roles.seeder';

seeder({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [notificationConfig, rolesConfig],
      envFilePath: '.env.local',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '30m' },
    }),
    UserModule,
    AuthModule,
  ],
}).run([RolesSeeder, UsersSeeder]);
