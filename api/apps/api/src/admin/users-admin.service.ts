import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AccountType, AdminCreateUserDto, AdminResetPasswordDto, AdminRoles, Contact, CreateAccountDto, CurrencyCloudDataDto, LinkedUserDto, IfxLinkDataDto, 
        User, UserDocument, UserDocumentsRepository, UserMetadataDto, UserRole, UserRoles, UsersRepository, UserMetadataRejectDto, SelectUsersByClientDto,
        AdminCreateSuperUserDto } from '@cdaxfx/tools-models';
import { BeneficiaryManager } from '../beneficiaries/model/beneficiary.manager';
import { BeneficiariesService } from '../beneficiaries/services/beneficiaries.service';
import { MailerService } from '../mailer/mailer.service';
import { encrypt, EPaymentProvider, SUPER_CLIENT } from '@cdaxfx/tools-misc';
import AccountEmail from '../users/emails/account-email';
import { RegistrationService } from '../users/registration/registration.service';
import UserInvitationRole from '../users/emails/user-invitation';
import UserInvitationRoleAlreadyRegistered from '../users/emails/user-invitation-already-registered';
import { ClientsService } from '../clients/clients.service';
import { TransactionsService } from '../transactions/services/transactions.service';

@Injectable()
export class UsersAdminService {
    logger = new Logger(UsersAdminService.name);
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly registrationService: RegistrationService,
        private readonly beneficiariesService: BeneficiariesService,
        private readonly documentsRepository: UserDocumentsRepository,
        private readonly clientsService: ClientsService,
        private readonly mailer: MailerService,
        private readonly transactionsService: TransactionsService
    ) { }

    async get(uuid: string) {
        return this.usersRepository.findByUuid(uuid);
    }

    // session = 'details' | 'address' | 'employment'
    async getMetadataTemp(uuid: string, session: string) {
        return this.registrationService.getMetadataTemp(uuid, session);
    }

    async getAll(
        roles: UserRole[] = UserRoles,
        page = 1,
        limit = 200,
        uuid = ''
    ) {
        return this.usersRepository.findAndCountByRoles(roles, page, limit, uuid);
    }

    /** A client is a non-sub-account user */
    async getAllClients(query) {
        return this.usersRepository.findAndCountNonSubAccount(query);
    }

    async archiveUser(userToRemove: User) {
        const userAdminInClients = userToRemove.clients
            .getItems()
            .filter(
                (c) =>
                    c.getMetadataByUser(userToRemove.uuid)?.role === UserRole.AdminUser
            );

        for (const client of userAdminInClients) {
            const adminsInClient = client.userClients
                .getItems()
                .filter((uc) => uc.metadata.role === UserRole.AdminUser);

            if (adminsInClient.length <= 1)
                throw new BadRequestException('This user must be an admin in at least one client.');
        }

        userToRemove.archivedAt = new Date();

        return this.usersRepository.store(userToRemove);
    }

    async resetPassword(user: User, data: AdminResetPasswordDto) {
        if (data.newPassword != data.confirmPassword)
            throw new BadRequestException('The passwords do not match.');
        await user.setPassword(data.newPassword);
        await this.usersRepository.store(user);
        return user;
    }

    async archiveUserAndAccount(user: User) {
        user.archivedAt = new Date();

        if (user.contact?.account)
            user.contact.account.archivedAt = new Date();

        return this.usersRepository.store(user);
    }

    async sendWelcomeEmail(id: string) {
        const client = await this.clientsService.findByUuidWithMetadata(id);

        if (!client)
            throw new NotFoundException('Client was not found.');

        const user = client?.getOwner();

        if (!user)
            throw new NotFoundException('User was not found.');
        
        return this.registrationService.sendWelcomeEmail(user);
    }

    async createUser(data: AdminCreateUserDto, ip, role: UserRole) {
        if (!AdminRoles.includes(data.role)) {
            const user = await this.registrationService.createWithAccount(
                CreateAccountDto.fromAdminDto(data),
                ip,
                true,
                true
            );

            return user;
        }

        const user = new User();
        user.firstname = data.firstname || '';
        user.lastname = data.lastname || '';
        user.username = data.email;
        await user.setPassword(data.password);
        user.verifiedAt = new Date();

        await this.usersRepository.store(user);
        return user;
    }

    async createLinkedUser(data: LinkedUserDto) {
        let user = await this.usersRepository.findByUsername(data.email);

        const client = await this.clientsService.findByUuidWithMetadata(data.clientId);
        if (!client)
            throw new BadRequestException('Client was not found.');

        if (!client?.account)
            throw new BadRequestException('Client is not set up correctly account.');

        if (user) {
            if (user.clients.getItems().find((u) => u.uuid === data.clientId))
                throw new BadRequestException('User is already registered with this client.');
        } else {
            if (!data.password)
                throw new BadRequestException('Please provide a password for the new user.');
            
            user = new User();
            await user.setPassword(data.password);
        }

        if (user.contact) {
            user.contact.isSubAccount = true;
            user.contact.country = data.country;
            user.contact.mobileNumber = data.mobileNumber;
        } else {
            const contact = new Contact();
            contact.isSubAccount = true;
            contact.country = data.country;
            contact.mobileNumber = data.mobileNumber;
            user.contact = contact;
        }

        user.firstname = data.firstname;
        user.lastname = data.lastname;
        user.username = data.email;
        user.verifiedAt = new Date();

        const userclient = await this.clientsService.putUserOnClient(
            user,
            client,
            data.role as UserRole
        );
        await this.usersRepository.store(user);

        user.role = userclient.metadata.role;
        const accountName =
            client?.account.entityType === AccountType.Individual
                ? client?.account?.individualMetadata?.getName()
                : client?.account?.businessMetadata?.getName();

        const dataEmail = {
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            mobileNumber: data.mobileNumber,
            account: accountName || ''
        };

        if (data.password) {
            await this.mailer.send(
                new UserInvitationRole(data.email, {
                    ...dataEmail,
                    password: data.password
                })
            );
        } else {
            await this.mailer.send(new UserInvitationRoleAlreadyRegistered(data.email, dataEmail));
        }
        return user;
    }

    async deleteUser(uuid: string, clientId: string) {
        const user = await this.usersRepository.findOne(
            { uuid, deletedAt: null },
            {
                populate: ['clients']
            }
        );

        if (!user)
            throw new NotFoundException('User was not found.');

        const client = await this.clientsService.findByUuidWithMetadata(clientId);

        if (!client)
            throw new BadRequestException('Client was not found.');

        user.clients.remove(client);

        await this.usersRepository.getEntityManager().persistAndFlush(user);
        return user;
    }

    async updateUser(uuid: string, data: AdminCreateUserDto) {
        const user = await this.usersRepository.findByUuid(uuid);
        if (!user)
            throw new NotFoundException('User was not found.');

        user.firstname = data.firstname || user.firstname;
        user.lastname = data.lastname || user.lastname;
        user.username = data.email;

        if (data.password && data.password.length > 0)
            await user.setPassword(data.password);

        if (data.verifiedAt === 'no')
            user.verifiedAt = null;
        else
            user.verifiedAt = user.verifiedAt || new Date();

        if (user.contact) {
            user.contact.country = data.country;
            user.contact.mobileNumber = data.mobileNumber;
            user.contact.businessRole = data.businessRole;
        }

        await this.usersRepository.store(user);
        return user;
    }

    async updateLinkedUser(uuid: string, data: LinkedUserDto) {
        const user = await this.usersRepository.findByUuid(uuid);
        if (!user)
            throw new NotFoundException('User was not found.');

        user.firstname = data.firstname;
        user.lastname = data.lastname;
        user.username = data.email;

        if (data.password && data.password.length > 0)
            await user.setPassword(data.password);

        if (user.contact) {
            user.contact.country = data.country;
            user.contact.mobileNumber = data.mobileNumber;
        }

        await this.clientsService.updateRoleMetadata(
            user.uuid,
            data.clientId,
            data.role as UserRole
        );
        await this.usersRepository.store(user);
        return user;
    }

    async getByUsername(username: string): Promise<User | null> {
        return this.usersRepository.findByUsername(username);
    }

    async updateMetadataTempwithoutsave(
        uuid: string,
        data: UserMetadataDto,
        _user: User
    ) {
        const user = await this.get(uuid);
        if (!user)
            throw new NotFoundException('User was not found.');

        const updatedUser =
            await this.registrationService.updateMetadataTempwithoutsave(
                user,
                data,
                false,
                _user
            );
        return updatedUser;
    }

    async updateMetadataTemp(uuid: string, data: UserMetadataDto, _user: User) {
        const user = await this.get(uuid);
        if (!user)
            throw new NotFoundException('User was not found.');

        const updatedUser = await this.registrationService.updateMetadataTemp(
            user,
            data,
            false,
            _user
        );
        return updatedUser;
    }

    async rejectMetadata(
        uuid: string,
        tempId: string,
        data: UserMetadataRejectDto,
        _user: User
    ) {
        const user = await this.get(uuid);
        if (!user)
            throw new NotFoundException('User was not found.');

        const updatedUser = await this.registrationService.rejectMetadataTemp(
            tempId,
            data,
            user,
            _user
        );
        return updatedUser;
    }

    async approveMetadata(uuid: string, tempId: string, _user: User) {
        const user = await this.get(uuid);
        if (!user)
            throw new NotFoundException('User was not found.');

        const updatedUser = await this.registrationService.approveMetadataTemp(
            tempId,
            user,
            _user
        );
        return updatedUser;
    }

    async updateMetadata(uuid: string, data: UserMetadataDto, _user: User) {
        const user = await this.get(uuid);
        if (!user)
            throw new NotFoundException('User was not found.');

        const updatedUser = await this.registrationService.updateMetadata(
            user,
            data,
            _user
        );
        return updatedUser;
    }

    async createSelfBeneficiary(user, gateway = 'open_payd') {
        try {
            const hasBeneficiaries = await this.beneficiariesService.hasActiveBeneficiaries(user);
            if (!hasBeneficiaries) {
                const userBeneficiary = BeneficiaryManager.createFromUser(user);
                if (userBeneficiary)
                    await this.beneficiariesService.create(userBeneficiary, user, true);
            } else {
                await this.beneficiariesService.migrateExistingBeneficiaries(user, gateway);
            }
        } catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }
    }

    async updateCurrencyCloudData(uuid: string, data: CurrencyCloudDataDto) {
        const user = await this.get(uuid);
        if (!user)
            throw new NotFoundException('User was not found.');

        user.setCurrentClient(data.clientId);
        const client = user.getCurrentClient()!;

        if (!client || !client.account)
            throw new BadRequestException('User is not set up correctly.');

        client.account.isApproved = true;
        client.account.gatewayId = data.contactId;
        client.account.gateway = EPaymentProvider.CURRENCY_CLOUD;
        client.account.cloudCurrencyId = data.contactId;
        client.account.credentials = null;

        this.mailer.send(
            new AccountEmail(user.username, {
                loginUrl: new URL('/login', process.env.FRONTEND_URL).toString(),
                fullName: user.getFullName()
            })
        );
        await this.usersRepository.store(user);
        return user;
    }

    async updateIfxLinkData(uuid: string, data: IfxLinkDataDto) {
        const user = await this.get(uuid);
        if (!user)
            throw new NotFoundException('User was not found.');

        user.setCurrentClient(data.clientId);
        const client = user.getCurrentClient()!;

        if (!client || !client.account)
            throw new BadRequestException('User is not set up correctly.');

        client.account.isApproved = true;
        client.account.gateway = EPaymentProvider.IFX;
        client.account.gatewayId = data.credentials.clientId;
        client.account.credentials = encrypt(JSON.stringify(data.credentials));

        this.mailer.send(
            new AccountEmail(user.username, {
                loginUrl: new URL('/login', process.env.FRONTEND_URL).toString(),
                fullName: user.getFullName()
            })
        );

        await this.usersRepository.store(user);

        return user;
    }

    async findUser(uuid: string) {
        return this.usersRepository.findOne({ uuid });
    }

    async ownDocument(owner: User, document: UserDocument) {
        return owner.documents.contains(document);
    }

    async findDocument(uuid: string) {
        return this.documentsRepository.findOne({ uuid });
    }

    async approveDocument(owner: string, uuid: string) {
        const user = await this.findUser(owner);
        const document = await this.findDocument(uuid);
        if (!user || !document) return { error: 'User or document not found.' };
        document.isApproved = true;
        document.status = 'approved';
        await this.documentsRepository.getEntityManager().persistAndFlush(document);
        return { data: document };
    }

    async rejectDocument(owner: string, uuid: string) {
        const user = await this.findUser(owner);
        const document = await this.findDocument(uuid);
        if (!user || !document) 
            return { error: 'User or document not found.' };
        document.isApproved = false;
        document.status = 'rejected';
        await this.documentsRepository.getEntityManager().persistAndFlush(document);
        return { data: document };
    }

    async getArchivedUsers() {
        return this.usersRepository
            .createQueryBuilder()
            .andWhere('archived_at IS NOT NULL')
            .execute();
    }

    async restoreUser(uuid: string) {
        const user = await this.usersRepository.findOne([{ uuid }]);
        if (!user || !user.archivedAt)
            throw new BadRequestException('The user does not exist or is currently active.');
        user.archivedAt = null;
        await this.usersRepository.store(user);
        return user;
    }

    async findByClientUuid(clientUuid: string, query: SelectUsersByClientDto) {
        return this.usersRepository.findUsersByClient(clientUuid, query);
    }

    async createSuperAdminUser(data: AdminCreateSuperUserDto) {
        const client = await this.clientsService.findByUuid(SUPER_CLIENT.UUID);
        if (!client)
            throw new BadRequestException('Client was not found.');

        const exist = await this.usersRepository.findByUsername(data.email);
        if (exist)
            throw new BadRequestException('User already exists.');

        const user = new User();
        user.firstname = data.firstname;
        user.lastname = data.lastname;
        user.username = data.email;
        await user.setPassword(data.password);
        user.verifiedAt = new Date();

        user.contact = new Contact();
        user.contact.country = data.country;
        user.contact.mobileNumber = data.phone;

        await this.clientsService.putUserOnClient(
            user,
            client,
            UserRole.SuperAdmin
        );

        await this.usersRepository.store(user);

        return user;
    }

    async dashboardInfo() {
        const [
            beneficiariesPending,
            clientsForApproval,
            riskAssessmentPending,
            lastTransactionsIn30Days
        ] = await Promise.all([
            this.beneficiariesService.beneficiariesPending(),
            this.clientsService.requestsForApproval(),
            this.clientsService.riskAssessmentPending(),
            this.transactionsService.lastTransactionsIn30Days()
        ]);
        return {
            beneficiariesPending,
            clientsForApproval,
            riskAssessmentPending,
            lastTransactionsIn30Days
        };
    }
}