import { INotifiable } from '../types/notifiable.interface';
import { User } from 'src/users/entities/user.schema';
import { ResetPassword } from 'src/auth/entities/reset-password.schema';
import { join } from 'path';
import { Injectable } from '@nestjs/common';
import * as Bull from 'bull';

@Injectable()
export class forgotPasswordNotification implements INotifiable {
  private emailQueue: Bull.Queue;
  private resetPassword: ResetPassword;
  constructor(public user: User, resetPassword: ResetPassword) {
    this.emailQueue = new Bull('email');
    this.user = user;
    this.resetPassword = resetPassword;
  }

  toMail() {
    this.emailQueue.add('sendEmail', {
      to: this.user.email,
      subject: 'Forgot password',
      template: join(__dirname, '../../email/templates' , 'notifications/forgotPasswordNotification.ejs'),
      context: {
        user: this.user.name,
        resetLink: process.env.SITE_URL + `reset-password/reset?token=${this.resetPassword.resetToken}`,
      },
    });
  }
}
