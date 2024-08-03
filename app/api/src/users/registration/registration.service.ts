import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { snakeToWords } from '@luxbank/tools-misc';
import { Account, AccountType, BankMetadataDto, BusinessMetadata, BusinessMetadataDto, ClientMetadataTemp, CreateAccountDto, IndividualMetadata, MetadataTemp, PaymentType, 
    ResetPasswordDto, User, UserClientsRepository, UserDocument, UserDocumentsDto, UserDocumentsRepository, UserMetadataDto, UserMetadataRejectDto, UserRole, Client } from '@luxbank/tools-models';
import { ClientsService } from '../../clients/clients.service';
import { DocumentsManagerService } from '../../documents-manager/documents-manager.service';
import { MailerService } from '../../mailer/mailer.service';
import { SwiftCodeService } from '../../swift-code/swift-code.service';
import MetadataConfirmEmail from '../emails/metadata-confirm-email';
import MetadataRejectEmail from '../emails/metadata-reject-email';
import MetadataUpdateEmail from '../emails/metadata-update-email';
import WelcomeEmail from '../emails/welcome-email';
import { UsersService } from '../users.service';

@Injectable()
export class RegistrationService {
    logger: Logger = new Logger(RegistrationService.name);

    constructor(
        private readonly usersService: UsersService,
        private readonly mailer: MailerService,
        private readonly documents: DocumentsManagerService,
        private readonly userDocumentsRepository: UserDocumentsRepository,
        private readonly swiftCodeService: SwiftCodeService,
        private readonly clientService: ClientsService,
        private readonly clientsmetadataTemp: ClientMetadataTemp,
        private readonly userClientsRepository: UserClientsRepository
    ) { }

    async createWithAccount(data: CreateAccountDto, ip: string, skipMobileVerification = false, skipWelcomeEmail = false): Promise<User> {
        const existingUser = await this.usersService.getByUsername(data.email);
        const user = await User.withContactFromDto(data, existingUser);

        const contact = user.contact!;

        const account = new Account();
        account.entityType = data.entityType;
        contact.country = data.country;

        user.ip = ip;

        const client = Client.fromUser(user, account);

        if (data.entityType === 'business') {
            const businessMetadata = new BusinessMetadata();
            businessMetadata.companyType = data.companyType;
            businessMetadata.countryOfRegistration = data.country;
            businessMetadata.email = data.email;
            businessMetadata.telephoneNumber = data.mobileNumber;
            businessMetadata.companyName = data.companyName ?? '';
            client.setBusinessMetadata(businessMetadata);
        } 
        else {
            const individualMetadata = new IndividualMetadata();
            individualMetadata.firstname = data.firstname ?? '';
            individualMetadata.lastname = data.lastname ?? '';
            individualMetadata.country = data.country;

            await client.setIndividualMetadata(individualMetadata);
        }

        await this.clientService.createClient(client, user, UserRole.AdminUser, data.mobileNumber, data.businessRole);

        await this.usersService.store(user);

        if (!skipWelcomeEmail)
            await this.mailer.send(new WelcomeEmail(user.username, { fullName: user.getFullName() }));
        
        return user;
    }

    async sendWelcomeEmail(user: User) {
        await this.mailer.send(new WelcomeEmail(user.username, { fullName: user.getFullName() }));
    }

    async validateBankMetadata(bankMetadata: BankMetadataDto, user: User) {
        const bankDetails = await this.swiftCodeService.getBankDetails(
            {
                IBAN: bankMetadata.IBAN,
                bicSwift: bankMetadata.bicSwift,
                firstname: 'Test',
                lastname: 'Test',
                entityType: AccountType.Individual,
                currency: bankMetadata.currency,
                paymentType: PaymentType.Regular,
                address: 'Test',
                city: 'Test',
                country: bankMetadata.bankCountry,
                companyName: '',
                bankCountry: bankMetadata.bankCountry,
                accountNumber: bankMetadata.accountNumber,
                sortCode: bankMetadata.sortCode,
                state: 'Test',
                postcode: 'Test'
            },
            user
        );

        if (!bankDetails || bankDetails.errors || bankDetails.bankCountry !== bankMetadata.bankCountry) {
            throw new BadRequestException(
                bankDetails.errors
                    ? Object.keys(bankDetails.errors)
                        .map((e) => snakeToWords(bankDetails.errors[e]) + '.')
                        .join(' ')
                    : 'Bank details could not be validated.'
            );
        }
    }

    async rejectMetadataTemp(tempId: string, data: UserMetadataRejectDto, user: User, _user: User) {
        const temp = await this.clientsmetadataTemp.findOne({ uuid: tempId });
        if (!temp)
            throw new BadRequestException('Metadata temp was not found.');

        await this.mailer.send(
            new MetadataRejectEmail({
                userName: _user.getFullName(),
                reason: data.reason,
                adminEmail: _user.username,
                emailTo: user.username,
                requestTime: new Date().toLocaleString()
            }),
        );
        await this.clientsmetadataTemp.getEntityManager().removeAndFlush(temp);
    }

    async approveMetadataTemp(tempId: string, user: User, loggedUser: User) {
        const temp = await this.clientsmetadataTemp.findOne({ uuid: tempId });
        if (!temp)
            throw new BadRequestException('Metadata temp was not found.');

        await this.updateMetadata(user, temp.detail as UserMetadataDto, loggedUser);
    }

    async updateMetadata(user: User, data: UserMetadataDto, loggedUser: User, exclude = false): Promise<User> {
        const client = await this.clientService.findByUuidWithMetadata(data.clientId);
        
        if (!client)
            throw new BadRequestException('Client was not found.');

        if (!client?.account)
            throw new BadRequestException('Client is not set up correctly account.');

        const contact = user.contact!;

        if (data.expectedValueOfTurnover)
            contact.expectedValueOfTurnover = data.expectedValueOfTurnover;

        if (data.expectedVolumeOfTransactions)
            contact.expectedVolumeOfTransactions = data.expectedVolumeOfTransactions;

        if (typeof data.bankMetadata !== 'undefined') {
            await this.validateBankMetadata(data.bankMetadata, user);
            !!client && (await client.setBankMetadata(data.bankMetadata));

            // if (client.account) {
            //   const beneficiaries = await (
            //     await client.account.beneficiaries.init()
            //   ).getItems();
            //   const beneficiary = beneficiaries.pop();

            //   if (beneficiary) {
            //     await BeneficiaryManager.updateFromUser(beneficiary, user);
            //     this.beneficiariesService.updateFromBankMetadata(beneficiary, user);
            //   }
            // }
        }

        if (typeof data.riskAssessment !== 'undefined')
            !!client && (await client.setRiskAssessment(data.riskAssessment));
        
        if (typeof data.brokers !== 'undefined')
            !!client && (await client.setBrokers(data.brokers));

        if (typeof data.directors !== 'undefined')
            !!client && (await client.setDirectors(data.directors));

        if (typeof data.shareholders !== 'undefined')
            !!client && (await client.setShareholders(data.shareholders));

        if (typeof data.fees !== 'undefined')
            !!client && (await client.account?.setFees(data.fees));

        contact.account = client.account as Account;

        if (data.partial) {
            await this.usersService.store(user);
            await this.sendConfirmEmail(data, user, loggedUser);
            return user;
        }

        if ((user.isSubAccount() || client.account?.entityType === AccountType.Individual) && typeof data.individualMetadata !== 'undefined') {
            !!client && (await client.setIndividualMetadata(data.individualMetadata, exclude));
        } 
        else {
            if (typeof data.businessMetadata !== 'undefined')
                !!client && (await client.setBusinessMetadata(this.normalizeBusinessMetadata(data.businessMetadata), exclude));
        }

        if (data.userClientsMetadataDto) {
            const owner = client.getOwner();

            if (!owner?.uuid)
                throw new BadRequestException('Owner was not found.');

            const uc = await this.userClientsRepository.findByUserAndClientUuid(owner.uuid, client.uuid);
            if (!uc)
                throw new BadRequestException('User client metadata was not found.');

            uc.metadata.phoneNumber = data.userClientsMetadataDto.phoneNumber;
            uc.metadata.whoTheyAre = data.userClientsMetadataDto.whoTheyAre;

            await this.userClientsRepository.getEntityManager().persistAndFlush(uc);
        }

        await this.usersService.store(user);
        await this.sendConfirmEmail(data, user, loggedUser);

        return user;
    }

    private normalizeBusinessMetadata(businessMetadata: any): BusinessMetadataDto {
        return {
            registeredOffice1_city: businessMetadata.city,
            registeredOffice1_state: businessMetadata.state,
            countryOfRegistration: businessMetadata.country,
            registeredOffice1_postcode: businessMetadata.postcode,
            address1: businessMetadata.addressLine1,
            address2: businessMetadata.addressLine2,
            mailingAddress: businessMetadata.mailingAddress,
            registeredOffice1: businessMetadata.registeredOffice1,
            registeredOffice2: businessMetadata.registeredOffice2,
            previousOffice1: businessMetadata.previousOffice1,
            previousOffice2: businessMetadata.previousOffice2,
            previousOffice3: businessMetadata.previousOffice3,
            principalPlace: businessMetadata.principalPlaceOfBusiness
        } as any;
    }

    private async sendConfirmEmail(data: UserMetadataDto, user: User, _user: User) {
        const temp = await this.clientsmetadataTemp.findOneOrFail({
            clientId: data.clientId,
            ...(data.session ? { session: data.session } : {})
        });

        await this.clientsmetadataTemp.getEntityManager().removeAndFlush(temp);

        await this.mailer.send(
            new MetadataConfirmEmail({
                emailTo: user.username,
                userName: _user.getFullName(),
                requestTime: new Date().toLocaleString()
            })
        );
    }

    async getMetadataTemp(clientId: string, session?: string): Promise<any> {
        const metadataTemp = await this.clientsmetadataTemp.findOne({
            clientId,
            ...(session ? { session } : {})
        });

        if (!metadataTemp)
            return null;

        return { ...metadataTemp.detail, id: metadataTemp.uuid };
    }

    async updateMetadataTempwithoutsave(user: User, data: UserMetadataDto, exclude = false, userSession: User): Promise<User> {
        const client = await this.clientService.findByUuidWithMetadata(data.clientId);

        if (!client)
            throw new BadRequestException('Client was not found.');

        if (!client?.account)
            throw new BadRequestException('Client is not set up correctly account.');

        const contact = user.contact!;

        if (data.expectedValueOfTurnover)
            contact.expectedValueOfTurnover = data.expectedValueOfTurnover;

        if (data.expectedVolumeOfTransactions)
            contact.expectedVolumeOfTransactions = data.expectedVolumeOfTransactions;

        if (typeof data.bankMetadata !== 'undefined') {
            await this.validateBankMetadata(data.bankMetadata, user);
            !!client && (await client.setBankMetadata(data.bankMetadata));
        }

        if (typeof data.riskAssessment !== 'undefined')
            !!client && (await client.setRiskAssessment(data.riskAssessment));
        
        if (typeof data.brokers !== 'undefined')
            !!client && (await client.setBrokers(data.brokers));

        if (typeof data.directors !== 'undefined')
            !!client && (await client.setDirectors(data.directors));

        if (typeof data.shareholders !== 'undefined')
            !!client && (await client.setShareholders(data.shareholders));

        if (typeof data.fees !== 'undefined')
            !!client && (await client.account?.setFees(data.fees));

        contact.account = client.account as Account;

        if (data.partial) {
            if (userSession.role === UserRole.SuperAdmin) {
                await this.usersService.store(user);
            } 
            else {
                await this.sendMetadataEmail(user, data, client);
                return user;
            }
        }

        // if (
        //   (user.isSubAccount() ||
        //     client.account?.entityType === AccountType.Individual) &&
        //   typeof data.individualMetadata !== 'undefined'
        // ) {
        //   !!client &&
        //     (await client.setIndividualMetadata(data.individualMetadata, exclude));
        // } else {
        //   if (typeof data.businessMetadata !== 'undefined') {
        //     !!client &&
        //       (await client.setBusinessMetadata(data.businessMetadata, exclude));
        //   }
        // }

        if (userSession.role === UserRole.SuperAdmin)
            await this.usersService.store(user);
        else
            await this.sendMetadataEmail(user, data, client);

        return user;
    }

    async updateMetadataTemp(user: User, data: UserMetadataDto, exclude = false, userSession: User): Promise<User> {
        const client = await this.clientService.findByUuidWithMetadata(data.clientId);

        if (!client)
            throw new BadRequestException('Client was not found.');

        if (!client?.account)
            throw new BadRequestException('Client is not set up correctly account.');

        const contact = user.contact!;

        if (data.expectedValueOfTurnover)
            contact.expectedValueOfTurnover = data.expectedValueOfTurnover;

        if (data.expectedVolumeOfTransactions)
            contact.expectedVolumeOfTransactions = data.expectedVolumeOfTransactions;

        if (typeof data.bankMetadata !== 'undefined') {
            await this.validateBankMetadata(data.bankMetadata, user);
            !!client && (await client.setBankMetadata(data.bankMetadata));
        }

        if (typeof data.riskAssessment !== 'undefined')
            !!client && (await client.setRiskAssessment(data.riskAssessment));
        
        if (typeof data.brokers !== 'undefined')
            !!client && (await client.setBrokers(data.brokers));

        if (typeof data.directors !== 'undefined')
            !!client && (await client.setDirectors(data.directors));

        if (typeof data.shareholders !== 'undefined')
            !!client && (await client.setShareholders(data.shareholders));

        if (typeof data.fees !== 'undefined')
            !!client && (await client.account?.setFees(data.fees));

        contact.account = client.account as Account;

        if (data.partial) {
            if (userSession.role === UserRole.SuperAdmin) {
                await this.usersService.store(user);
            } 
            else {
                await this.sendMetadataEmail(user, data, client);
                return user;
            }
        }

        if ((user.isSubAccount() || client.account?.entityType === AccountType.Individual) && typeof data.individualMetadata !== 'undefined') {
            !!client && (await client.setIndividualMetadata(data.individualMetadata, exclude));
        } 
        else {
            if (typeof data.businessMetadata !== 'undefined')
                !!client && (await client.setBusinessMetadata(data.businessMetadata, exclude));
        }

        if (userSession.role === UserRole.SuperAdmin)
            await this.usersService.store(user);
        else
            await this.sendMetadataEmail(user, data, client);

        return user;
    }

    private async sendMetadataEmail(user: User, data: UserMetadataDto, client: Client) {
        const find = await this.clientsmetadataTemp.findOne({
            clientId: client.uuid,
            session: data.session
        });

        const metadataTemp = find ?? new MetadataTemp();
        metadataTemp.detail = data;
        metadataTemp.clientId = client.uuid;
        metadataTemp.session = data.session ?? '';
        await this.clientsmetadataTemp.getEntityManager().persistAndFlush(metadataTemp);

        await this.mailer.send(
            new MetadataUpdateEmail({
                userName: user.getFullName(),
                requestTime: new Date().toLocaleString(),
                approvalLink: `${process.env.FRONTEND_URL}/home`,
                accountDetails: user.username
            })
        );
    }

    async acceptTerms(user: User): Promise<User> {
        user.acceptTerms();
        await this.usersService.store(user);
        return user;
    }

    async updateDocuments(user: User, data: UserDocumentsDto): Promise<User> {
        for (const dto of data.documents) {
            const document = await this.documents.findByUuid(dto.uuid);
            if (!document)
                continue;

            try {
                await this.userDocumentsRepository.removeUserDocument(user, dto.type);
            } 
            catch (err) {
                this.logger.error((err as Error).message, (err as Error).stack);
            }

            await this.documents.finalize(document, dto.type);
            const userDocument = UserDocument.create(document, user, dto);
            this.userDocumentsRepository.getEntityManager().persist(userDocument);
        }

        await this.userDocumentsRepository.getEntityManager().flush();
        return user;
    }

    async removeDocuments(user: User, data: UserDocumentsDto): Promise<User> {
        for (const dto of data.documents) {
            const document = await this.documents.findByUuid(dto.uuid);
            if (!document)
                continue;

            try {
                await this.userDocumentsRepository.removeUserDocument(user, dto.type);
            } 
            catch (err) {
                this.logger.error((err as Error).message, (err as Error).stack);
            }

            await this.documents.remove(document);
        }

        await this.userDocumentsRepository.getEntityManager().flush();
        return user;
    }

    async getUserDocuments(user: User): Promise<UserDocument[]> {
        return this.userDocumentsRepository.findByUser(user);
    }

    private isWrongMetadataProvided(user: User, data: UserMetadataDto): boolean {
        if (data.partial) 
            return false;

        if (user.isSubAccount())
            return !user.contact || !data.individualMetadata;
        
        const client = user.getCurrentClient()!;
        return (
            !client.account ||
            (client.account.entityType === AccountType.Individual && !data.individualMetadata) ||
            (client.account.entityType === AccountType.Business && !data.businessMetadata)
        );
    }

    async resetPassword(user: User, data: ResetPasswordDto, skip = false) {
        const password = data.currentPassword;
        const newPassword = data.password;
        
        if (!skip) {
            const passwordIsValid = await user.comparePassword(password);
            if (!passwordIsValid)
                throw new BadRequestException('The current password is wrong.');
        }

        await user.setPassword(newPassword);
        await this.usersService.store(user);
        return user;
    }
}
