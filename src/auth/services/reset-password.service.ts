import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import {
  ResetPassword,
  resetPasswordDocument,
} from '../entities/reset-password.schema';
import { User, UserDocument } from 'src/users/entities/user.schema';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment';
import * as bcrypt from 'bcrypt';
import { ResetPasswordDto } from '../dto/reset-password-token.dto';
import { NotificationService } from 'src/notification/notification.service';
import { resetPasswordNotification } from 'src/notification/notifiables/resetPasswordNotification.notification';
import { forgotPasswordNotification } from 'src/notification/notifiables/forgotPasswordNotification.notification';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class ResetPasswordService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(ResetPassword.name)
    private ResetPasswordModel: Model<resetPasswordDocument>,

    @InjectModel(User.name)
    private UserModel: Model<UserDocument>,
    private notificationService: NotificationService,
    @InjectQueue('email') private emailQueue,
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

    this.notificationService.sendNotification(
      new forgotPasswordNotification(user, resetPassword, this.emailQueue),
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
    this.notificationService.sendNotification(
      new resetPasswordNotification(user, this.emailQueue),
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
