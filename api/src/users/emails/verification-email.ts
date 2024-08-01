import { AttachmentJSON } from '@sendgrid/helpers/classes/attachment';
import { User } from '@cdaxfx/tools-models';
import { readFileSync } from 'fs';
import { join } from 'path';
import BaseEmail from '../../model/base-email';

interface VerificationEmailContext {
    fullName: string;
    code: string;
    activationUrl: string;
}

const heroImage = readFileSync(join(__dirname, '../../../templates/emails/registration/verification/hero.gif')).toString('base64');

const confirmButton = readFileSync(join(__dirname, '../../../templates/emails/registration/verification/confirm-email-btn.gif')).toString('base64');

export default class VerificationEmail extends BaseEmail<VerificationEmailContext> {
    constructor(to: string, user: User, code: string) {
        super(
            to,
            'CDAX Forex <noreply@cdaxforex.com>',
            'CDAX Forex email verification',
            'emails/registration/verification/verification',
            {
                fullName: user.firstname,
                code,
                activationUrl: VerificationEmail.getVerificationUrl(user.username, code)
            }
        );
    }

    private static getVerificationUrl(email: string, code: string): string {
        const url = new URL('/verify', process.env.FRONTEND_URL);
        url.search = `?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`;
        return url.toString();
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
                filename: 'confirm.gif',
                type: 'image/gif',
                content_id: 'confirm',
                content: confirmButton,
                disposition: 'inline'
            }
        ];
    }
}
