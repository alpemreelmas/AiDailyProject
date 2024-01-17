import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendVerificationEmail(email: string, name: string) {
    const subject = `Verification`;

    await this.mailerService.sendMail({
      to: email,
      subject,
      template: '../../../email/templates/emailVerificationTemplate',
      context: {
        name,
      },
    });
  }
}
