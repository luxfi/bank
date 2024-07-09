import { readFileSync } from 'fs';
import { join } from 'path';
import { AttachmentJSON } from '@sendgrid/helpers/classes/attachment';
import BaseEmail from '../base-email';

interface PendingPaymentEmailContext {
  to: string;
  uuid: string;
  fullName: string;
  email: string;
  phone?: string;
  createdAt: string;
  url?: string;
}

const logoImage = readFileSync(
  join(__dirname, 'templates/emails/operations/transactions/logo.png'),
).toString('base64');

export default class PendingPaymentEmail extends BaseEmail<PendingPaymentEmailContext> {
  constructor(context: PendingPaymentEmailContext) {
    super(
      context.to,
      'CDAX Forex <noreply@cdaxforex.com>',
      'An Action needs your approval',
      'emails/operations/transactions/pending',
      {
        ...context,
        url: PendingPaymentEmail.getPaymentUrl(context.uuid),
      },
    );
  }

  private static getPaymentUrl(uuid: string): string {
    const url = new URL(`/dashboard/pending/${uuid}`, process.env.FRONTEND_URL);
    return url.toString();
  }

  getAttachments(): AttachmentJSON[] {
    return [
      {
        filename: 'logo.png',
        type: 'image/png',
        content_id: 'logo',
        content: logoImage,
        disposition: 'inline',
      },
    ];
  }
}
