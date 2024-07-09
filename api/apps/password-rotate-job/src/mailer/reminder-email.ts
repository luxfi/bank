import { AttachmentJSON } from '@sendgrid/helpers/classes/attachment';
import { readFileSync } from 'fs';
import { join } from 'path';
import BaseEmail from './base-email';

interface ReminderEmailContext {
  firstName: string;
  loginUrl: string;
}

const button = readFileSync(join(__dirname, 'templates/button.png')).toString(
  'base64',
);
const logo = readFileSync(join(__dirname, 'templates/logo.png')).toString(
  'base64',
);
const profile = readFileSync(join(__dirname, 'templates/profile.png')).toString(
  'base64',
);

export default class ReminderEmail extends BaseEmail<ReminderEmailContext> {
  constructor(to: string, context: ReminderEmailContext) {
    super(
      to,
      'CDAX Forex <noreply@cdaxforex.com>',
      'CDAX Forex - Update Your Password',
      'reminder',
      context,
      undefined,
      'backoffice@cdaxforex.com',
    );
  }

  getAttachments(): AttachmentJSON[] {
    return [
      {
        filename: 'button.png',
        type: 'image/png',
        content_id: 'button',
        content: button,
        disposition: 'inline',
      },
      {
        filename: 'logo.png',
        type: 'image/png',
        content_id: 'logo',
        content: logo,
        disposition: 'inline',
      },
      {
        filename: 'profile.png',
        type: 'image/png',
        content_id: 'profile',
        content: profile,
        disposition: 'inline',
      },
    ];
  }
}
