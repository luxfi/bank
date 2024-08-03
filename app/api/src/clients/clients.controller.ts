import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Request, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { SuccessResponse, SuccessResponseV2 } from '@luxbank/tools-misc';
import { AdminRoles, UserRole, Client, CreateClientDto, UpdateClientDto } from '@luxbank/tools-models';
import { Roles } from '../auth/roles.decorator';
import { SkipAccountSetup } from '../auth/skip-account-setup.decorator';
import { ClientsService } from './clients.service';
import { GetClientSelectRequestDto } from './types/get-clients-select.request.dto';
import { ListClientSelectResponseDto } from './types/get-clients-select.response.dto';
import { GetRiskClientsRequest, GetRiskClientsRequestPaginated } from './types/get-risk-clients.request.dto';
import { ClientSelectRiskPaginatedResponse } from './types/get-risk-clients.response.dto';

@ApiTags('clients')
@ApiBearerAuth()
@Controller('clients')
export class ClientController {
    constructor(private readonly clientService: ClientsService) { }

    @Get('current')
    async getCurrent(@Request() req) {
        const client = await this.clientService.findByUuidWithMetadata(req.user.getCurrentClient().uuid);
        if (!client) 
            throw new BadRequestException('Client not found');

        if (client.account?.riskAssessments) {
            client.account?.riskAssessments
                .getItems()
                .forEach((riskAssessment: any) => {
                    delete riskAssessment.account;
                });
        }

        const owner = client.getOwner();

        return new SuccessResponse({
            client,
            ownerMetadata: {
                metadata: owner ? client.getMetadataByUser(owner.uuid) : '',
                firstName: owner ? owner.firstname : '',
                lastName: owner ? owner.lastname : '',
                name: owner ? owner.getFullName() : '',
                email: owner ? owner.username : ''
            },
            user: {
                uuid: req.user.uuid,
                firstName: req.user.firstname,
                lastName: req.user.lastname,
                email: req.user.username,
                role: req.user.role,
                country: req.user.serialize().contact?.country,
                mobileNumber: req.user.serialize().contact?.mobileNumber,
                entityType: req.user.getCurrentClient()?.account?.entityType,
                businessRole: req.user.serialize().contact?.businessRole ?? '',
                expectedValueOfTurnover: req.user.serialize().contact?.expectedValueOfTurnover ?? '',
                expectedVolumeOfTransactions: req.user.serialize().contact?.expectedVolumeOfTransactions ?? '',
                riskAssessment: client.account?.riskAssessments.getItems()[0],
                documents: client.documents.getItems() as any
            }
        });
    }

    @Post('')
    @Roles(UserRole.SuperAdmin)
    @ApiOperation({ summary: 'Create a new client' })
    @ApiResponse({ status: 201, description: 'The client has been successfully created.'})
    @ApiResponse({ status: 400, description: 'Bad request.' })
    async create(@Body() clientData: CreateClientDto): Promise<Client> {
        return this.clientService.createClient(Client.fromAdminDto(clientData));
    }

    @Get('select')
    @Throttle({default: {limit: 100, ttl: 60}})
    @SkipAccountSetup()
    @Roles(...AdminRoles)
    @ApiOperation({ summary: 'Get all clients to select' })
    @ApiResponse({ status: 200, description: 'Return all clients by name.' })
    async listSelect(@Query(new ValidationPipe({ transform: true })) query: GetClientSelectRequestDto): Promise<ListClientSelectResponseDto> {
        const { name } = query;
        const { data, pagination } = await this.clientService.getAllClientsSelect(name);
        return new SuccessResponseV2(data, pagination);
    }

    @Get('risk-assessments')
    @Throttle({default: {limit: 100, ttl: 60}})
    @ApiBearerAuth()
    @SkipAccountSetup()
    @Roles(...AdminRoles)
    @ApiOperation({ summary: 'Get all risk assessments for clients' })
    @ApiResponse({ status: 200, description: 'Return all risk assessments.' })
    async getAllRiskAssessments(@Query() params: GetRiskClientsRequest): Promise<ClientSelectRiskPaginatedResponse> {
        const { data, pagination } = await this.clientService.getAllRiscAssessmentClients(params);
        return new SuccessResponseV2(data, pagination);
    }

    @Get('risk-assessments/paginated')
    @Throttle({default: {limit: 100, ttl: 60}})
    @ApiBearerAuth()
    @SkipAccountSetup()
    @Roles(...AdminRoles)
    @ApiOperation({ summary: 'Get paginated risk assessments for clients' })
    @ApiResponse({status: 200, description: 'Return paginated risk assessments.',})
    async getPaginatedRiskAssessments(@Query() params: GetRiskClientsRequestPaginated): Promise<ClientSelectRiskPaginatedResponse> {
        const { data, pagination } = await this.clientService.getPaginatedRiskAssessments(params);
        return new SuccessResponseV2(data, pagination);
    }

    @Get('')
    @Throttle({default: {limit: 100, ttl: 60}})
    @ApiBearerAuth()
    @SkipAccountSetup()
    @Roles(...AdminRoles)
    @ApiOperation({ summary: 'Get all clients' })
    @ApiResponse({ status: 200, description: 'Return all clients.' })
    async list(@Query(new ValidationPipe({ transform: true })) query: any) {
        const { page, limit, name, entityType, country } = query;
        const [clients, count] = await this.clientService.getAllClients(name, entityType, country, page, limit);
        return new SuccessResponse({ clients, count });
    }

    @Get(':uuid')
    @ApiOperation({ summary: 'Get a client by uuid' })
    @ApiResponse({ status: 200, description: 'Return a single client.' })
    @ApiResponse({ status: 404, description: 'Client not found.' })
    async findOne(@Request() req, @Param('uuid') uuid: string) {
        const token = await this.clientService.getClientById(req.user, uuid);

        if (!token) 
            throw new BadRequestException('Client not found');

        return new SuccessResponse({user: req.user.serialize(), credentials: token});
    }

    @Put(':uuid')
    @Roles(UserRole.SuperAdmin)
    @ApiOperation({ summary: 'Update a client' })
    @ApiResponse({status: 200, description: 'The client has been successfully updated.'})
    @ApiResponse({ status: 404, description: 'Client not found.' })
    async update(@Param('uuid') uuid: string, @Body() clientData: UpdateClientDto): Promise<Client | null> {
        return this.clientService.updateClient(uuid, clientData);
    }

    @Post(':uuid/active')
    @Roles(UserRole.SuperAdmin)
    @ApiOperation({ summary: 'activate a disabled client' })
    @ApiResponse({status: 200, description: 'The client status has been successfully updated.'})
    @ApiResponse({ status: 404, description: 'Client not found.' })
    async activate(@Param('uuid') uuid: string): Promise<boolean> {
        return this.clientService.activeDeactivedClient(uuid);
    }

    @Delete(':uuid')
    @Roles(UserRole.SuperAdmin)
    @ApiOperation({ summary: 'Delete a client' })
    @ApiResponse({status: 200, description: 'The client has been successfully deleted.'})
    @ApiResponse({ status: 404, description: 'Client not found.' })
    async remove(@Param('uuid') uuid: string): Promise<void> {
        await this.clientService.deleteClient(uuid);
    }
}
