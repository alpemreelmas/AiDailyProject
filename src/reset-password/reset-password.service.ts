import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import {
  ResetPassword,
  resetPasswordDocument,
} from './entities/reset-password.schema';
import { User, UserDocument } from '../users/entities/user.schema';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';
import { publicDecrypt } from 'crypto';
import { ResetPasswordDto } from './dto/reset-password-token.dto';

@Injectable()
export class ResetPasswordService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(ResetPassword.name)
    private ResetPasswordModel: Model<resetPasswordDocument>,

    @InjectModel(User.name)
    private UserModel: Model<UserDocument>,

    private emailService: EmailService,
  ) {}

  async sendForgotPasswordEmail(email: string) {
    const user = await this.UserModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    /*if (!user.emailVerifiedAt == null) {
          throw new NotFoundException('Email not verified');
        }*/

    const newResetToken = uuidv4();
    const newResetTokenExpiresAt = moment().add(15, 'minutes').toDate();

    const resetPassword = await this.ResetPasswordModel.create({
      email: user.email,
      resetToken: newResetToken,
      resetTokenExpiresAt: newResetTokenExpiresAt,
    });

    this.emailService.sendResetPasswordEmail(
      resetPassword.email,
      user.name,
      resetPassword.resetToken,
    );
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto, resetToken: string) {
    const user = await this.UserModel.findOne({
      email: resetPasswordDto.email,
    });
    const userResetToken = await this.ResetPasswordModel.findOne({
      resetToken,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (userResetToken.resetToken !== resetToken) {
      throw new NotFoundException('Invalid reset token');
    }

    if (moment().isAfter(moment(userResetToken.resetTokenExpiresAt))) {
      throw new NotFoundException('Reset token has expired');
    }

    if (bcrypt.compareSync(resetPasswordDto.newPassword, user.password)) {
      throw new BadRequestException(
        'New password must be different from the old password',
      );
    }

    await this.UserModel.updateOne(
      { email: resetPasswordDto.email },
      { password: bcrypt.hashSync(resetPasswordDto.newPassword, 10) },
    );
    await this.ResetPasswordModel.deleteOne({ resetToken });
  }

  async checkToken(resetToken: string) {
    const userResetToken = await this.ResetPasswordModel.findOne({
      resetToken,
    });
    if (!userResetToken) {
      throw new NotFoundException('Invalid reset token');
    }
  }
}
