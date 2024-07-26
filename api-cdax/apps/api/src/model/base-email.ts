import { AttachmentJSON } from '@sendgrid/helpers/classes/attachment';

export default class BaseEmail<T extends Record<string, any>> {
    constructor(
        public to: string,
        public readonly from: string = 'noreply@cdaxforex.com',
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
