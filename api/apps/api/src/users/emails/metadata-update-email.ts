import { AttachmentJSON } from '@sendgrid/helpers/classes/attachment';
import { readFileSync } from 'fs';
import { join } from 'path';
import BaseEmail from '../../model/base-email';
import { PendingMetadataDto } from '@tools/models';

interface MetadataEmailContext {
  requestTime: string;
  userName: string;
  accountDetails: string;
  approvalLink: string;
}

const logoImage = readFileSync(
  join(__dirname, 'templates/emails/registration/request-access/logo.png'),
).toString('base64');

export default class MetadataUpdateEmail extends BaseEmail<MetadataEmailContext> {
  constructor(context: MetadataEmailContext) {
    super(
      'backoffice@cdaxforex.com',
      'CDAX Forex <noreply@cdaxforex.com',
      'User requested to update his metadata',
      'emails/registration/update/meta',
      context,
      undefined,
      undefined,
    );
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
