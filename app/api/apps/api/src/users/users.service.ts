/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { VALIDATION_LIST } from '@tools/misc';
import {
  AdminCreateUserDto,
  PendingMetadataDto,
  User,
  UserMetadataDto,
  Client,
  UserRole,
  UserRoles,
  UsersRepository,
  UserV2Dto,
} from '@tools/models';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  selectCurrent(user: User, uuid: string): Promise<User> {
    user.setCurrentClient(uuid);
    return Promise.resolve(user);
  }

  async getByUuid(uuid: string): Promise<User | null> {
    return this.usersRepository.findUserByUuid(uuid);
  }

  async getManagerUsersByAccountId(accountId: string): Promise<User[]> {
    return this.usersRepository.getManagerUsersByAccountId(accountId);
  }

  async getByMobileNumber(mobileNumber: string): Promise<User | null> {
    return this.usersRepository.findByMobileNumber(mobileNumber);
  }

  async getByUsernameAndClient(
    username: string,
    clientUUID: string,
  ): Promise<User | null> {
    const user = await this.usersRepository.findByUsername(username);

    if (!user) {
      return null;
    }

    const client = user.clients
      .getItems()
      .find((c) => c.uuid === clientUUID) as Client;

    if (client) {
      user.setCurrentClient(client.uuid);
      user.getCurrentClient();
    }

    const role = user.userClients
      .getItems()
      .find((uc) => uc.client.uuid === clientUUID)?.metadata.role;
    user.setRole(role);

    return user;
  }

  async getByUsernameToLogin(username: string): Promise<User | null> {
    return this.usersRepository.findByUsernameToLogin(username);
  }

  async getByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findByUsername(username);
  }
  async getByOpenPaydId(username: string): Promise<User | null> {
    return this.usersRepository.findByOpenPaydId(username);
  }
  async getByCurrencyCloudId(username: string): Promise<User | null> {
    return this.usersRepository.findByCurrencyCloudId(username);
  }
  async getByOpenPaydIds(ids: string[]): Promise<User[] | null> {
    return this.usersRepository.findByOpenPaydIds(ids);
  }
  async getByCurrencyCloudIds(ids: string[]): Promise<User[] | null> {
    return this.usersRepository.findByCurrencyCloudIds(ids);
  }
  async verifyEmail(email: string, code: string): Promise<User> {
    const user = await this.getByUsername(email);
    if (!user) {
      throw new BadRequestException('User is not registered.');
    }

    if (user.isVerified()) {
      throw new BadRequestException('User is already verified.');
    }

    await user.confirmVerification(code);
    this.store(user);
    return user;
  }

  async store(user: User): Promise<void> {
    return this.usersRepository.store(user);
  }
  async getUserMeta(uuid: string) {
    return this.usersRepository.findUserWithMeta(uuid);
  }

  async prepare2FA(user: User) {
    if (!user.twoFA) {
      const secret = authenticator.generateSecret(20);
      const otpauthUrl = authenticator.keyuri(user.username, 'CDAX', secret);
      user.twoFASecret = secret;
      this.store(user);
      return {
        secret,
        QR: toDataURL(otpauthUrl),
      };
    } else {
      throw new BadRequestException('User already has 2FA enabled.');
    }
  }
  async is2FAValid(user: User, token: string) {
    return authenticator.verify({
      token,
      secret: user.twoFASecret,
    });
  }

  async enable2FA(user: User) {
    user.twoFA = true;
    this.store(user);
  }

  async disable2FA(user: User) {
    user.twoFA = false;
    user.twoFASecret = '';
    this.store(user);
  }

  async updateUser(uuid: string, data: AdminCreateUserDto) {
    const user = await this.usersRepository.findByUuid(uuid);
    if (!user) {
      throw new NotFoundException('User was not found.');
    }

    user.firstname = data.firstname ?? user.firstname;
    user.lastname = data.lastname ?? user.lastname;
    user.username = data.email;
    if (data.password && data.password.length > 0) {
      await user.setPassword(data.password);
    }
    if (user.contact?.account) {
      user.contact.account.entityType = data.entityType;
      user.contact.country = data.country;
      user.contact.mobileNumber = data.mobileNumber;
      user.contact.businessRole = data.businessRole;
    }

    if (
      user.contact?.account &&
      user.contact.account.businessMetadata &&
      data.companyType
    ) {
      user.contact.account.businessMetadata.companyType = data.companyType;
    }
    await this.usersRepository.store(user);
    return user;
  }
  async checkMetadataUpdate(user: User, metaData: UserMetadataDto) {
    const accountType = user?.contact?.account.entityType;
    if (!accountType)
      throw new BadRequestException('The account is not set up properly.');
    const userAccount = user?.contact?.account;
    if (!userAccount)
      throw new BadRequestException('The account is not set up properly.');
    const bankMetadata = user?.contact?.account.bankMetadata;
    const pendingMetadata: PendingMetadataDto[] = [];
    for (const field of VALIDATION_LIST[accountType]) {
      if (metaData[accountType + 'Metadata'][field])
        if (
          (await userAccount.pendingMetadatas.loadItems()).find(
            (meta) => meta.field === field && meta.type == accountType,
          ) ||
          !userAccount[accountType + 'Metadata'] ||
          metaData[accountType + 'Metadata'][field] !=
            userAccount[accountType + 'Metadata'][field]
        )
          pendingMetadata.push({
            type: accountType,
            field: field,
            value: metaData[accountType + 'Metadata'][field],
          });
    }
    if (!metaData.bankMetadata) return pendingMetadata;
    for (const field of VALIDATION_LIST.bankMetadata) {
      if (metaData.bankMetadata[field])
        if (
          (await userAccount.pendingMetadatas.loadItems()).find(
            (meta) => meta.field === field && meta.type == 'bank',
          ) ||
          !bankMetadata ||
          metaData.bankMetadata[field] != userAccount.bankMetadata[field]
        )
          pendingMetadata.push({
            type: 'bank',
            field: field,
            value: metaData.bankMetadata[field],
          });
    }
    return pendingMetadata;
  }

  async updateUsers(uuid: string, data: UserV2Dto) {
    const user = await this.usersRepository.findByUuid(uuid);

    if (!user) {
      throw new NotFoundException('User was not found.');
    }

    user.firstname = data.firstName ?? user.firstname;
    user.lastname = data.lastName ?? user.lastname;
    user.profileImage = data.profileImage ?? user.profileImage;

    if (user.contact) {
      user.contact.country = data.country ?? user.contact.country;
      user.contact.mobileNumber =
        data.mobileNumber ?? user.contact.mobileNumber;
    }

    await this.usersRepository.store(user);
    return user;
  }

  async getAll(
    roles: UserRole[] = UserRoles,
    page = 1,
    limit = 200,
    client: Client,
    status?: string,
  ) {
    if (!client.account) {
      throw new BadRequestException('Client is not set up correctly account.');
    }

    const [data, count] = await this.usersRepository.findUsers(
      roles,
      page,
      limit,
      client.account.uuid,
      status,
    );

    const users = Array.from(data).map((user) => {
      const metaData = user.getMetadataByClient(client.uuid);
      return {
        uuid: user.uuid,
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.username,
        mobileNumber: user.contact?.mobileNumber,
        entityType: metaData?.userClient.client.account?.entityType,
        country: user.contact?.country,
        role: metaData?.role,
        verified: !!user.verifiedAt,
      };
    });
    return [users, count];
  }

  async updateVerified(uuid: string, verifiedAt: Date) {
    const user = await this.usersRepository.findByUuid(uuid);
    if (!user) {
      throw new NotFoundException('User was not found.');
    }

    user.verifiedAt = verifiedAt;

    await this.usersRepository.store(user);
    return user;
  }
}
