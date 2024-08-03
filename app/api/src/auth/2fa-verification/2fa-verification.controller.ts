import { Body, Controller, ForbiddenException, Headers, Logger, Post, Request, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { RealIP } from 'nestjs-real-ip';
import { SessionsService } from '../../sessions/sessions.service';
import { SuccessResponse, isDemoAccount } from '@luxbank/tools-misc';
import { AuthService } from '../auth.service';
import { TwoFaCodeCheckDto, TwoFaCodeDto } from '../model/2fa-verification.dto';
import { TwoFaVerificationService } from './2fa-verification.service';
import { instanceToPlain } from 'class-transformer';
import { UsersService } from '../../users/users.service';
import { User } from '@luxbank/tools-models';

@ApiTags('Authentication')
@Controller('2fa/verification')
@Throttle({default: {limit: 10, ttl: 60}})
@UsePipes(new ValidationPipe({ transform: true }))
export class TwoFaVerificationController {
    private readonly logger = new Logger(TwoFaVerificationController.name);
    constructor(
        private readonly twoFaVerificationService: TwoFaVerificationService,
        private readonly authSevice: AuthService,
        private readonly sessionsService: SessionsService,
        private readonly userService: UsersService
    ) { }

    @ApiBearerAuth()
    @Post('send')
    async send(@Body() { provider }: TwoFaCodeDto, @Request() req) {
        const notVerifiedError = new ForbiddenException(`couldn't be verified, please try later.`);

        if (provider === 'sms' && !req.user?.contact?.mobileNumber)
            throw new ForbiddenException(`User doesn't have mobile number.`);

        try {
            const verified = await this.twoFaVerificationService.sendVerification(
                provider === 'email' ? req.user.username : req.user.contact.mobileNumber,
                provider
            );

            if (!verified)
                throw notVerifiedError;

            return new SuccessResponse({verified});
        } 
        catch (err) {
            this.logger.error(err);
            throw notVerifiedError;
        }
    }

    @ApiBearerAuth()
    @Post('check')
    async check(@Request() req, @RealIP() ip: string, @Body() { provider, code }: TwoFaCodeCheckDto, @Headers('User-Agent') userAgent: string) {
        const notVerifiedError = new ForbiddenException(`Code couldn't be verified.`);

        if (!req.user.getCurrentClient())
            throw new ForbiddenException(`User doesn't have a client.`);

        let impersonatedByUser: User | null = null;

        if (req.user.personatedBy)
            impersonatedByUser = await this.userService.getUserMeta(req.user.personatedBy);

        let verified = (process.env.NODE_ENV === 'development' || isDemoAccount(req.user.getCurrentClient().uuid)) && process.env.BYPASS_2FA === code;

        if (!verified && provider === 'sms' && !req.user?.contact?.mobileNumber)
            throw new ForbiddenException(`User doesn't have mobile number.`);

        try {
            if (!verified) {
                if (impersonatedByUser) {
                    verified = await this.twoFaVerificationService.checkVerification(
                        provider === 'email' ? (impersonatedByUser.username as string) : (impersonatedByUser?.contact?.mobileNumber as string),
                        code
                    );
                } else {
                    verified = await this.twoFaVerificationService.checkVerification(
                        provider === 'email' ? req.user.username : req.user.contact.mobileNumber,
                        code
                    );
                }
            }

            if (!verified)
                throw notVerifiedError;

            if (!req.user.verifiedAt)
                await this.userService.updateVerified(req.user.uuid, new Date());

            const credentials = await this.authSevice.login(req.user, true);

            return new SuccessResponse({
                user: Object.assign(
                    req.user.serialize(),
                    instanceToPlain(req.user, {
                        enableCircularCheck: true,
                        excludeExtraneousValues: true
                    })
                ),
                credentials,
                verified: true
            });
        } 
        catch (err) {
            throw notVerifiedError;
        }
    }
}
