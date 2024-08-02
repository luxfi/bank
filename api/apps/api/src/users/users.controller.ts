import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, Request, UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { GetUser, SuccessResponse } from '@cdaxfx/tools-misc';
import { AdminCreateUserDto, AdminInvitationDto, CreateAccountDto, ResetPasswordDto, User, UserDocumentsDto, UsersRepository, VerifyEmailDto } from '@cdaxfx/tools-models';
import { RealIP } from 'nestjs-real-ip';
import { Anonymous } from '../auth/anonymous.decorator';
import { AuthService } from '../auth/auth.service';
import { SkipAccountSetup } from '../auth/skip-account-setup.decorator';
import { InvitationsService } from './invitations.service';
import { RegistrationService } from './registration/registration.service';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
@Throttle({default:{limit:100, ttl:60}})
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly usersRepository: UsersRepository,
        private readonly registrationService: RegistrationService,
        private readonly authService: AuthService,
        private readonly invitationService: InvitationsService
    ) { }

    @UsePipes(new ValidationPipe({ transform: true }))
    @Post('')
    @Anonymous()
    async create(@RealIP() ip: string, @Body() data: CreateAccountDto) {
        const user = await this.registrationService.createWithAccount(data, ip);
        let credentials: { accessToken: string } | null = null;
        credentials = await this.authService.login(user, true);
        return new SuccessResponse({ user: user.serialize(), credentials });
    }

    @Post('invited')
    @Anonymous()
    async inviteFromAdmin(@Body() data: AdminInvitationDto) {
        console.log(data);
        
        const invitation = await this.invitationService.fetch(data.invitation);
        if (!invitation || invitation.isExpired() || !(await invitation.isSecretValid(data.code)))
            throw new BadRequestException('The invitation is not valid.');
        
        const user = await this.usersRepository.findOne({username: invitation.email, deletedAt: null});
        if (!user) 
            throw new BadRequestException('The invitation is invalid.');

        const result = await this.registrationService.resetPassword(
            user,
            {
                password: data.password,
                currentPassword: 'super',
                confirmPassword: data.confirmPassword
            },
            true
        );
        if (result) {
            this.invitationService.expire(invitation);
            return result;
        }
    }

    @ApiBearerAuth()
    @Get('current')
    @SkipAccountSetup()
    profile(@Request() req) {
        return new SuccessResponse({user: req.user.serialize()});
    }

    @ApiBearerAuth()
    @Get('current/client/:uuid')
    @SkipAccountSetup()
    @ApiOperation({ summary: 'Set current client' })
    @ApiResponse({status: 200, description: 'Return user with new current client.'})
    async selectCurrent(@Request() req, @Param('uuid') uuid: string): Promise<User> {
        return this.usersService.selectCurrent(req.user, uuid);
    }

    @ApiBearerAuth()
    @Get(':uuid')
    @SkipAccountSetup()
    async fetch(@Param('uuid') uuid: string, @Request() req) {
        if (req.user.uuid !== uuid)
            throw new UnauthorizedException('You have no access to the profile data');

        const user = await this.usersService.getUserMeta(uuid);
        if (!user)
            throw new NotFoundException('User was not found.');

        return new SuccessResponse({ user });
    }

    @ApiBearerAuth()
    @Post(':uuid')
    @UsePipes(new ValidationPipe({ transform: true }))
    async update(@Param('uuid') uuid: string, @Body() data: AdminCreateUserDto, @Request() req) {
        const client = await this.usersService.updateUser(req.user.uuid, data);
        if (!client)
            throw new NotFoundException('User was not found');
        
        return new SuccessResponse({ client });
    }

    @ApiBearerAuth()
    @Post('current/terms')
    @SkipAccountSetup()
    acceptTerms(@Request() req) {
        this.registrationService.acceptTerms(req.user);
        return new SuccessResponse({user: req.user.serialize()});
    }

    @ApiBearerAuth()
    @Post('current/metadata')
    @SkipAccountSetup()
    @UsePipes(new ValidationPipe({ transform: true }))
    async updateCurrentUser(@Request() req, @Body() data: any, @GetUser() _user: User) {
        const userToSave = <User>(await this.usersRepository.findByUuid(req.user.uuid));
        const exclude = data.afterRegistration ? true : false;
        if (exclude) {
            const pendingMetadata = await this.usersService.checkMetadataUpdate(userToSave, data);
            data.pendingMetadata = pendingMetadata;
        }

        const user = await this.registrationService.updateMetadata(
            userToSave,
            { ...data, clientId: data.clientId ?? req.user.getCurrentClient()?.uuid },
            _user,
            exclude
        );
        return new SuccessResponse({user});
    }

    @ApiBearerAuth()
    @Post('current/documents')
    @SkipAccountSetup()
    @UsePipes(new ValidationPipe({ transform: true }))
    async updateDocuments(@Request() req, @Body() data: UserDocumentsDto) {
        await this.registrationService.updateDocuments(req.user, data);
        return new SuccessResponse({user: req.user.serialize()});
    }

    @ApiBearerAuth()
    @Post('current/remove_documents')
    @SkipAccountSetup()
    @UsePipes(new ValidationPipe({ transform: true }))
    async removeDocuments(@Request() req, @Body() data: UserDocumentsDto) {
        await this.registrationService.removeDocuments(req.user, data);
        return new SuccessResponse({user: req.user.serialize()});
    }

    @ApiBearerAuth()
    @Get('current/documents')
    @SkipAccountSetup()
    async getDocuments(@Request() req) {
        const documents = await this.registrationService.getUserDocuments(req.user);
        return new SuccessResponse({documents});
    }

    @Post(':username/verify')
    @Anonymous()
    async verifyUser(@Param('username') username: string, @Body() data: VerifyEmailDto) {
        const user = await this.usersService.verifyEmail(username, data.code);
        return new SuccessResponse({ verified: true, user: user.serialize() });
    }

    @ApiBearerAuth()
    @Post('current/reset-password')
    @SkipAccountSetup()
    @UsePipes(new ValidationPipe({ transform: true }))
    async resetPassword(@Request() req, @Body() data: ResetPasswordDto) {
        const user: User = req.user;
        await this.registrationService.resetPassword(user, data);
        return new SuccessResponse({ status: 'Success', user: user.serialize() });
    }

    @ApiBearerAuth()
    @Post('prepare2FA')
    @SkipAccountSetup()
    async prepare2FA(@Request() req) {
        const twoFA = this.usersService.prepare2FA(req.user);
        return new SuccessResponse(twoFA);
    }

    @ApiBearerAuth()
    @Post('enable2FA')
    @SkipAccountSetup()
    async enable2FA(@Request() req, @Body() body) {
        const isCodeValid = await this.usersService.is2FAValid(req.user, body.token);
        if (!isCodeValid)
            throw new UnauthorizedException('Wrong authentication code');
        
        await this.usersService.enable2FA(req.user.id);
        return new SuccessResponse({ status: 'Success' });
    }

    @ApiBearerAuth()
    @Post('disable2FA')
    @SkipAccountSetup()
    async disable2FA(@Request() req, @Body() body) {
        const isCodeValid = await this.usersService.is2FAValid(req.user, body.token);
        if (!isCodeValid)
            throw new UnauthorizedException('Wrong authentication code');
        
        await this.usersService.disable2FA(req.user.id);
        return new SuccessResponse({ status: 'Success' });
    }
}
