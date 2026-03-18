import { Injectable, Logger } from '@nestjs/common';
import sgMail from '@sendgrid/mail';
import { join } from 'path';
import { renderFile } from 'ejs';
import { LUX_BRAND } from '@luxbank/brand';
import BaseEmail from '../model/base-email';

const NODE_ENV = process.env.NODE_ENV;
const DEBUG_EMAILS = process.env.DEBUG_EMAILS?.split(',') ?? [];
const TEST_EMAIL_DOMAIN = LUX_BRAND.domains.primary.replace(/\./g, '').toLowerCase();

@Injectable()
export class MailerService {
    readonly logger = new Logger(MailerService.name);

    private mailerEnabled = false;

    constructor() {
        const apiKey = process.env.SENDGRID_KEY;

        if (!apiKey || !apiKey.startsWith('SG.')) {
            this.logger.warn('SENDGRID_KEY is not configured — email sending disabled');
            return;
        }

        sgMail.setApiKey(apiKey);
        this.mailerEnabled = true;
    }

    async send<T extends Record<string, any>>(email: BaseEmail<T>): Promise<void> {
        if (!this.mailerEnabled) {
            this.logger.warn(`Email to ${email.to} suppressed — mailer not configured`);
            return;
        }

        const sendGridEmail: sgMail.MailDataRequired = {
            from: email.from,
            to: email.to,
            html: await this.renderTemplate(email.template, email.context),
            subject: email.subject,
            attachments: email.getAttachments(),
        };

        if (email.cc)
            sendGridEmail.cc = email.cc;

        if (email.bcc)
            sendGridEmail.bcc = email.bcc;

        try {
            if (NODE_ENV === 'development' && !DEBUG_EMAILS.includes(email.to) && !email.to.includes(`${TEST_EMAIL_DOMAIN}+`)) {
                return;
            }

            await sgMail.send(sendGridEmail);

            this.logger.log(`Email sent to ${email.to} from ${email.from} with subject ${email.subject}`);
        }
        catch (err) {
            this.logger.debug((err as any).response);
            this.logger.error((err as Error).message, (err as Error).stack);
            throw err;
        }
    }

    private async renderTemplate(template: string, context: any) {
        const rendered = await renderFile<string>(join(__dirname, '../templates/', template + '.ejs'), context);
        return rendered;
    }
}
