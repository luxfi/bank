import { AttachmentJSON } from '@sendgrid/helpers/classes/attachment';
import { readFileSync } from 'fs';
import { join } from 'path';
import { LUX_BRAND } from '@luxbank/brand';
import BaseEmail from '../../model/base-email';
import { Invitation } from '@luxbank/tools-models';

const heroImage = readFileSync(join(__dirname, '../../templates/emails/registration/invitation/hero.gif')).toString('base64');

interface InvitationEmailContext {
    invitationUrl: string;
}

export default class InvitationEmail extends BaseEmail<InvitationEmailContext> {
    constructor(invitation: Invitation, secret: string) {
        super(
            invitation.email,
            `${LUX_BRAND.name} <${LUX_BRAND.jurisdiction.contact.email}>`,
            `${LUX_BRAND.name} invitation`,
            'emails/registration/invitation/invitation',
            {
                invitationUrl: InvitationEmail.getInvitationUrl(invitation, secret)
            }
        );
    }

    private static getInvitationUrl(invitation: Invitation, secret: string): string {
        const url = new URL('/registration', process.env.FRONTEND_URL);
        url.search = `?invitation=${encodeURIComponent(invitation.uuid)}&code=${encodeURIComponent(secret)}`;
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
            }
        ];
    }
}
