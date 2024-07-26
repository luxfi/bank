import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Query, Request, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AxiosOAuthClient } from '@cdaxfx/ports-ifx';
import { GetUser, SuccessResponse } from '@cdaxfx/tools-misc';
import { AdminClientDto, AdminCreateUserDto, AdminResetPasswordDto, AdminRoles, CurrencyCloudDataDto, IfxLinkDataDto, ManagerRoles,
        RiskAssessmentDto, User, UserMetadataDto, UserMetadataRejectDto, UserRole } from '@cdaxfx/tools-models';
import { RealIP } from 'nestjs-real-ip';
import { UsersAdminService } from '../admin/users-admin.service';
import { Roles } from '../auth/roles.decorator';
import { SkipAccountSetup } from '../auth/skip-account-setup.decorator';
import { ClientsService } from '../clients/clients.service';
import { SearchUsersDto } from '../model/Search.dto';

@ApiTags('Admin')
@Controller('admin/clients')
@Throttle({default: {limit: 100, ttl: 60}})
@ApiBearerAuth()
@SkipAccountSetup()
@Roles(...AdminRoles)
export class ClientsAdminController {
    constructor(
        private readonly usersAdminService: UsersAdminService,
        private readonly clientService: ClientsService
    ) { }

    @Get('dashboard-info')
    async dashboardInfo() {
        const data = await this.usersAdminService.dashboardInfo();

        return new SuccessResponse(data);
    }

    @Get('')
    async list(@Query(new ValidationPipe({ transform: true })) query: SearchUsersDto) {
        const [clients, count] = await this.usersAdminService.getAllClients(query);
        return new SuccessResponse({ clients, count });
    }

    @Get('archived')
    async getArchivedUsers() {
        const users = await this.usersAdminService.getArchivedUsers();
        return new SuccessResponse({ users });
    }

    @Post(':uuid/restore')
    async restoreUser(@Param('uuid') uuid: string) {
        const user = await this.usersAdminService.restoreUser(uuid);
        return new SuccessResponse({ user });
    }

    // create a send welcome email endpoint
    @Post(':uuid/send-welcome-email')
    async sendWelcomeEmail(@Param('uuid') uuid: string) {
        await this.usersAdminService.sendWelcomeEmail(uuid);
        return new SuccessResponse({ message: 'Welcome email sent successfully' });
    }

    @Post('')
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(@RealIP() ip: string, @Body() data: AdminCreateUserDto, @Request() req) {
        const client = await this.usersAdminService.createUser(data, ip, UserRole.AdminUser);
        return new SuccessResponse({ client });
    }

    @Get(':uuid')
    async fetch(@Param('uuid') uuid: string, @Query() query) {
        const client = await this.usersAdminService.get(uuid);

        if (!client)
            throw new NotFoundException('User was not found.');

        if (query.client && client.contact) {
            client.setCurrentClient(query.client);

            const currentClient = client.getCurrentClient()!;
            client.contact.account = currentClient.account as any;

            client.contact.account.users = Array.from(currentClient.users).map(
                (u) => {
                    return {
                        ...u.serialize(),
                        role: u.getMetadataByClient(currentClient.uuid)?.role
                    };
                }
            ) as User[];
        }

        return new SuccessResponse({ client });
    }

    @ApiOperation({ description: 'Archives the client' })
    @Delete(':uuid')
    async delete(@Param('uuid') uuid: string) {
        const client = await this.usersAdminService.get(uuid);
        if (!client)
            throw new NotFoundException('Client was not found.');

        await this.usersAdminService.archiveUserAndAccount(client);
        return new SuccessResponse({ client });
    }

    @Post(':uuid/reset-password')
    @UsePipes(new ValidationPipe({ transform: true }))
    async resetPassword(@Param('uuid') uuid: string, @Body() data: AdminResetPasswordDto) {
        const client = await this.usersAdminService.get(uuid);
        if (!client)
            throw new NotFoundException('Client was not found.');
        
        const newClient = await this.usersAdminService.resetPassword(client, data);
        return new SuccessResponse({ client: newClient });
    }

    @Post(':uuid')
    @UsePipes(new ValidationPipe({ transform: true }))
    async update(@Param('uuid') uuid: string, @Body() data: AdminCreateUserDto) {
        const client = await this.usersAdminService.updateUser(uuid, data);
        return new SuccessResponse({ client });
    }

    @Post(':uuid/metadata')
    @Roles(...AdminRoles, UserRole.AdminUser)
    @UsePipes(new ValidationPipe({ transform: true }))
    async updateMetadata(@Param('uuid') uuid: string, @Body() data: UserMetadataDto, @GetUser() user: User) {
        const client = await this.usersAdminService.updateMetadataTemp(uuid, data, user);
        return new SuccessResponse({ client });
    }

    @Post(':uuid/metadata/temp')
    @Roles(...ManagerRoles, UserRole.AdminUser)
    @UsePipes(new ValidationPipe({ transform: true }))
    async updateMetadataTemp(@Param('uuid') uuid: string, @Body() data: UserMetadataDto, @GetUser() user: User) {
        const client = await this.usersAdminService.updateMetadataTempwithoutsave(uuid, data, user);
        return new SuccessResponse({ client });
    }

    @Get(':uuid/metadata')
    @Roles(UserRole.SuperAdmin, ...ManagerRoles)
    @ApiOperation({ summary: 'Get client metadata' })
    @ApiResponse({ status: 200, description: 'Return client metadata.' })
    @ApiResponse({ status: 404, description: 'Client not found.' })
    async getMetadata(@Param('uuid') uuid: string, @Query('session') session: string): Promise<any> {
        const data = await this.usersAdminService.getMetadataTemp(uuid, session);
        return new SuccessResponse(data);
    }

    @Post(':uuid/approve-temp-change/:tempId')
    @ApiOperation({ summary: 'Approve temporary change data' })
    @ApiResponse({
        status: 200,
        description: 'The temporary change data has been successfully approved.'
    })
    @ApiResponse({ status: 404, description: 'Client not found.' })
    async approveTempChange(@Param('uuid') uuid: string, @Param('tempId') tempId: string, @GetUser() user: User): Promise<any> {
        const data = await this.usersAdminService.approveMetadata(uuid, tempId, user);
        return new SuccessResponse(data);
    }

    @Post(':uuid/reject-temp-change/:tempId')
    @ApiOperation({ summary: 'Reject temporary change data' })
    @ApiResponse({status: 200, description: 'The temporary change data has been successfully rejected.'})
    @ApiResponse({ status: 404, description: 'Client not found.' })
    async rejectTempChange(@Param('uuid') uuid: string, @Param('tempId') tempId: string, @Body() data: UserMetadataRejectDto, @GetUser() user: User): Promise<any> {
        const result = await this.usersAdminService.rejectMetadata(uuid, tempId, data, user);
        return new SuccessResponse(result);
    }

    @Post(':uuid/currency-cloud-data')
    @UsePipes(new ValidationPipe({ transform: true }))
    async updateCurrencyCloudData(@Param('uuid') uuid: string, @Body() data: CurrencyCloudDataDto) {
        const client = await this.usersAdminService.updateCurrencyCloudData(uuid, data);
        return new SuccessResponse({ client });
    }

    @Post(':uuid/ifx-link-data')
    @UsePipes(new ValidationPipe({ transform: true }))
    async ifxLinkData(@Param('uuid') uuid: string, @Body() data: IfxLinkDataDto) {
        const coreIfxLinkData = new AxiosOAuthClient(uuid, data.credentials);
        const isValid = await coreIfxLinkData.isValidCredentials();
        if (isValid) {
            const client = await this.usersAdminService.updateIfxLinkData(uuid, data);
            return new SuccessResponse({ client });
        } else {
            throw new BadRequestException('Invalid credentials');
        }
    }

    @Post(':owner/document/:uuid/approve')
    async approveDocument(@Param('owner') owner: string, @Param('uuid') uuid: string) {
        const data = await this.usersAdminService.approveDocument(owner, uuid);
        if (data.data) 
            return new SuccessResponse({ document: data.data });
        else if (data.error) 
            throw new NotFoundException(data.error);
        else 
            throw new NotFoundException('Document not found');
    }

    @Post(':owner/document/:uuid/reject')
    async rejectDocument(@Param('owner') owner: string, @Param('uuid') uuid: string) {
        const data = await this.usersAdminService.rejectDocument(owner, uuid);
        if (data.data) 
            return new SuccessResponse({ document: data.data });
        else if (data.error) 
            throw new NotFoundException(data.error);
        else 
            throw new NotFoundException('Document not found');
    }

    @Get('info/:clientUuid')
    @ApiOkResponse({type: AdminClientDto})
    async getClientInfo(@Param('clientUuid') clientUuid: string): Promise<SuccessResponse<AdminClientDto>> {
        const client = await this.clientService.findByUuidWithRiskAssessments(clientUuid);
        if (!client)
            throw new NotFoundException('Client was not found.');

        if (!client?.account)
            throw new NotFoundException('Account was not found.');

        if (client.account?.riskAssessments) {
            client.account.riskAssessments
                .getItems()
                .forEach((riskAssessment: any) => {
                    delete riskAssessment.account;
                });
        }

        if (client.account?.directors) {
            client.account.directors.getItems().forEach((director: any) => {
                delete director.account;
            });
        }

        if (client.account?.brokers) {
            client.account.brokers.getItems().forEach((broker: any) => {
                delete broker.account;
            });
        }

        if (client.account?.shareholders) {
            client.account.shareholders.getItems().forEach((shareholder: any) => {
                delete shareholder.account;
            });
        }

        const AdminClientInfo: AdminClientDto = {
            accountUuid: client.account.uuid,
            individualMetadata: client.account.individualMetadata,
            businessMetadata: client.account.businessMetadata,
            bankMetadata: client.account.bankMetadata as any,
            riskAssessment: client.account.riskAssessments.getItems()[0],
            directors: client.account.directors.getItems(),
            shareholders: client.account.shareholders.getItems().map((data) => {
                const { individualMetadata, businessMetadata } = data;
                if (businessMetadata) {
                    return {
                        ...data,
                        fullName: businessMetadata.companyName,
                        companyType: businessMetadata.companyType,
                        previousAddress1: businessMetadata.previousOffice1,
                        previousAddress2: businessMetadata.previousOffice2,
                        country: businessMetadata.countryOfRegistration,
                        address1: businessMetadata.registeredOffice1,
                        address2: businessMetadata.registeredOffice2,
                        state: businessMetadata.registeredOffice1_state
                    };
                } else {
                    return {
                        ...data,
                        fullName: `${individualMetadata.firstname} ${individualMetadata.lastname}`,
                        address1: individualMetadata.addressLine1,
                        address2: individualMetadata.addressLine2,
                        previousAddress1: individualMetadata.previousAddressLine1,
                        previousAddress2: individualMetadata.previousAddressLine2,
                        nationality: individualMetadata.nationality,
                        country: individualMetadata.country,
                        occupation: individualMetadata.occupation,
                        dob: individualMetadata.dateOfBirth,
                        city: individualMetadata.city,
                        postcode: individualMetadata.postcode,
                        state: individualMetadata.state
                    };
                }
            }) as any,
            brokers: client.account.brokers.getItems(),
            linkedUsers: Array.from(client.users).map((u) => ({
                ...u.serialize(),
                verified: !!u.verifiedAt,
                role: u.getMetadataByClient(clientUuid)?.role
            })) as any,
            documents: client.documents.getItems() as any,
            linkedClient: client.account.gateway
        };

        return new SuccessResponse(AdminClientInfo);
    }

    @Post('risk-assessments/:clientUuid')
    async createRiskAssessment(@Param('clientUuid') clientUuid: string, @Body() data: RiskAssessmentDto) {
        const newRiskAssessment = await this.clientService.saveNewRiskAssessment(clientUuid, data);
        return new SuccessResponse(newRiskAssessment);
    }
}