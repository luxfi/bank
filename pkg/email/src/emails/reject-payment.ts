import { readFileSync } from 'fs';
import { join } from 'path';
import { AttachmentJSON } from '@sendgrid/helpers/classes/attachment';
import BaseEmail from '../base-email';
import { LUX_BRAND } from '@luxbank/brand';

interface RejectPaymentEmailContext {
  reference: string;
  name: string;
  to: string;
  description: string;
  email: string;
  createdAt: string;
}

const logoImage = readFileSync(
  join(__dirname, 'templates/emails/operations/transactions/logo.png')
).toString('base64');

export default class RejectPaymentEmail extends BaseEmail<RejectPaymentEmailContext> {
  constructor(context: RejectPaymentEmailContext) {
    const { jurisdiction } = LUX_BRAND;
    super(
      context.to,
      `${LUX_BRAND.name} <${jurisdiction.contact.email}>`,
      'Transaction Denied',
      'emails/operations/transactions/rejected',
      context
    );
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
