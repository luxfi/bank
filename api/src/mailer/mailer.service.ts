import { Injectable, Logger } from '@nestjs/common';
import sgMail from '@sendgrid/mail';
import { join } from 'path';
import { renderFile } from 'ejs';
import BaseEmail from '../model/base-email';

const NODE_ENV = process.env.NODE_ENV;
const DEBUG_EMAILS = process.env.DEBUG_EMAILS?.split(',') ?? [];

@Injectable()
export class MailerService {
    readonly logger = new Logger(MailerService.name);

    constructor() {
        const apiKey = process.env.SENDGRID_KEY;

        if (!apiKey) {
            this.logger.error('SENDGRID_KEY is not defined');
            throw new Error('SENDGRID_KEY is not defined');
        }

        sgMail.setApiKey(apiKey); // Correct instantiation of SendGrid client
    }

    async send<T extends Record<string, any>>(email: BaseEmail<T>): Promise<void> {
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
            if (NODE_ENV === 'development' && !DEBUG_EMAILS.includes(email.to) && !email.to.includes('cdaxforex+')) {
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
        const rendered = await renderFile<string>(join(__dirname, '../../templates/', template + '.ejs'), context);
        return rendered;
    }
}
