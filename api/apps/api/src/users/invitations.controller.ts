import { Body, Controller, Get, Param, Post, Request, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { SuccessResponse } from '@cdaxfx/tools-misc';
import { InvitationDto, RequestAccessDto, UserRole, ManagerRoles, InviteUserRolesDto } from '@cdaxfx/tools-models';
import { Anonymous } from '../auth/anonymous.decorator';
import { Roles } from '../auth/roles.decorator';
import { InvitationsService } from './invitations.service';

@ApiTags('Users')
@Controller('invitations')
@Throttle({default: {limit: 10, ttl: 60}})
export class InvitationsController {
    constructor(private readonly invitationsService: InvitationsService) { }

    @ApiBearerAuth()
    @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.SuperAdmin)
    @UsePipes(new ValidationPipe({ transform: true }))
    @Post('')
    async create(@Request() req, @Body() data: InvitationDto) {
        await this.invitationsService.create(data, req.user);
        return new SuccessResponse({});
    }

    @Anonymous()
    @UsePipes(new ValidationPipe({ transform: true }))
    @Post('access')
    async requestAccess(@Request() req, @Body() data: RequestAccessDto) {
        await this.invitationsService.requestAccess(data);
        return new SuccessResponse({});
    }

    @Get(':uuid')
    @Anonymous()
    async fetch(@Param('uuid') uuid: string) {
        const invitation = await this.invitationsService.fetch(uuid);
        return new SuccessResponse({
            invitation: {
                firstname: invitation.firstname,
                lastname: invitation.lastname,
                email: invitation.email,
                entityType: invitation.account.entityType
            }
        });
    }

    @Post('user-role')
    @Roles(...ManagerRoles)
    @UsePipes(new ValidationPipe({ transform: true }))
    async inviteUserRole(@Request() req, @Body() data: InviteUserRolesDto) {
        const user = await this.invitationsService.createInviteUser(data, req.user);
        return new SuccessResponse({ user });
    }
}
