import { AttachmentJSON } from '@sendgrid/helpers/classes/attachment';
import { LUX_BRAND } from '@luxbank/brand';

// Default email address from brand configuration
const DEFAULT_FROM_EMAIL = LUX_BRAND.jurisdiction.contact.email;

export default class BaseEmail<T extends Record<string, any>> {
    constructor(
        public to: string,
        public readonly from: string = DEFAULT_FROM_EMAIL,
        public readonly subject: string,
        public readonly template: string,
        public context: T,
        public cc?: string,
        public bcc?: string
    ) { }

    getAttachments(): AttachmentJSON[] {
        return [];
    }
}
