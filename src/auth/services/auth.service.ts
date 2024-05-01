import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/users/services/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuthToken, AuthTokenDocument } from '../entities/auth_token.schema';
import * as moment from 'moment';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh_token.dto';
import { User, UserDocument } from '../../users/entities/user.schema';
import { RegisterDto } from '../dto/register.dto';
import { EmailService } from '../../email/email.service';
import { UpdateProfileDto } from '../dto/updateProfile.dto';
import { NotificationService } from 'src/notification/notification.service';
import { LoggedInNotification } from 'src/notification/notifiables/loggedInNotification.notification';
import { welcomeNotification } from 'src/notification/notifiables/welcomeNotification.notification';
import { verificationNotification } from 'src/notification/notifiables/verificationNotification.notification';
import { RolesService } from 'src/users/services/roles.service';
import { Roles, rolesDocument } from 'src/users/entities/roles.schema';
import {
  UserAndRoles,
  userAndRolesDocument,
} from 'src/users/entities/userRoles';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AuthToken.name)
    private AuthTokenModel: Model<AuthTokenDocument>,
    @InjectModel(UserAndRoles.name)
    private UserAndRolesModel: Model<userAndRolesDocument>,
    private userService: UserService,
    private jwtService: JwtService,
    @InjectModel(User.name)
    private UserModel: Model<UserDocument>,
    private emailService: EmailService,
    private notificationService: NotificationService,
    @InjectModel(Roles.name)
    private RolesModel: Model<rolesDocument>,
    private rolesService: RolesService,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    const user = await this.userService.findByQuery({ email: loginDto.email });
    if (!user) {
      throw new BadRequestException(
        "We couldn't find this credentials in our system",
      );
    }
    if (!bcrypt.compareSync(loginDto.password, user.password)) {
      throw new BadRequestException(
        "We couldn't find this credentials in our system",
      );
    }
    const newUser = { sub: user._id, name: user.name, email: user.email };
    const hashedRefreshToken = await this.createRefreshToken(user._id);

    this.notificationService.sendNotification(new LoggedInNotification(user));

    return {
      ...newUser,
      access_token: await this.jwtService.signAsync(newUser, {
        secret: process.env.JWT_SECRET_KEY,
      }),
      refresh_token: hashedRefreshToken,
    };
  }

  async register(registerDto: RegisterDto): Promise<any> {
    const userIfExist = await this.userService.findByQuery({
      email: registerDto.email,
    });
    if (userIfExist) {
      throw new BadRequestException('This email already exist.');
    }

    const hashedPass = bcrypt.hashSync(registerDto.password, 10);
    const verificationToken = uuidv4();

    const user = await this.UserModel.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPass,
      emailVerifiedAt: null,
      verificationToken,
      verificationTokenExpiresAt: moment().add(24, 'hours').toDate(),
    });

    const role = await this.RolesModel.findOne({ name: 'user' }).exec();

    if (!role)
      throw new BadRequestException('We cannot handle this request right now.');

    await this.UserAndRolesModel.create({
      userId: user._id,
      roleId: role._id,
    });

    const newUser = { sub: user._id, name: user.name, email: user.email };
    const hashedRefreshToken = await this.createRefreshToken(user._id);

    this.notificationService.sendNotification(new welcomeNotification(user));
    this.notificationService.sendNotification(
      new verificationNotification(user),
    );

    return {
      ...newUser,
      access_token: await this.jwtService.signAsync(newUser, {
        secret: process.env.JWT_SECRET_KEY,
      }),
      refresh_token: hashedRefreshToken,
    };
  }

  async verifyEmail(verificationToken: string) {
    const user = await this.UserModel.findOne({ verificationToken });

    if (!user) {
      throw new NotFoundException(
        'User not found or verification token is invalid',
      );
    }

    if (moment().isAfter(user.verificationTokenExpiresAt)) {
      throw new NotFoundException('Verification link has expired');
    }

    await this.UserModel.updateOne(
      { verificationToken },
      { emailVerifiedAt: moment().format('YYYY-MM-DD') },
    );

    await this.UserModel.updateOne(
      { verificationToken },
      { verificationTokenExpiresAt: null, verificationToken: null },
    );
  }

  async resendVerificationEmail(email: string) {
    const oUser = await this.UserModel.findOne({ email });
    if (!oUser) {
      throw new NotFoundException('User not found');
    }

    const newVerificationToken = uuidv4();
    const newVerificationTokenExpiresAt = moment().add(24, 'hours').toDate();

    const user = await this.UserModel.findOneAndUpdate(
      { email },
      {
        verificationToken: newVerificationToken,
        verificationTokenExpiresAt: newVerificationTokenExpiresAt,
      },
      { returnDocument: 'after' },
    );

    this.notificationService.sendNotification(
      new verificationNotification(user),
    );
  }

  // TODO: Change here to jwt token
  async createRefreshToken(user: Types.ObjectId) {
    const validUntil = moment().add(7, 'days');

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: user,
        refresh: true,
      },
      {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: '7d',
      },
    );

    this.AuthTokenModel.create({
      jwtToken: refreshToken,
      validUntil,
      refreshToken,
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

  getProfile(id: string) {
    return this.UserModel.findById(id);
  }

  async updateProfile(updateProfileDto: UpdateProfileDto, id: string) {
    const obj: { name?: string; password?: string } = {};
    if (updateProfileDto.password) {
      const hashedPass = bcrypt.hashSync(updateProfileDto.password, 10);
      obj.password = hashedPass;
    }

    if (updateProfileDto.name) obj.name = updateProfileDto.name;

    const user = await this.UserModel.findByIdAndUpdate(id, obj, {
      returnDocument: 'after',
    });

    if (!user) throw new NotFoundException("User couldn't find.");

    return user;
  }
}
