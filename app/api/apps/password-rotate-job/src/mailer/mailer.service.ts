import { Injectable } from '@nestjs/common';
import * as SG from '@sendgrid/mail';
import { join } from 'path';

import { renderFile } from 'ejs';

const NODE_ENV = process.env.NODE_ENV;
const DEBUG_EMAILS = process.env.DEBUG_EMAILS?.split(',') ?? [];

@Injectable()
export class MailerService {
  constructor() {
    SG.setApiKey(String(process.env.SENDGRID_KEY));
  }

  async send(email: any): Promise<void> {
    const sendGridEmail: SG.MailDataRequired = {
      from: email.from,
      to: email.to,
      html: await this.renderTemplate(email.template, email.context),
      subject: email.subject,
      attachments: email.getAttachments(),
    };
    if (email.cc) {
      sendGridEmail.cc = email.cc;
    }
    if (email.bcc) {
      sendGridEmail.bcc = email.bcc;
    }
    try {
      if (NODE_ENV === 'development' && !DEBUG_EMAILS.includes(email.to)) {
        return;
      }

      await SG.send(sendGridEmail);

      console.log(
        `Email sent to ${email.to} from ${email.from} with subject ${email.subject}`,
      );
    } catch (err) {
      console.log((err as any).response);
      console.log((err as Error).message, (err as Error).stack);
      throw err;
    }
  }

  private async renderTemplate(template: string, context: any) {
    const rendered = await renderFile<string>(
      join(__dirname, 'templates/', template + '.ejs'),
      context,
    );

    return rendered;
  }
}
