import { readFileSync } from 'fs';
import { join } from 'path';
import { AttachmentJSON } from '@sendgrid/helpers/classes/attachment';
import BaseEmail from '../../model/base-email';

interface ApprovePaymentEmailContext {
    reference: string;
    name: string;
    to: string;
    createdAt: string;
}

const logoImage = readFileSync(join(__dirname, '../../templates/emails/operations/transactions/logo.png')).toString('base64');

export default class ApprovePaymentEmail extends BaseEmail<ApprovePaymentEmailContext> {
    constructor(context: ApprovePaymentEmailContext) {
        super(
            context.to,
            `${LUX_BRAND.name} <${LUX_BRAND.jurisdiction.contact.email}>`,
            'Transaction approved',
            'emails/operations/transactions/approved',
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
