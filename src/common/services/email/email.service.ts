import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('email.host'),
      port: this.configService.get<number>('email.port'),
      secure: this.configService.get<boolean>('email.secure'),
      auth: {
        user: this.configService.get<string>('email.auth.user'),
        pass: this.configService.get<string>('email.auth.pass'),
      },
    });
  }

  async sendMail(
    to: string,
    subject: string,
    text: string,
    html?: string,
    attachments?: any[],
  ) {
    try {
      const mailOptions = {
        from: this.configService.get<string>('email.defaultFrom'),
        to,
        subject,
        text,
        html,
        attachments,
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent: ${result.messageId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`);
      throw error;
    }
  }
}
