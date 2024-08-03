import { GetUserDomainUseCase, GetUsersBySelectDomainUseCase, GetUsersDomainUseCase, UpdateUserDomainUseCase } from '../../use-cases';
import { Body, Controller, Get, Param, Patch, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { GetUser, SuccessResponse, SuccessResponseV2 } from '@luxbank/tools-misc';
import { AdminRoles, ManagerRoles, User, UserRoles } from '@luxbank/tools-models';
import { Roles } from '../../auth/roles.decorator';
import { GetRequestDto, GetUsersRequestDto, GetUsersSelectRequestDto } from './dto/get-users.request.dto';
import { EditUserDto } from './dto/edit-user.request.dto';
import { UserUpdateResponseDto } from './dto/edit-user.response.dto';
import { GetUserResponseDto } from './dto/get-user.response.dto';
import { ListUsersResponseDto, ListUsersSelectResponseDto } from './dto/get-users.response.dto';
import { CurrentUserResponseDto } from './dto/current.response.dto';

@ApiTags('Users v2.1')
@Controller({ path: 'users', version: '2.1' })
@Throttle({default: {limit: 100, ttl: 60}})
@ApiBearerAuth()
export class UsersController {
    constructor(
        private readonly getUsersDomainUseCase: GetUsersDomainUseCase,
        private readonly getUserDomainUseCase: GetUserDomainUseCase,
        private readonly updateUserDomainUseCase: UpdateUserDomainUseCase,
        private readonly getUsersBySelectDomainUseCase: GetUsersBySelectDomainUseCase
    ) { }

    @Get('current')
    @Roles(...UserRoles, ...AdminRoles)
    profile(@Request() req): SuccessResponse<CurrentUserResponseDto> {
        return new SuccessResponse({
            uuid: req.user.uuid,
            firstName: req.user.firstname,
            lastName: req.user.lastname,
            email: req.user.username,
            role: req.user.role,
            mobileNumber: req.user.serialize().contact?.mobileNumber,
            entityType: req.user.getCurrentClient()?.account?.entityType,
            country: req.user.serialize().contact?.country,
            currentClient: {
                uuid: req.user.getCurrentClient().uuid,
                name: req.user.getCurrentClient().getAccountName()
            }
        });
    }

    @Get('select')
    @Roles(...UserRoles, ...ManagerRoles, ...AdminRoles)
    async listSelect(@Query() query: GetUsersSelectRequestDto, @GetUser() user: User): Promise<ListUsersSelectResponseDto> {
        const { data, pagination } = await this.getUsersBySelectDomainUseCase.handle(query, user);
        return new SuccessResponseV2(data, pagination);
    }

    @Get('')
    @Roles(...UserRoles, ...ManagerRoles, ...AdminRoles)
    async list(@Query() query: GetUsersRequestDto, @GetUser() user: User): Promise<ListUsersResponseDto> {
        const { data, pagination } = await this.getUsersDomainUseCase.handle(query, user);
        return new SuccessResponseV2(data, pagination);
    }

    @Get(':id')
    @Roles(...UserRoles, ...ManagerRoles, ...AdminRoles)
    async fetch(@Param('id') id: string, @GetUser() user: User, @Query() query: GetRequestDto): Promise<GetUserResponseDto> {
        const result = await this.getUserDomainUseCase.handle({ id, clientId: query.clientId }, user);
        return new SuccessResponseV2(result);
    }

    @Patch(':id')
    @Roles(...ManagerRoles, ...AdminRoles)
    async update(@Param('id') id: string, @Body() data: EditUserDto, @GetUser() user: User): Promise<UserUpdateResponseDto> {
        const result = await this.updateUserDomainUseCase.handle({ id, ...data }, user);
        return new SuccessResponseV2(result);
    }
}
