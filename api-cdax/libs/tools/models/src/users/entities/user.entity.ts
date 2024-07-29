import { Cascade, Collection, Entity, EntityRepositoryType, ManyToMany, ManyToOne, OneToMany, OneToOne, Property, serialize } from '@mikro-orm/core';
import { BadRequestException } from '@nestjs/common';
import { compareHash, generateCodeAndHash, generateHash } from '@cdaxfx/tools-misc';
import { Client } from '../../clients';
import { Exclude, Expose, Type, instanceToPlain } from 'class-transformer';
import { BaseEntity } from '../../base';
import { CreateAccountDto } from '../dtos';
import { AccountType, AdminRoles, UserRole } from '../enums';
import { UsersRepository } from '../repository';
import { Contact } from './contact.entity';
import { UserDocument } from './user-document.entity';
import { UserClient } from '../../user-clients';

@Entity({ repository: () => UsersRepository })
export class User extends BaseEntity {
  @Property({ unique: true })
  username: string;

  @Exclude()
  @Property({ type: String, nullable: true, hidden: true })
  private password: string | null;

  @Property({ type: String, nullable: true, hidden: true })
  ip: string | null;

  @Property()
  firstname: string;

  @Property()
  lastname: string;

  @Property({ nullable: true })
  profileImage: string;

  @Property({ default: false })
  hasAcceptedTerms: boolean;

  @Property({ nullable: true })
  archivedAt: Date | null;

  @Property({ type: String, nullable: true })
  invitedBy: string | null;

  @Exclude()
  @Property({ type: String, nullable: true })
  verificationCode: string | null;

  @Exclude()
  @Property({ type: Date, nullable: true })
  verifiedAt: Date | null;

  @Property({ type: String, persist: false, nullable: true })
  role: UserRole;

  @Type(() => Contact)
  @OneToOne({ nullable: true, owner: true, cascade: [Cascade.ALL], entity: () => Contact })
  contact?: Contact;

  @ManyToMany({ entity: () => Client, owner: true, pivotTable: 'user_clients' })
  clients = new Collection<Client>(this);

  @Exclude()
  @OneToMany(() => UserClient, (uc) => uc.user)
  userClients = new Collection<UserClient>(this);

  @Exclude()
  @OneToMany(() => UserDocument, (ud) => ud.user)
  documents = new Collection<UserDocument>(this);

  @Exclude()
  @Property({ type: String, nullable: true })
  twoFASecret: string;

  @Property({ nullable: true })
  twoFA: boolean;

  @Property({ persist: false })
  is2FAOK: boolean;

  @Property({ nullable: true, default: true })
  isMobile2FAEnabled: boolean;

  @Property({ nullable: true, defaultRaw: 'current_timestamp' })
  passwordUpdatedAt: Date = new Date();

  @Property({ persist: false })
  personatedBy: string;

  /*chris @Exclude()
  @Property({ type: Client, nullable: true, persist: false })
  private currentClient: Client | null;*/

  //chris
  @Exclude()
  @ManyToOne(() => Client, {nullable: true, eager: false})
  private currentClient: Client | null;

  @Expose({ name: 'metadata' })
  getMetadataByClient(uuid: string) {
    return this.userClients?.getItems().find((uc) => uc.client.uuid === uuid)?.metadata;
  }

  getCurrentClient(): Client | null {
    this.currentClient?.setName();
    return this.currentClient;
  }

  setCurrentClient(uuid: string) {
    this.currentClient = this.clients.getItems().find((c) => c.uuid === uuid) ?? null;
  }

  setPersonated(personatedBy: string) {
    this.personatedBy = personatedBy;
  }

  @Expose()
  isMetadataSet(): boolean {
    if (!this.contact?.account)
      return false;

    if (this.isSubAccount())
      return (!!this.contact.account.individualMetadata || !!this.contact.account.businessMetadata);

    const { entityType, bankMetadata, businessMetadata, individualMetadata } = this.contact.account;

    if (entityType === AccountType.Individual)
      return !!(bankMetadata && individualMetadata);
    else
      return !!(bankMetadata && businessMetadata);
  }

  @Expose()
  profileImageUrl() {
    return `${process.env.IMAGE_BASE_URL_IMAGES}/${this.profileImage}`;
  }

  @Expose({ name: 'accountType' })
  getAccountType() {
    return this.getCurrentClient()?.account?.entityType || '';
  }

  @Expose({ name: 'isSubAccount' })
  isSubAccount() {
    return this.contact?.isSubAccount ?? false;
  }

  @Expose({ name: 'isApproved' })
  isApproved() {
    return AdminRoles.includes(this.role) || this.contact?.account?.isApproved;
  }

  acceptTerms(): void {
    this.hasAcceptedTerms = true;
  }

  async setPassword(plainPassword: string): Promise<void> {
    this.password = await generateHash(plainPassword);
    this.passwordUpdatedAt = new Date();
  }

  getPasswordStrength(): number {
    return Number(this.password?.substring(4, 6));
  }

  async comparePassword(plainPassword: string): Promise<boolean> {
    if (!this.password)
      return false;

    return compareHash(plainPassword, this.password);
  }

  async generateNewVerificationCode(): Promise<string> {
    const { code, hash } = await generateCodeAndHash(8);
    this.verificationCode = hash;
    this.verifiedAt = null;
    return code;
  }

  async confirmVerification(code: string): Promise<boolean> {
    if (!this.verificationCode)
      return true;

    const match = await compareHash(code, this.verificationCode);
    if (!code || !match)
      throw new BadRequestException('Invalid verification code.');

    this.verificationCode = null;
    this.verifiedAt = new Date();
    return true;
  }

  isVerified(): boolean {
    return this.verifiedAt !== null;
  }

  setRole(role?: UserRole): void {
    if (!!role)
      this.role = role;
  }
  getContactName() {
    return this.contact?.account?.entityType == AccountType.Individual ? this.contact?.account?.individualMetadata?.getName() : this.contact?.account?.businessMetadata?.getName();
  }
  getFullName(): string {
    return `${this.firstname || ''} ${this.lastname || ''}`;
  }

  serialize(): object {
    const serializedUser = serialize(this as User, {
      populate: [
        'contact',
        'clients',
        'clients.account',
      ],
      exclude: ['contact.account', 'clients.account', 'contact.user'],
      forceObject: true,
      skipNull: true,
    });

    serializedUser.clients = serializedUser?.clients?.filter(
      (client: any) => client?.account?.isApproved,
    );

    serializedUser.profileImage = this.profileImageUrl();

    return instanceToPlain(serializedUser);
  }

  constructor(user?: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  static async withContactFromDto(data: CreateAccountDto, existingUser: User | null): Promise<User> {
    const result = existingUser || new User();

    result.username = data.email;
    result.firstname = String(data.firstname);
    result.lastname = String(data.lastname);

    result.contact = existingUser?.contact || new Contact();
    result.contact.country = String(data.country);
    result.contact.businessRole = String(data.businessRole);

    result.contact.mobileNumber = data.mobileNumber;

    if (!existingUser)
      await result.setPassword(data.password);

    return result;
  }

  [EntityRepositoryType]: UsersRepository;
}
