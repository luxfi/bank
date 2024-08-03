import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Patch, Post, Query, Request, Res, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { SuccessResponse } from '@luxbank/tools-misc';
import { ManagerRoles, SelectUsersDto, UserV2Dto } from '@luxbank/tools-models';
import { Roles } from '../auth/roles.decorator';
import { DocumentsManagerService } from '../documents-manager/documents-manager.service';
import { UsersService } from './users.service';
import { SkipAccountSetup } from '../auth/skip-account-setup.decorator';

@ApiTags('Users v2')
@Controller({ path: 'users', version: '2' })
@Throttle({default:{limit:100, ttl:60}})
@ApiBearerAuth()
export class UsersV2Controller {
    constructor(
        private readonly usersService: UsersService,
        private readonly documentsService: DocumentsManagerService
    ) { }

    @UseInterceptors(FileInterceptor('file'))
    @Post('current/profile-image')
    async uploadDocument(@UploadedFile() file: Express.Multer.File, @Request() req) {
        if (!file)
            throw new BadRequestException();
        
        const profileImage = await this.documentsService.uploadImage(req.user, file);
        const user = await this.usersService.updateUsers(req.user.uuid, {profileImage});

        return new SuccessResponse(user);
    }

    @Get('current')
    @SkipAccountSetup()
    profile(@Request() req) {
        return new SuccessResponse({
            uuid: req.user.uuid,
            firstName: req.user.firstname,
            lastName: req.user.lastname,
            email: req.user.username,
            role: req.user.role,
            mobileNumber: req.user.serialize().contact?.mobileNumber,
            entityType: req.user.getCurrentClient()?.account?.entityType,
            country: req.user.serialize().contact?.country,
            profileImageUrl: req.user.serialize().profileImage,
            currentClient: {
                uuid: req.user.getCurrentClient().uuid,
                name: req.user.getCurrentClient().getAccountName()
            }
        });
    }

    @Patch('current')
    @SkipAccountSetup()
    @UsePipes(new ValidationPipe({ transform: true }))
    async updateCurrent(@Body() data: UserV2Dto, @Request() req) {
        const user = await this.usersService.updateUsers(req.user.uuid, data);

        return new SuccessResponse({
            uuid: user.uuid,
            firstName: user.firstname,
            lastName: user.lastname,
            mobileNumber: user.contact?.mobileNumber,
            country: user.contact?.country
        });
    }

    @Get('')
    async list(@Query(new ValidationPipe({ transform: true })) query: SelectUsersDto, @Request() req) {
        const [users, count] = await this.usersService.getAll(
            query.roles,
            query.page,
            query.limit,
            req.user.getCurrentClient(),
            query.status
        );

        return new SuccessResponse({
            users,
            count,
            page: query.page,
            limit: query.limit
        });
    }

    @Get(':uuid')
    @SkipAccountSetup()
    async fetch(@Param('uuid') uuid: string, @Request() req) {
        const user = await this.usersService.getUserMeta(uuid);
        const clientId = req.user.getCurrentClient().uuid;

        if (!user)
            throw new NotFoundException('User was not found.');

        if (!user?.clients.getItems().find((c) => c.uuid === clientId))
            throw new BadRequestException('User is not registered in this client.');

        return new SuccessResponse({
            uuid: user.uuid,
            email: user.username,
            role: user.getMetadataByClient(clientId)?.role,
            firstName: user.firstname,
            lastName: user.lastname,
            mobileNumber: user.contact?.mobileNumber,
            country: user.contact?.country,
            verified: !!user.verifiedAt
        });
    }

    @Patch(':uuid')
    @Roles(...ManagerRoles)
    async update(@Param('uuid') uuid: string, @Body() data: UserV2Dto, @Request() req) {
        const user = await this.usersService.getUserMeta(uuid);

        if (!user)
            throw new NotFoundException('User was not found.');

        if (!user?.clients.getItems().find((c) => c.uuid === req.user.getCurrentClient().uuid))
            throw new BadRequestException('User is not registered in this client.');

        const updateUser = await this.usersService.updateUsers(uuid, data);

        return new SuccessResponse({
            uuid: updateUser.uuid,
            firstName: updateUser.firstname,
            lastName: updateUser.lastname,
            mobileNumber: updateUser.contact?.mobileNumber,
            country: updateUser.contact?.country
        });
    }
}
