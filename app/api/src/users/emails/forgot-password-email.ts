import { AttachmentJSON } from '@sendgrid/helpers/classes/attachment';
import { readFileSync } from 'fs';
import { join } from 'path';
import BaseEmail from '../../model/base-email';

interface ForgotPasswordEmailContext {
    password: string;
}

const heroImage = readFileSync(join(__dirname, '../../templates/emails/registration/welcome/hero.gif')).toString('base64');

export default class ForgotPasswordEmail extends BaseEmail<ForgotPasswordEmailContext> {
    constructor(to: string, password: string) {
        super(
            to,
            'CDAX Forex <noreply@cdaxforex.com>',
            'CDAX Forex forgot password',
            'emails/registration/forgot/forgot',
            {
                password
            }
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
            }
        ];
    }
}
