import { Injectable, Logger } from '@nestjs/common';
import Twilio from 'twilio';

@Injectable()
export class TwoFaVerificationService {
    private client: Twilio.Twilio;
    private readonly serviceSid = String(process.env.TWILIO_SERVICE_SID);
    private readonly accountSid = String(process.env.TWILIO_ACCOUNT_SID);
    private readonly authToken = String(process.env.TWILIO_AUTH_TOKEN);

    private readonly logger = new Logger(TwoFaVerificationService.name);

    constructor() {
        // Log environment variables for debugging
        console.log('Account SID:', this.accountSid);
        console.log('Auth Token:', this.authToken);
        console.log('Service SID:', this.serviceSid);

        if (!this.accountSid.startsWith('AC') || !this.authToken || !this.serviceSid) {
            this.logger.error('Invalid Twilio credentials');
            throw new Error('Invalid Twilio credentials');
        }

        this.client = new Twilio(this.accountSid, this.authToken); // Correct instantiation of Twilio client
    }

    async sendVerification(to: string, channel: 'sms' | 'email'): Promise<boolean> {
        try {
            const verification = await this.client.verify
                .services(this.serviceSid)
                .verifications.create({
                    to,
                    channel
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
                    code
                });

            return verification.status === 'approved';
        } catch (error) {
            this.logger.error(`Failed to check OTP for: ${to}`, error);
            return false;
        }
    }
}
