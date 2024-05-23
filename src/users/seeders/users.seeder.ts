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
import { Roles } from '../entities/roles.schema';

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(
    @InjectModel(User.name) private readonly user: Model<User>,
    @InjectModel(UserAndRoles.name)
    private readonly rolesAndUser: Model<UserAndRoles>,
    @InjectModel(Roles.name) private readonly roles: Model<Roles>,
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(JwtService) private jwtService: JwtService,
  ) {}

  async seed(): Promise<any> {
    // Generate 10 users.
    //const users = DataFactory.createForClass(User).generate(1);

    const hashedPass = bcrypt.hashSync('password', 10);
    const verificationToken = uuidv4();

    // Insert into the database.
    //await this.user.insertMany(users);

    const user = await this.user.create({
      name: 'John Smith',
      email: 'john_smith@gmail.com',
      password: hashedPass,
      emailVerifiedAt: null,
      verificationToken,
      verificationTokenExpiresAt: moment().add(24, 'hours').toDate(),
    });

    const role = await this.roles.findOne({ name: 'user' });
    await this.rolesAndUser.create({
      userId: user._id,
      roleId: role._id,
    });

    const newUser = { sub: user._id, name: user.name, email: user.email };
    const hashedRefreshToken = await this.authService.createRefreshToken(
      user._id,
    );

    return {
      ...newUser,
      access_token: await this.jwtService.signAsync(newUser, {
        secret: process.env.JWT_SECRET_KEY,
      }),
      refresh_token: hashedRefreshToken,
    };
  }

  async drop(): Promise<any> {
    return this.user.deleteMany({});
  }
}
