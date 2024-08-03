import { BadRequestException } from '@nestjs/common';
import { isSwift } from '@luxbank/tools-misc';
import { Account, AccountType, Beneficiary, CreateBeneficiaryDto, Currencies, User } from '@luxbank/tools-models';

export class BeneficiaryManager {
    static createFromCreateDto(dto: CreateBeneficiaryDto, creator: User | null): Beneficiary {
        if (!creator?.getCurrentClient()?.account)
            throw new BadRequestException('No account associated with the current user.');

        const beneficiary = new Beneficiary();
        this.updateByDto(dto, beneficiary);
        beneficiary.creator = creator;
        beneficiary.account = creator?.getCurrentClient()?.account as Account;

        return beneficiary;
    }

    static updateByDto(dto: CreateBeneficiaryDto, beneficiary: Beneficiary): Beneficiary {
        beneficiary.firstname = dto.firstname;
        beneficiary.lastname = dto.lastname;
        beneficiary.entityType = dto.entityType;
        beneficiary.currency = dto.currency;
        beneficiary.paymentType = dto.paymentType;
        beneficiary.address = dto.address;
        beneficiary.city = dto.city;
        beneficiary.state = dto.state;
        beneficiary.postcode = dto.postcode;
        beneficiary.country = dto.country;
        beneficiary.companyName = dto.companyName;
        beneficiary.bankCountry = dto.bankCountry;

        if (dto.accountNumber)
            beneficiary.accountNumber = String(dto.accountNumber);

        if (dto.sortCode)
            beneficiary.sortCode = String(dto.sortCode);
        
        if (!isSwift(dto.bankCountry)) {
            if (dto.IBAN)
                beneficiary.IBAN = dto.IBAN;
            else
                beneficiary.IBAN = '';
        } 
        else {
            beneficiary.IBAN = '';
        }

        if (dto.bicSwift)
            beneficiary.bicSwift = dto.bicSwift;
        else
            beneficiary.bicSwift = '';

        return beneficiary;
    }

    static createFromUser(user: User) {
        if (!user.contact?.account)
            return null;

        const dto = new CreateBeneficiaryDto();
        const bankMetadata = user.contact?.account?.bankMetadata;

        const entityType = user.getAccountType();
        if (entityType !== '')
            dto.entityType = entityType;
        
        if (!bankMetadata)
            return null;
        
        const name = bankMetadata.accountHolderName.split(' ');
        dto.firstname = name.shift() || '';
        dto.lastname = name.join(' ') || '';
        dto.country = user.contact.country;

        if (user.contact.account.entityType == AccountType.Individual) {
            dto.address = user.contact.account.individualMetadata?.addressLine1 + ', ' + user.contact.account.individualMetadata?.addressLine2;
            dto.city = user.contact.account.individualMetadata?.city ?? '';
            dto.country = user.contact.account.individualMetadata?.country ?? '';
            dto.state = user.contact.account.individualMetadata?.state ?? '';
            dto.postcode = user.contact.account.individualMetadata?.postcode ?? '';
        } 
        else {
            dto.address = user.contact.account.businessMetadata?.registeredOffice1 ?? '';
            if (user.contact.account.businessMetadata?.registeredOffice1_address2)
                dto.address += ', ' + user.contact.account.businessMetadata?.registeredOffice1_address2.trim();
            
            dto.city = user.contact.account.businessMetadata?.registeredOffice1_city ?? "";
            dto.country = user.contact.account.businessMetadata?.countryOfRegistration ?? "";
            dto.postcode = user.contact.account.businessMetadata?.registeredOffice1_postcode ?? "";
            dto.state = user.contact.account.businessMetadata?.registeredOffice1_state ?? "";
        }

        dto.bankCountry = bankMetadata.bankCountry;
        if (bankMetadata.accountNumber)
            dto.accountNumber = bankMetadata.accountNumber;

        if (bankMetadata.sortCode)
            dto.sortCode = bankMetadata.sortCode;

        if (bankMetadata.IBAN)
            dto.IBAN = bankMetadata.IBAN;
        
        if (bankMetadata.bicSwift)
            dto.bicSwift = bankMetadata.bicSwift;
        
        if (bankMetadata.currency)
            dto.currency = <Currencies>bankMetadata.currency;
        
        return dto;
    }

    static updateFromUser(beneficiary: Beneficiary, user: User) {
        const client = user.getCurrentClient();
        if (!client?.account || !user.contact)
            return null;

        const bankMetadata = client?.account?.bankMetadata;

        const entityType = user.getAccountType();
        if (entityType !== '')
            beneficiary.entityType = entityType;
        
        if (!bankMetadata)
            return null;
        
        const name = bankMetadata.accountHolderName.split(' ');
        beneficiary.firstname = name.shift() || '';
        beneficiary.lastname = name.join(' ') || '';
        beneficiary.country = user.contact.country;
        beneficiary.bankCountry = bankMetadata.bankCountry;

        if (client.account.entityType == AccountType.Individual) {
            beneficiary.address = client.account?.individualMetadata?.addressLine1 + ', ' + client.account?.individualMetadata?.addressLine2;
            beneficiary.city = client.account?.individualMetadata?.city ?? "";
            beneficiary.country = client.account?.individualMetadata?.country ?? "";
            beneficiary.state = client.account?.individualMetadata?.state ?? "";
            beneficiary.postcode = client.account?.individualMetadata?.postcode ?? "";
        } 
        else {
            const officeAddress = client.account.businessMetadata?.registeredOffice1?.split(',') ?? [];
            beneficiary.address = officeAddress.shift()?.trim() || '';
            if (officeAddress.length == 4)
                beneficiary.address += ', ' + officeAddress.shift()?.trim();
            
            beneficiary.city = officeAddress.shift()?.trim() || '';
            beneficiary.country = officeAddress.shift()?.trim() || '';
            beneficiary.postcode = officeAddress.shift()?.trim() || '';
            beneficiary.state = officeAddress.shift()?.trim() || '';
        }

        if (bankMetadata.accountNumber)
            beneficiary.accountNumber = bankMetadata.accountNumber;
        
        if (bankMetadata.sortCode)
            beneficiary.sortCode = bankMetadata.sortCode;
        
        if (bankMetadata.IBAN)
            beneficiary.IBAN = bankMetadata.IBAN;
        
        if (bankMetadata.bicSwift)
            beneficiary.bicSwift = bankMetadata.bicSwift;
        
        if (bankMetadata.currency)
            beneficiary.currency = <Currencies>bankMetadata.currency;
        
        return beneficiary;
    }
}
