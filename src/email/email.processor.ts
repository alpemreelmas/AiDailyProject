// email.processor.ts


import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
@Processor('email')
export class EmailProcessor {
  constructor(private mailerService: MailerService) {}

  @Process('sendEmail')
  async sendEmail(job: Job<{ to: string, subject: string, template: string, context: any }>): Promise<void> {
    const { to, subject, template, context } = job.data;

    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template,
        context,
      });
      console.log("mail has been successfully")
    } catch (error) {
      // Handle error, log, or retry logic can be added here
      console.error(`Error sending email to ${to}: ${error.message}`);
    }
  }
}
