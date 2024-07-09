/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { isInUk } from '@tools/misc';
import {
  IsEmail,
  IsEnum,
  IsISO31661Alpha2,
  IsMobilePhone,
  IsOptional,
  Matches,
  ValidateIf,
} from 'class-validator';
import { CompanyType } from '../entities';
import { AccountType } from '../enums';
import { AdminCreateUserDto } from './admin-create-user.dto';

export class CreateAccountDto {
  @ApiProperty()
  @IsOptional()
  firstname?: string;

  @ApiProperty()
  @IsOptional()
  lastname?: string;

  @ApiProperty()
  @IsOptional()
  companyName?: string;

  @ApiProperty()
  dob: Date;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsEnum(AccountType)
  entityType: AccountType;

  @ApiProperty()
  @IsISO31661Alpha2()
  country: string;

  @ApiProperty()
  @ValidateIf((obj: CreateAccountDto) => obj.isInsideUk())
  @IsMobilePhone()
  mobileNumber: string;

  @ApiProperty()
  verificationCode: string;

  @ApiProperty()
  businessRole: string;

  @ApiProperty()
  invitationUuid: string;

  @ApiProperty()
  invitationCode: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(CompanyType)
  companyType: CompanyType;

  @ApiProperty()
  @ValidateIf((obj: CreateAccountDto) => obj.isInsideUk())
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#$%&'()*+,-./:;<=>?@[\]^_`{|}~"])(?=.{8,})/,
    {
      message:
        'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
    },
  )
  password: string;

  isInsideUk(): boolean {
    return isInUk(this.country);
  }

  static fromAdminDto(dto: AdminCreateUserDto) {
    const result = new CreateAccountDto();
    result.firstname = dto.firstname;
    result.lastname = dto.lastname;
    result.email = dto.email;
    result.entityType = dto.entityType;
    result.country = dto.country;
    result.mobileNumber = dto.mobileNumber;
    result.businessRole = dto.businessRole;
    result.password = dto.password;
    result.companyType = dto.companyType;
    result.companyName = dto.companyName;
    return result;
  }
}
