import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '../../mailer/mailer.service';
import NotificationEmail from '../emails/notification';
import { ShuftiproDto } from '@cdaxfx/tools-models';
import dayjs from 'dayjs';

const EMAILS = process.env.NOTIFICATION_SHUFTIPRO?.split(',') || [];

@Injectable()
export class WebhooksShuftiproService {
    logger = new Logger(WebhooksShuftiproService.name);
    constructor(private readonly mailer: MailerService) { }

    async shuftiproNotification(data: ShuftiproDto) {
        this.logger.log(`:: Shuftipro Event :: ${JSON.stringify(data)}`);

        const emailsPromises = EMAILS.map((to) =>
            this.mailer.send(
                new NotificationEmail(to, {
                    reference: data.reference,
                    event: data.event,
                    createdAt: dayjs().format('YYYY-MM-DD HH:mm')
                })
            )
        );

        return Promise.all(emailsPromises);
    }
}
