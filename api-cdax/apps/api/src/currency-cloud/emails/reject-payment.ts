import { readFileSync } from 'fs';
import { join } from 'path';
import { AttachmentJSON } from '@sendgrid/helpers/classes/attachment';
import BaseEmail from '../../model/base-email';

interface RejectPaymentEmailContext {
    reference: string;
    name: string;
    to: string;
    description: string;
    email: string;
    createdAt: string;
}

const logoImage = readFileSync(join(__dirname, 'templates/emails/operations/transactions/logo.png')).toString('base64');

export default class RejectPaymentEmail extends BaseEmail<RejectPaymentEmailContext> {
    constructor(context: RejectPaymentEmailContext) {
        super(
            context.to,
            'CDAX Forex <noreply@cdaxforex.com>',
            'Transaction Deny',
            'emails/operations/transactions/rejected',
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
