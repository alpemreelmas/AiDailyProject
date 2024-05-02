import { INotifiable } from '../types/notifiable.interface';
import { User } from 'src/users/entities/user.schema';
import { ResetPassword } from 'src/auth/entities/reset-password.schema';
import { join } from 'path';
import { Injectable } from '@nestjs/common';

@Injectable()
export class forgotPasswordNotification implements INotifiable {
  constructor(
    public user: User,
    private resetPassword: ResetPassword,
    private emailQueue?,
  ) {
    this.user = user;
    this.resetPassword = resetPassword;
  }

  toMail() {
    this.emailQueue.add('sendEmail', {
      to: this.user.email,
      subject: 'Forgot password',
      template: join(
        __dirname,
        '../../assets/email/templates',
        'notifications/forgotPasswordNotification.ejs',
      ),
      context: {
        user: this.user.name,
        resetLink:
          process.env.SITE_URL +
          `reset-password/reset?token=${this.resetPassword.resetToken}`,
      },
    });
  }
}
