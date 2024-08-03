import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { generatePassword } from '@luxbank/tools-misc';
import { AccountType, Contact, Invitation, InvitationDto, InvitationsRepository, InviteUserRolesDto, RequestAccess, RequestAccessDto, RequestAccessRepository, User, UsersRepository } from '@luxbank/tools-models';
import { MailerService } from '../mailer/mailer.service';
import AdminInvitationEmail from './emails/admin-invitation-email';
import { EmailTypes } from './emails/email-types';
import InvitationEmail from './emails/invitation-email';
import RequestAccessEmail from './emails/request-access-email';
import UserInvitationRole from './emails/user-invitation';
import UserInvitationRoleAlreadyRegistered from './emails/user-invitation-already-registered';
import { UsersService } from './users.service';
import { ClientsService } from '../clients/clients.service';

@Injectable()
export class InvitationsService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly invitationsRepository: InvitationsRepository,
        private readonly requestAccessRepository: RequestAccessRepository,
        private readonly usersService: UsersService,
        private readonly mailer: MailerService,
        private readonly clientService: ClientsService
    ) { }

    async checkExistingUser(data: InvitationDto) {
        const existingUser = await this.usersService.getByUsername(data.email);

        if (existingUser)
            throw new BadRequestException('Email is already registered.');
    }

    async requestAccess(data: RequestAccessDto) {
        const requestAccess = RequestAccess.fromRequestAccessDto(data);
        await this.requestAccessRepository.getEntityManager().persistAndFlush(requestAccess);
        await this.mailer.send(new RequestAccessEmail(data));
    }

    async create(data: InvitationDto, creator: User, emailType = EmailTypes.InvitationEmail): Promise<Invitation> {
        if (emailType != EmailTypes.AdminInvitationEmail)
            this.checkExistingUser(data);

        const invitation = Invitation.fromDto(data, creator);
        const secret = await invitation.generateSecret();

        await this.invitationsRepository.getEntityManager().persistAndFlush(invitation);
        switch (emailType) {
            case EmailTypes.InvitationEmail:
                await this.mailer.send(new InvitationEmail(invitation, secret));
                break;
            case EmailTypes.AdminInvitationEmail:
                if (data.password)
                    await this.mailer.send(new AdminInvitationEmail(invitation, secret, data.password));
                break;
            default:
                break;
        }

        return invitation;
    }

    async fetch(uuid: string) {
        const invitation = await this.invitationsRepository.findOne(
            { uuid },
            { populate: ['account', 'creator', 'creator.contact'] }
        );

        if (!invitation || invitation.isExpired())
            throw new NotFoundException('Specified invitation was not found.');

        return invitation;
    }

    async expire(invitation: Invitation): Promise<Invitation> {
        invitation.expire();
        this.invitationsRepository.getEntityManager().persistAndFlush(invitation);
        return invitation;
    }

    async createInviteUser(data: InviteUserRolesDto, userData: User) {
        if (!userData.getCurrentClient())
            throw new BadRequestException('User is not set up correctly.');

        if (!userData.getCurrentClient()?.account)
            throw new BadRequestException('User is not set up correctly account.');

        let user = await this.usersRepository.findByUsername(data.email);

        let password: string | null = null;

        if (user) {
            if (user.clients.getItems().find((u) => u.uuid === userData.getCurrentClient()?.uuid))
                throw new BadRequestException('User is already registered with this client.');
        } 
        else {
            user = new User();
            password = generatePassword(8);
            await user.setPassword(password);
            user.firstname = data.firstname;
            user.lastname = data.lastname;
            user.username = data.email;

            const contact = new Contact();
            contact.isSubAccount = true;
            contact.country = data.country;
            contact.mobileNumber = data.mobileNumber;

            user.contact = contact;
        }

        await this.clientService.putUserOnClient(user, userData.getCurrentClient()!, data.userRole);
        await this.usersRepository.store(user);

        const accountName = userData.getCurrentClient()?.account?.entityType === AccountType.Individual
                ? userData.getCurrentClient()?.account?.individualMetadata?.getName()
                : userData.getCurrentClient()?.account?.businessMetadata?.getName();

        const dataEmail = {
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            mobileNumber: data.mobileNumber,
            account: accountName || ''
        };

        if (password)
            await this.mailer.send(new UserInvitationRole(data.email, { ...dataEmail, password }));
        else
            await this.mailer.send(new UserInvitationRoleAlreadyRegistered(data.email, dataEmail));

        return user;
    }
}
