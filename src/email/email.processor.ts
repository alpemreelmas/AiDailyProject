// email.processor.ts

import {
  Processor,
  Process,
  OnQueueActive,
  OnQueueCompleted,
} from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
@Processor('email')
export class EmailProcessor {
  constructor(private mailerService: MailerService) {}

  @Process('sendEmail')
  async sendEmail(
    job: Job<{ to: string; subject: string; template: string; context: any }>,
  ): Promise<void> {
    const { to, subject, template, context } = job.data;

    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template,
        context,
      });
      console.log('mail has been successfully');
    } catch (error) {
      // Handle error, log, or retry logic can be added here
      console.error(`Error sending email to ${to}: ${error.message}`);
    }
  }
  @OnQueueActive()
  onActive(job: Job<unknown>) {
    // Log that job is starting
    Logger.log(`Starting job ${job.id} : ${job.data['custom_id']}`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job<unknown>) {
    // Log job completion status
    Logger.log(`Job ${job.id} has been finished`);
  }
}
