import { AttachmentJSON } from '@sendgrid/helpers/classes/attachment';
import { readFileSync } from 'fs';
import { join } from 'path';
import BaseEmail from '../../model/base-email';

const heroImage = readFileSync(join(__dirname, '../../templates/emails/registration/welcome/hero.gif')).toString('base64');

const helpCenterImage = readFileSync(join(__dirname, '../../templates/emails/registration/welcome/help-centre-btn.gif')).toString('base64');

const icon1Image = readFileSync(join(__dirname, '../../templates/emails/registration/welcome/icon-1.gif')).toString('base64');

const termsDocument = readFileSync(join(__dirname, '../../templates/pdfs/terms_conditions.pdf')).toString('base64');

interface InvitationEmailContext {
    loginUrl: string;
}

interface InvitationData {
    account: string;
    firstname: string;
    lastname: string;
    email: string;
    mobileNumber: string;
}

export default class UserInvitationRoleAlreadyRegistered extends BaseEmail<InvitationEmailContext> {
    constructor(email: string, InvitationData: InvitationData) {
        super(
            email,
            'CDAX Forex <noreply@cdaxforex.com>',
            'Welcome to CDAX Forex',
            'emails/registration/user-invitation-role/invite-already-registered',
            {
                ...InvitationData,
                loginUrl: UserInvitationRoleAlreadyRegistered.getLoginUrl()
            }
        );
    }

    private static getLoginUrl(): string {
        const url = new URL('/login', process.env.FRONTEND_URL);
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
            },
            {
                filename: 'terms and conditions.pdf',
                type: 'application/pdf',
                content_id: 'terms',
                content: termsDocument
            }
        ];
    }
}
