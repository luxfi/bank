import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Query, Request, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { SuccessResponse } from '@luxbank/tools-misc';
import { AdminCreateUserDto, AdminRoles, LinkedUserDto, ManagerRoles, SelectUsersDto, User, UserRole, AdminCreateSuperUserDto, SelectUsersByClientDto } from '@luxbank/tools-models';
import { RealIP } from 'nestjs-real-ip';
import { Roles } from '../auth/roles.decorator';
import { SkipAccountSetup } from '../auth/skip-account-setup.decorator';
import { GetRequestDto } from '../bank/users/dto/get-users.request.dto';
import { UsersAdminService } from './users-admin.service';

@ApiTags('Admin')
@Controller('admin/users')
@Throttle({default: {limit: 100, ttl: 60}})
@ApiBearerAuth()
@SkipAccountSetup()
export class UsersAdminController {
    constructor(private readonly usersAdminService: UsersAdminService) { }

    @ApiOperation({ description: 'Use comma separated list for multiple roles' })
    @Roles(
        ...ManagerRoles,
        ...AdminRoles,
        UserRole.TeamMember,
        UserRole.ViewerUser
    )
    @Get('')
    async list(
        @Query(new ValidationPipe({ transform: true })) query: SelectUsersDto,
        @Request() req
    ) {
        const { roles, page, limit } = query;
        const [data, count] = await this.usersAdminService.getAll(
            roles,
            page,
            limit,
            req.user.getCurrentClient()?.account?.uuid
        );

        const users = Array.from(data).map((u) => {
            return {
                ...u.serialize(),
                role: u.getMetadataByClient(req?.user.getCurrentClient()?.uuid)?.role
            };
        }) as User[];

        return new SuccessResponse({ users, count, page, limit });
    }

    @Post('')
    @Roles(...ManagerRoles, ...AdminRoles)
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(@RealIP() ip: string, @Body() data: AdminCreateUserDto) {
        const user = await this.usersAdminService.createUser(
            data,
            ip,
            UserRole.SuperAdmin
        );
        return new SuccessResponse({ user });
    }

    @Post('link-user')
    @Roles(...ManagerRoles, ...AdminRoles)
    async linkUser(@Body() data: LinkedUserDto) {
        const user = await this.usersAdminService.createLinkedUser(data);
        return new SuccessResponse({ user });
    }

    @Delete('remove-link-user/:uuid/client/:client')
    @Roles(...ManagerRoles, ...AdminRoles)
    async removeLinkUser(
        @Param('uuid') uuid: string,
        @Param('client') client: string
    ) {
        const user = await this.usersAdminService.deleteUser(uuid, client);
        return new SuccessResponse({ user });
    }

    @Get(':uuid')
    @Roles(
        ...ManagerRoles,
        ...AdminRoles,
        UserRole.ViewerUser,
        UserRole.TeamMember
    )
    async fetch(@Param('uuid') uuid: string) {
        const user = await this.usersAdminService.get(uuid);
        if (!user)
            throw new NotFoundException('User was not found.');

        return new SuccessResponse({ user });
    }

    @ApiOperation({ description: 'Archives the user' })
    @Roles(...ManagerRoles, ...AdminRoles)
    @Delete(':uuid')
    async delete(@Request() req, @Param('uuid') uuid: string) {
        const user = await this.usersAdminService.get(uuid);
        if (!user)
            throw new NotFoundException('User was not found.');

        await this.usersAdminService.archiveUser(user);
        return new SuccessResponse({ user });
    }

    @Post(':uuid')
    @Roles(...ManagerRoles, ...AdminRoles)
    @UsePipes(new ValidationPipe({ transform: true }))
    async update(@Param('uuid') uuid: string, @Body() data: LinkedUserDto) {
        const user = await this.usersAdminService.updateLinkedUser(uuid, data);
        return new SuccessResponse({ user });
    }

    @Get(':username/exists')
    @Roles(...ManagerRoles, ...AdminRoles)
    async userExists(
        @Param('username') username: string,
        @Request() req,
        @Query() query: GetRequestDto
    ) {
        const user = await this.usersAdminService.getByUsername(username);

        if (user?.deletedAt)
            throw new BadRequestException('User was deleted by super admin! You can not use the same email.');

        if (user?.archivedAt)
            throw new BadRequestException('User was archived by super admin!');

        const metadata = user?.getMetadataByClient(query.clientId ?? req.user.getCurrentClient()?.uuid);

        user?.setRole(metadata?.role);

        if (!user)
            throw new NotFoundException('User was not found.');

        if (
            user.clients
                .getItems()
                .find(
                    (u) =>
                        u.uuid === (query.clientId ?? req.user.getCurrentClient()?.uuid)
                )
        ) {
            throw new BadRequestException('User already exists!');
        }

        return new SuccessResponse(user);
    }

    @Get('client/:clientUuid')
    async listUsersByClient(
        @Query(new ValidationPipe({ transform: true }))
        query: SelectUsersByClientDto,
        @Request() req,
        @Param('clientUuid') clientUuid: string
    ) {
        const { page, limit } = query;

        const [data, count] = await this.usersAdminService.findByClientUuid(
            clientUuid,
            query
        );

        const users = Array.from(data).map((u) => {
            return {
                ...u.serialize(),
                role: u.getMetadataByClient(clientUuid)?.role
            };
        }) as User[];

        return new SuccessResponse({ users, count, page, limit });
    }

    @Post('super/new')
    @UsePipes(new ValidationPipe({ transform: true }))
    async createNewSuperAdmin(@RealIP() ip: string, @Body() data: AdminCreateSuperUserDto) {
        const user = await this.usersAdminService.createSuperAdminUser(data);
        return new SuccessResponse(user);
    }
}
