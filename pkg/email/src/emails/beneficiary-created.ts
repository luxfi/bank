import { readFileSync } from 'fs';
import { join } from 'path';
import { AttachmentJSON } from '@sendgrid/helpers/classes/attachment';
import BaseEmail from '../base-email';
import { LUX_BRAND } from '@luxbank/brand';

interface BeneficiaryEmailContext {
  fullName: string;
  uuid: string;
  url: string;
  createdBy: {
    fullName: string;
    email: string;
    phone: string;
  };
  createdAt: string;
}

const logoImage = readFileSync(
  join(__dirname, 'templates/emails/registration/request-access/logo.png'),
).toString('base64');

export default class BeneficiaryCreatedEmail extends BaseEmail<BeneficiaryEmailContext> {
  constructor(to: string, context: BeneficiaryEmailContext) {
    const { jurisdiction } = LUX_BRAND;
    super(
      `${process.env.BACKOFFICE_EMAIL ?? to}`,
      `${LUX_BRAND.name} <${jurisdiction.contact.email}>`,
      `${LUX_BRAND.name} Beneficiary Created`,
      'emails/operations/beneficiary-created/request',
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
