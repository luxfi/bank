import { Entity, EntityRepositoryType, Property } from '@mikro-orm/core';
import { VALIDATION_LIST } from '@cdaxfx/tools-misc';
import { validateOrReject } from 'class-validator';
import { BaseEntity } from '../../base';
import { IndividualMetadataDto } from '../dtos';
import { GenderType } from '../enums/gender-type.enum';
import { IdentificationType } from '../enums/identification-type.enum';
import { Titles } from '../enums/titles.enum';
import { IndividualMetadataRepository } from '../repository';

@Entity({ repository: () => IndividualMetadataRepository })
export class IndividualMetadata extends BaseEntity {
  @Property({ type: String, nullable: true })
  title: Titles;

  @Property({ nullable: true })
  firstname: string;

  @Property({ nullable: true })
  lastname: string;

  @Property({ nullable: true })
  formerName: string;

  @Property({ nullable: true })
  otherName: string;

  @Property({ nullable: true, defaultRaw: 'current_timestamp' })
  dateOfBirth: Date;

  @Property({ nullable: true })
  placeOfBirth: string;

  @Property({ nullable: true })
  addressLine1: string;

  @Property({ nullable: true })
  addressLine2: string;

  @Property({ nullable: true })
  city: string;

  @Property({ nullable: true })
  postcode: string;

  @Property({ nullable: true })
  state: string;

  @Property({ nullable: true })
  country: string;

  @Property({ nullable: true })
  previousAddressLine1: string;

  @Property({ nullable: true })
  previousAddressLine2: string;

  @Property({ nullable: true })
  previousCity: string;

  @Property({ nullable: true })
  previousPostcode: string;

  @Property({ nullable: true })
  previousCountry: string;

  @Property({ nullable: true })
  previousState: string;

  @Property({ nullable: true })
  nationality: string;

  @Property({ type: String, default: GenderType.Other, nullable: true })
  gender: GenderType = GenderType.Other;

  @Property({ nullable: true })
  identificationNumber: string;

  @Property({ type: String, default: IdentificationType.None, nullable: true })
  identificationType: IdentificationType = IdentificationType.None;

  @Property({ nullable: true })
  occupation: string;

  @Property({ nullable: true })
  employerName: string;

  @Property({ nullable: true })
  employerAddress1: string;

  @Property({ nullable: true })
  employerAddress2: string;

  @Property({ nullable: true })
  employerAddress3: string;

  @Property({ nullable: true })
  publicPosition: string;

  @Property({ nullable: true })
  highProfilePosition: string;

  [EntityRepositoryType]: IndividualMetadataRepository;

  getName(): string {
    return this.firstname + ' ' + this.lastname;
  }
  
  async updateFromDto(data: IndividualMetadataDto, exclude = false) {
    await validateOrReject(data);
    const fields = [
      'title',
      'firstname',
      'lastname',
      'formerName',
      'otherName',
      'dateOfBirth',
      'placeOfBirth',
      'addressLine1',
      'addressLine2',
      'city',
      'postcode',
      'country',
      'state',
      'previousAddressLine1',
      'previousAddressLine2',
      'previousCity',
      'previousPostcode',
      'previousCountry',
      'previousState',
      'nationality',
      'gender',
      'identificationNumber',
      'identificationType',
      'occupation',
      'employerName',
      'employerAddress1',
      'employerAddress2',
      'employerAddress3',
      'publicPosition',
      'highProfilePosition',
    ];
    for (const field of fields) {
      if (!exclude || !VALIDATION_LIST.individual.includes(field))
        this[field] = !!data[field] ? data[field] : this[field];
    }
  }
}
