import {Body, Controller, Post, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { SuccessResponse } from '@luxbank/tools-misc';
import { MailContactService } from './mail-contact.service';
import { ContactUsDto, NewsLetterDto } from '@luxbank/tools-models';
import { Anonymous } from '../auth/anonymous.decorator';
import { RecaptchaGuard } from './recaptcha.guard';

@ApiTags('mail-contact')
@Controller('mail-contact')
@Throttle({default: {limit: 100, ttl: 60}})
export class MailContactController {
    constructor(private readonly mailContactService: MailContactService) { }

    @Post('cdax')
    @UseGuards(RecaptchaGuard)
    @Anonymous()
    @UsePipes(new ValidationPipe({ transform: true }))
    async contactUs(@Body() data: ContactUsDto) {
        await this.mailContactService.contactUs(data);

        return new SuccessResponse({ message: 'Email sent' });
    }

    @Post('news-letter')
    @UseGuards(RecaptchaGuard)
    @Anonymous()
    @UsePipes(new ValidationPipe({ transform: true }))
    async newsLetter(@Body() data: NewsLetterDto) {
        await this.mailContactService.newsLetter(data);

        return new SuccessResponse({ message: 'Subscribed' });
    }
}
