import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import twilio from 'twilio';

@Injectable()
export class TwoFaVerificationService {
  private client: twilio.Twilio | null = null;
  private readonly serviceSid: string;
  private readonly enabled: boolean;
  private readonly logger = new Logger(TwoFaVerificationService.name);

  constructor(private configService: ConfigService) {
    const serviceSid = this.configService.get<string>('TWILIO_SERVICE_SID');
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');

    if (!serviceSid || !accountSid || !authToken) {
      this.logger.warn('Twilio credentials not configured — 2FA verification disabled');
      this.serviceSid = '';
      this.enabled = false;
      return;
    }

    this.serviceSid = serviceSid;
    this.enabled = true;
    this.client = twilio(accountSid, authToken);
  }

  async sendVerification(to: string, channel: 'sms' | 'email'): Promise<boolean> {
    if (!this.enabled || !this.client) {
      this.logger.warn(`2FA disabled — skipping verification send to: ${to}`);
      return false;
    }

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
    if (!this.enabled || !this.client) {
      this.logger.warn(`2FA disabled — skipping verification check for: ${to}`);
      return false;
    }

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
