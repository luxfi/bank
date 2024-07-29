import { Injectable, Logger } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class TwoFaVerificationService {
    private client;
    private serviceSid = String(process.env.TWILIO_SERVICE_SID);
    private accountSid = String(process.env.TWILIO_ACCOUNT_SID);
    private authToken = String(process.env.TWILIO_AUTH_TOKEN);

    private readonly logger = new Logger(TwoFaVerificationService.name);

    constructor() {
        this.client = new Twilio(this.accountSid, this.authToken);
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
        } 
        catch (error) {
            this.logger.error(`failed send otp to: ${to}`, error);
        }
        return false;
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
        } 
        catch (error) {
            this.logger.error(`failed send otp to: ${to}`, error);
        }
        return false;
    }
}
