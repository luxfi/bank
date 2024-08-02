import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import twilio from 'twilio';

@Injectable()
export class TwoFaVerificationService {
  private client: twilio.Twilio;
  private readonly serviceSid: string;
  private readonly logger = new Logger(TwoFaVerificationService.name);

  constructor(private configService: ConfigService) {
    this.serviceSid = this.getEnvVar('TWILIO_SERVICE_SID');
    const accountSid = this.getEnvVar('TWILIO_ACCOUNT_SID');
    const authToken = this.getEnvVar('TWILIO_AUTH_TOKEN');

    this.client = twilio(accountSid, authToken); // Correct instantiation of Twilio client
  }

  private getEnvVar(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) {
      this.logger.error(`Environment variable ${key} is not set`);
      throw new Error(`Environment variable ${key} is not set`);
    }
    return value;
  }

  async sendVerification(to: string, channel: 'sms' | 'email'): Promise<boolean> {
    try {
      const verification = await this.client.verify
        .services(this.serviceSid)
        .verifications.create({
          to,
          channel,
        });

      return verification.status === 'pending';
    } catch (error) {
      this.logger.error(`Failed to send OTP to: ${to}`, error);
      return false;
    }
  }

  async checkVerification(to: string, code: string): Promise<boolean> {
    try {
      const verification = await this.client.verify
        .services(this.serviceSid)
        .verificationChecks.create({
          to,
          code,
        });

      return verification.status === 'approved';
    } catch (error) {
      this.logger.error(`Failed to check OTP for: ${to}`, error);
      return false;
    }
  }
}
