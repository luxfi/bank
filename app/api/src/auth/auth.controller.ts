import { BadRequestException, Body, Controller, Headers, Logger, Post, Res, UnauthorizedException, UseGuards, UsePipes, ValidationPipe, Request, NotFoundException} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { RealIP } from 'nestjs-real-ip';
import { SessionsService } from '../sessions/sessions.service';
import { generatePassword, SuccessResponse, isDemoAccount } from '@luxbank/tools-misc';
import { TwoFaVerificationService } from './2fa-verification/2fa-verification.service';
import { Anonymous } from './anonymous.decorator';
import { AuthService } from './auth.service';
import { ForgotDto, LoginDto } from './model/login.dto';
import { RecaptchaGuard } from './recaptcha.guard';
import { Roles } from './roles.decorator';
import { UserRole } from '@luxbank/tools-models';
import { ImpersonateDto } from './model/impersonate.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(
        private readonly authService: AuthService,
        private readonly sessionsService: SessionsService,
        private readonly twoFaVerificationService: TwoFaVerificationService,
    ) { }

    @Throttle({default: {limit: 10, ttl: 60}})
    @Post('login')
    @UseGuards(RecaptchaGuard)
    @Anonymous()
    @UsePipes(new ValidationPipe({ transform: true }))
    async login(
        @Headers('User-Agent') userAgent: string,
        @Res({ passthrough: true }) res: Response,
        @RealIP() ip: string,
        @Body() dto: LoginDto
    ) {
        const user = await this.authService.validateUser(dto.username, dto.password);

        if (!user) {
            this.logAndCreateSession('fail', dto.username, ip, userAgent);
            throw new UnauthorizedException('Login failed, please check your email and password.');
        }

        const activeClient =
            user.clients.getItems().find((c) => c.account?.isApproved)?.uuid ||
            user.clients.getItems()[0]?.uuid;

        if (!activeClient)
            throw new UnauthorizedException('User does not have an active client.');

        user.setCurrentClient(activeClient);
        const role = await this.authService.getRole(user.uuid, user.getCurrentClient()!.uuid);

        user.setRole(role);

        if (user.role !== UserRole.SuperAdmin && !user.getCurrentClient()?.account?.isApproved)
            throw new UnauthorizedException('Account is not approved yet.');

        if (process.env.NODE_ENV !== 'development' && !isDemoAccount(user.getCurrentClient()!.uuid))
            await this.twoFaVerificationService.sendVerification(dto.username, 'email');

        const credentials = await this.authService.login(user, false);

        return new SuccessResponse({user: user, credentials});
    }

    @Throttle({default: {limit: 10, ttl: 60}})
    @Post('impersonate')
    @ApiBearerAuth()
    @Roles(UserRole.SuperAdmin)
    @UsePipes(new ValidationPipe({ transform: true }))
    async impersonate(@Request() req, @Body() dto: ImpersonateDto) {
        const user = await this.authService.findByUserByUuid(dto.userUuid);
        if (!user)
            throw new NotFoundException('Impersonate failed, user not found.');

        user.setCurrentClient(dto.clientUuid);

        const role = await this.authService.getRole(user.uuid, user.getCurrentClient()!.uuid);
        if (role !== UserRole.AdminUser)
            throw new BadRequestException('Impersonate failed, user is not admin.');

        user.setRole(role);
        user.setPersonated(req.user.uuid);

        if (process.env.NODE_ENV !== 'development')
            await this.twoFaVerificationService.sendVerification(req.user.username, 'email');

        const credentials = await this.authService.login(user, false, req.headers['authorization'].replace('Bearer ', ''));

        return new SuccessResponse({user: user, credentials});
    }

    private logAndCreateSession(type: string, username: string, ip: string, userAgent: string) {
        this.sessionsService.create({ ip, username, userAgent, type });
        if (type === 'fail')
            this.logger.error(`Login failed: '${username}' was not found.`);
    }

    private logSession(type: string, username: string, ip: string, userAgent: string) {
        this.sessionsService.create({ ip, username, userAgent, type });
    }

    @Post('forgot-password')
    @Throttle({default: {limit: 3, ttl: 60}})
    @Anonymous()
    @UsePipes(new ValidationPipe({ transform: true }))
    async forgotPassword(@Res({ passthrough: true }) res: Response, @Body() dto: ForgotDto) {
        const user = await this.authService.validateUserEmail(dto.email);
        if (!user) 
            throw new BadRequestException('The email is not registered.');
        const newPassword = generatePassword(10);
        await this.authService.setPassword(user, newPassword);
        return new SuccessResponse({ status: 'Success' });
    }
}
