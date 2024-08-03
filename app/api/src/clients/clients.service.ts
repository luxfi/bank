import { Injectable, NotFoundException } from '@nestjs/common';
import { RiskAssessmentDto, User, UserClient, UserClientMetadata, UserClientsRepository, UserRole, Client, ClientSelectPaginatedResponse, ClientsRepository } from '@cdaxfx/tools-models';
import { AuthService } from '../auth/auth.service';
import { ClientSelectRiskPaginatedResponse } from './types/get-risk-clients.response.dto';
import { GetRiskClientsRequestPaginated } from './types/get-risk-clients.request.dto';

@Injectable()
export class ClientsService {
    constructor(
        private readonly clientsRepository: ClientsRepository,
        private readonly userClientsRepository: UserClientsRepository,
        private readonly authService: AuthService,
    ) { }

    async createClient(data: Client, user?: User, role?: UserRole, phone?: string, whoTheyAre?: string): Promise<Client> {
        const client = this.clientsRepository.create(data);
        if (!!user) {
            this.putUserOnClient(
                user,
                client,
                role ?? UserRole.AdminUser,
                phone,
                whoTheyAre
            );
        }

        await this.clientsRepository.getEntityManager().persistAndFlush(client);
        return client;
    }

    async putUserOnClient(user: User, client: Client, role: UserRole, phoneNumber = '', whoTheyAre = ''): Promise<UserClient> {
        const userClient = this.userClientsRepository.create({
            user,
            client,
            metadata: { role, phoneNumber, whoTheyAre }
        });
        await this.userClientsRepository.getEntityManager().persistAndFlush(userClient);
        return userClient;
    }

    async updateRoleMetadata(userUUID: string, clientUUID: string, role: UserRole): Promise<UserClient> {
        const userClient = await this.userClientsRepository.findByUserAndClientUuid(userUUID, clientUUID);
        if (!userClient)
            throw new Error('UserClient not found');

        const metadata = userClient.metadata || new UserClientMetadata();
        this.userClientsRepository.assign(userClient, {metadata: { ...metadata, role }});
        await this.userClientsRepository.getEntityManager().flush();
        return userClient;
    }

    async getMetadata(userUUID: string, clientUUID: string): Promise<UserClient | null> {
        return this.userClientsRepository.findByUserAndClientUuid(userUUID, clientUUID);
    }

    async getClientById(user: User, uuid: string): Promise<{ accessToken: string } | null> {
        const client = await this.clientsRepository.findOne({ uuid });
        if (!client) 
            return null;

        user.setCurrentClient(client.uuid);
        const role = await this.authService.getRole(user.uuid, client.uuid);
        user.setRole(role);
        return this.authService.login(user, true);
    }

    async getAllClientsSelect(name?: string): Promise<ClientSelectPaginatedResponse> {
        return this.clientsRepository.findALlBySelect(name ?? '');
    }

    async getPaginatedRiskAssessments(params: GetRiskClientsRequestPaginated): Promise<ClientSelectRiskPaginatedResponse> {
        return this.clientsRepository.findAllWithRiskAssessmentsPaginated(params);
    }

    async getAllRiscAssessmentClients(params: {page: number; limit: number}): Promise<ClientSelectRiskPaginatedResponse> {
        return this.clientsRepository.findAllWithRiskAssessments(params);
    }

    async getAllClients(name = '', entityType = '', country = '', page = 1, limit = 200) {
        return this.clientsRepository.findAndCountNonSubAccount(name, entityType, country, page, limit);
    }

    async updateClient(uuid: string, updateData: Partial<Client>): Promise<Client | null> {
        const client = await this.clientsRepository.findOne({ uuid });
        if (!client) 
            return null;

        this.clientsRepository.assign(client, updateData);
        await this.clientsRepository.getEntityManager().flush();
        return client;
    }

    async activeDeactivedClient(uuid: string): Promise<boolean> {
        const client = await this.clientsRepository.findOne({ uuid });
        if (!client) 
            return false;

        await this.clientsRepository.assign(client, {deletedAt: null, updatedAt: new Date()});
        await this.clientsRepository.getEntityManager().flush();
        return true;
    }

    async saveNewRiskAssessment(uuid: string, data: RiskAssessmentDto) {
        const client = await this.clientsRepository.findOne(
            { uuid },
            {
                populate: ['account.riskAssessments']
            }
        );

        if (!client)
            throw new NotFoundException('Client not found');

        if (!client.account)
            throw new NotFoundException('Account not found');

        const riskAssessment = await client.account.setNewRiskAssessments(data);

        await this.clientsRepository.getEntityManager().flush();

        return riskAssessment;
    }

    async deleteClient(uuid: string): Promise<boolean> {
        const client = await this.clientsRepository.findOne({ uuid });
        if (!client) 
            return false;

        await this.clientsRepository.assign(client, { deletedAt: new Date() });
        await this.clientsRepository.getEntityManager().flush();
        return true;
    }

    async findByUuidWithMetadata(uuid: string) {
        return this.clientsRepository.findByUuidWithMetadata(uuid);
    }

    async findByUuidWithRiskAssessments(uuid: string) {
        return this.clientsRepository.findByUuidWithRiskAssessments(uuid);
    }

    async findByUuid(uuid: string) {
        return this.clientsRepository.findByUuid(uuid);
    }

    async requestsForApproval() {
        return this.clientsRepository.requestsForApproval();
    }

    async riskAssessmentPending() {
        return this.clientsRepository.riskAssessmentPending();
    }
}