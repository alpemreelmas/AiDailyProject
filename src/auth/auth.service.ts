import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuthToken, AuthTokenDocument } from './entities/auth_token.schema';
import * as moment from 'moment';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh_token.dto';
import { User } from '../users/entities/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AuthToken.name)
    private AuthTokenModel: Model<AuthTokenDocument>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    const user = await this.userService.findByQuery({ email: loginDto.email });
    if (!user) {
      throw new NotFoundException(
        "We couldn't find this credentials in our system",
      );
    }
    if (bcrypt.compareSync(loginDto.password, user.password)) {
      throw new UnauthorizedException();
    }
    const newUser = { sub: user._id, name: user.name, email: user.email };
    const hashedRefreshToken = await this.createRefreshToken(user._id);
    return {
      ...newUser,
      access_token: await this.jwtService.signAsync(newUser, {
        secret: process.env.JWT_SECRET_KEY,
      }),
      refresh_token: hashedRefreshToken,
    };
  }
  // TODO: Change here to jwt token
  async createRefreshToken(user: Types.ObjectId) {
    const refreshToken = await bcrypt.hashSync(uuidv4(), 10);
    const validUntil = moment().add(7, 'days');
    this.AuthTokenModel.create({
      refreshToken,
      validUntil,
      isValid: true,
      user,
    });
    return refreshToken;
  }

  async generateToken(refreshTokenDto: RefreshTokenDto) {
    const token = await this.AuthTokenModel.findOne({
      refreshToken: refreshTokenDto.refreshToken,
    })
      .populate('user', null, User.name)
      .exec();
    if (!token) {
      throw new UnauthorizedException();
    }
    if (moment().diff(moment(token.validUntil)) < 0 || !token.isValid) {
      throw new UnauthorizedException();
    }

    const newUser = {
      sub: token.user._id,
      name: token.user.name,
      email: token.user.email,
    };
    await this.AuthTokenModel.findByIdAndUpdate(token._id, { isValid: false });
    const refreshToken = await this.createRefreshToken(newUser.sub);
    return {
      ...newUser,
      access_token: await this.jwtService.signAsync(newUser, {
        secret: process.env.JWT_SECRET_KEY,
      }),
      refresh_token: refreshToken,
    };
  }
}
