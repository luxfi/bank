import { AttachmentJSON } from '@sendgrid/helpers/classes/attachment';
import dayjs from 'dayjs';
import { readFileSync } from 'fs';
import { join } from 'path';
import BaseEmail from '../../model/base-email';
import { RequestAccessDto } from '@cdaxfx/tools-models';

const logoImage = readFileSync(join(__dirname, 'templates/emails/registration/request-access/logo.png')).toString('base64');

interface RequestAccessEmailContext {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    sendAt: string;
}

export default class RequestAccessEmail extends BaseEmail<RequestAccessEmailContext> {
    constructor(request: RequestAccessDto) {
        super(
            `${process.env.BACKOFFICE_EMAIL ?? request.email}`,
            'CDAX Forex <noreply@cdaxforex.com>',
            'CDAX Forex Registration Request',
            'emails/registration/request-access/request',
            {
                firstName: request.firstname,
                lastName: request.lastname,
                email: request.email,
                phoneNumber: request.mobileNumber,
                sendAt: dayjs().format('HH:mm a')
            }
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
