import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { join } from 'path';

@Injectable()
export class EmailService {
  constructor(@InjectQueue('email') private emailQueue: Queue) {}

  async sendVerificationEmail(
    email: string,
    name: string,
    verificationToken: string,
  ) {
    const verificationLink =
      process.env.SITE_URL + `auth/verify?token=${verificationToken}`;
    const subject = `Verification`;

    await this.emailQueue.add('sendEmail', {
      to: email,
      subject,
      template: join(__dirname, 'templates', 'emailVerificationTemplate.ejs'),
      context: {
        name,
        verificationLink,
      },
    });
  }

  async sendResetPasswordEmail(
    email: string,
    name: string,
    resetToken: string,
  ) {
    const resetLink =
      process.env.SITE_URL + `reset-password/reset?token=${resetToken}`;
    const subject = `Reset password`;

    await this.emailQueue.add('sendEmail', {
      to: email,
      subject,
      template: join(__dirname, 'templates', 'emailResetPasswordTemplate.ejs'),
      context: {
        name,
        resetLink,
      },
    });
  }
}
