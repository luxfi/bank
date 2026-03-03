import { AttachmentJSON } from '@sendgrid/helpers/classes/attachment';
import { readFileSync } from 'fs';
import { join } from 'path';
import { LUX_BRAND } from '@luxbank/brand';
import BaseEmail from '../../model/base-email';

interface PasswordResetEmailContext {
    resetUrl: string;
}

const heroImage = readFileSync(join(__dirname, '../../templates/emails/registration/welcome/hero.gif')).toString('base64');

export default class PasswordResetEmail extends BaseEmail<PasswordResetEmailContext> {
    constructor(to: string, resetUrl: string) {
        super(
            to,
            `${LUX_BRAND.name} <${LUX_BRAND.jurisdiction.contact.email}>`,
            `${LUX_BRAND.name} password reset`,
            'emails/registration/forgot/forgot',
            {
                resetUrl
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
