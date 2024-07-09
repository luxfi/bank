import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '../mailer/mailer.service';
import ContactUsEmail from './emails/contact-us';
import { ContactUsDto } from '@tools/models';
import * as dayjs from 'dayjs';
import { NewsLetterDto } from '@tools/models/mail-contact/dtos/news-letter.dto';
import { NewsLetterRepository } from '@tools/models/mail-contact/repository';
import { NewsLetter } from '@tools/models/mail-contact/entities';

const backoffice = process.env.BACKOFFICE_EMAIL;

@Injectable()
export class MailContactService {
  logger = new Logger(MailContactService.name);
  constructor(
    private readonly mailer: MailerService,
    private readonly newsLetterRepository: NewsLetterRepository,
  ) {}

  async contactUs(data: ContactUsDto) {
    this.logger.log(`:: ContactUs :: ${JSON.stringify(data)}`);

    return this.mailer.send(
      new ContactUsEmail(backoffice, {
        name: data.name,
        email: data.email,
        message: data.message,
        createdAt: dayjs().format('YYYY-MM-DD HH:mm'),
      }),
    );
  }

  async newsLetter(data: NewsLetterDto) {
    this.logger.log(`:: NewsLetter :: ${JSON.stringify(data)}`);

    const existNewsLetter = await this.newsLetterRepository.findOne({
      email: data.email,
    });

    if (existNewsLetter) {
      return existNewsLetter;
    }

    const newsLetter = new NewsLetter();
    newsLetter.email = data.email;
    newsLetter.first_name = data.firstName;
    newsLetter.last_name = data.lastName;
    await this.newsLetterRepository.persistAndFlush(newsLetter);
  }
}
