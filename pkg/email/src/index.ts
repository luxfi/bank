import { Injectable, Logger } from '@nestjs/common';
import SG from '@sendgrid/mail';
import { join } from 'path';
import { renderFile } from 'ejs';
import BaseEmail from './base-email';
import { LUX_BRAND } from '@luxbank/brand';

const NODE_ENV = process.env.NODE_ENV;
const DEBUG_EMAILS = process.env.DEBUG_EMAILS?.split(',') ?? [];

// Email domain for debug filtering
const EMAIL_DOMAIN = LUX_BRAND.domains.primary;

@Injectable()
export class MailerService {
  readonly logger = new Logger(MailerService.name);

  constructor() {
    SG.setApiKey(String(process.env.SENDGRID_KEY));
  }

  async send<T extends Record<string, any>>(email: BaseEmail<T>): Promise<void> {
    const sendGridEmail: SG.MailDataRequired = {
      from: email.from,
      to: email.to,
      html: await this.renderTemplate(email.template, email.context),
      subject: email.subject,
      attachments: email.getAttachments()
    };

    if (email.cc)
      sendGridEmail.cc = email.cc;

    if (email.bcc)
      sendGridEmail.bcc = email.bcc;

    try {
      // In development, only send to debug emails or internal testing addresses
      if (NODE_ENV === 'development' && !DEBUG_EMAILS.includes(email.to) && !email.to.includes(`@${EMAIL_DOMAIN}`))
        return;

      await SG.send(sendGridEmail);

      this.logger.log(
        `Email sent to ${email.to} from ${email.from} with subject ${email.subject}`
      );
    }
    catch (err) {
      this.logger.debug((err as any).response);
      this.logger.error((err as Error).message, (err as Error).stack);
      throw err;
    }
  }

  private async renderTemplate(template: string, context: any) {
    const rendered = await renderFile<string>(
      join(__dirname, 'templates/', template + '.ejs'),
      context
    );

    return rendered;
  }
}
