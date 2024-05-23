import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../entities/user.schema';
import { v4 as uuidv4 } from 'uuid';
import { Seeder } from 'nestjs-seeder';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment/moment';
import { UserAndRoles } from '../entities/userRoles';
import { AuthService } from '../../auth/services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Roles } from '../entities/roles.schema';

@Injectable()
export class RolesSeeder implements Seeder {
  constructor(
    @InjectModel(UserAndRoles.name)
    private readonly rolesAndUser: Model<UserAndRoles>,
    @InjectModel(Roles.name) private readonly roles: Model<Roles>,
    private configService: ConfigService,
  ) {}

  async seed(): Promise<any> {
    const roles = this.configService.get<string>('roles');
    for (const [key, value] of Object.entries(roles)) {
      await this.roles.create({ name: value });
    }
  }

  async drop(): Promise<any> {
    return this.roles.deleteMany({});
  }
}
