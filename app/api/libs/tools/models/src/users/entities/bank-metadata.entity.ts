import { Entity, EntityRepositoryType, Property } from '@mikro-orm/core';
import { IsOptional, validateOrReject } from 'class-validator';
import { BaseEntity } from '../../base';
import { BankMetadataDto } from '../dtos';
import { BankMetadataRepository } from '../repository';

@Entity({ customRepository: () => BankMetadataRepository })
export class BankMetadata extends BaseEntity {
  @Property()
  bankName: string;

  @Property()
  branch: string;

  @Property()
  bankCountry: string;

  @Property()
  @IsOptional()
  accountHolderName: string;

  @Property()
  sortCode: string;

  @Property()
  accountNumber: string;

  @Property({ nullable: true })
  IBAN: string;

  @Property({ nullable: true })
  bicSwift: string;

  @Property({ nullable: true })
  currency: string;

  [EntityRepositoryType]: BankMetadataRepository;

  async updateFromDto(data: BankMetadataDto) {
    await validateOrReject(data);
    this.bankName = data.bankName;
    this.branch = data.branch;
    this.bankCountry = data.bankCountry;
    this.accountHolderName = data.accountHolderName;
    this.sortCode = data.sortCode;
    this.accountNumber = data.accountNumber;
    this.IBAN = data.IBAN;
    this.bicSwift = data.bicSwift;
    this.currency = data.currency;
  }
}
