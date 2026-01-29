import { AttachmentJSON } from '@sendgrid/helpers/classes/attachment';
import { readFileSync } from 'fs';
import { join } from 'path';
import BaseEmail from '../base-email';
import { LUX_BRAND } from '@luxbank/brand';

interface BeneficiaryEmailContext {
  fullName: string;
  accountNumber: string;
  currency: string;
  message: string;
}

const heroImage = readFileSync(
  join(__dirname, 'templates/emails/operations/beneficiary/hero.gif'),
).toString('base64');

const helpCenterImage = readFileSync(
  join(
    __dirname,
    'templates/emails/operations/beneficiary/help-centre-btn.gif'
  )
).toString('base64');

const icon1Image = readFileSync(
  join(__dirname, 'templates/emails/operations/beneficiary/icon-1.gif')
).toString('base64');

export default class BeneficiaryEmail extends BaseEmail<BeneficiaryEmailContext> {
  constructor(to: string, context: BeneficiaryEmailContext) {
    const { jurisdiction } = LUX_BRAND;
    super(
      to,
      `${LUX_BRAND.name} <${jurisdiction.contact.email}>`,
      'Beneficiary approval/disapproval',
      'emails/operations/beneficiary/approve',
      context,
      undefined,
      jurisdiction.contact.supportEmail
    );
  }

  getAttachments(): AttachmentJSON[] {
    return [
      {
        filename: 'hero.gif',
        type: 'image/gif',
        content_id: 'hero',
        content: heroImage,
        disposition: 'inline'
      },
      {
        filename: 'help-center.gif',
        type: 'image/gif',
        content_id: 'help-center',
        content: helpCenterImage,
        disposition: 'inline'
      },
      {
        filename: 'icon-1.gif',
        type: 'image/gif',
        content_id: 'icon-1',
        content: icon1Image,
        disposition: 'inline'
      }
    ];
  }
}
