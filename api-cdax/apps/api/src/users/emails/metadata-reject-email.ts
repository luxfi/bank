import { AttachmentJSON } from '@sendgrid/helpers/classes/attachment';
import { readFileSync } from 'fs';
import { join } from 'path';
import BaseEmail from '../../model/base-email';

interface MetadataEmailContext {
    requestTime: string;
    reason: string;
    userName: string;
    adminEmail: string;
    emailTo: string;
}

const logoImage = readFileSync(join(__dirname, 'templates/emails/registration/request-access/logo.png')).toString('base64');

export default class MetadataRejectEmail extends BaseEmail<MetadataEmailContext> {
    constructor(context: MetadataEmailContext) {
        super(
            context.emailTo, //to user
            'CDAX Forex <noreply@cdaxforex.com',
            'User requested to update his metadata',
            'emails/registration/update-reject/meta',
            context,
            undefined,
            undefined
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
