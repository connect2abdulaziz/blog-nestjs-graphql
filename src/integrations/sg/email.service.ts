// src/email/email.service.ts
import * as sgMail from '@sendgrid/mail';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailMessages } from '../../constants/messages.constants'; 

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {
    sgMail.setApiKey(this.configService.get<string>('SENDGRID_API_KEY')!);
  }

  async sendVerificationEmail(email: string, verificationToken: string): Promise<void> {
    const link = `${this.configService.get('APP_URL')}/api/v1/auth/verify-email?token=${verificationToken}`;
    const msg = {
      to: email,
      from: this.configService.get<string>('SENDGRID_SENDER_EMAIL')!,
      subject: EmailMessages.VERIFY_EMAIL_SUBJECT, 
      text: `Please click the following link to verify your email: ${link}`,
      html: EmailMessages.VERIFY_EMAIL_BODY(link), 
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      throw new Error(EmailMessages.EMAIL_SEND_ERROR); 
    }
  }

  async sendResetEmail(email: string, verificationToken: string): Promise<void> {
    const link = `${this.configService.get('APP_URL')}/api/v1/auth/reset-password?token=${verificationToken}`;
    const msg = {
      to: email,
      from: this.configService.get<string>('SENDGRID_SENDER_EMAIL')!,
      subject: EmailMessages.RESET_PASSWORD_SUBJECT, 
      text: `Please click the following link to reset your password: ${link}`,
      html: EmailMessages.RESET_PASSWORD_BODY(link), 
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      throw new Error(EmailMessages.EMAIL_SEND_ERROR); 
    }
  }
}
