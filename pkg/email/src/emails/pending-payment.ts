import { readFileSync } from 'fs';
import { join } from 'path';
import { AttachmentJSON } from '@sendgrid/helpers/classes/attachment';
import BaseEmail from '../base-email';
import { LUX_BRAND } from '@luxbank/brand';

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
  join(__dirname, 'templates/emails/operations/transactions/logo.png')
).toString('base64');

export default class PendingPaymentEmail extends BaseEmail<PendingPaymentEmailContext> {
  constructor(context: PendingPaymentEmailContext) {
    const { jurisdiction } = LUX_BRAND;
    super(
      context.to,
      `${LUX_BRAND.name} <${jurisdiction.contact.email}>`,
      'An Action needs your approval',
      'emails/operations/transactions/pending',
      {
        ...context,
        url: PendingPaymentEmail.getPaymentUrl(context.uuid)
      }
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
        disposition: 'inline'
      }
    ];
  }
}
