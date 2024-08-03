import { isInUk, isSwift } from '@luxbank/tools-misc';
import { AccountType, Beneficiary, CreateBeneficiaryDto } from '@luxbank/tools-models';
import { CreateCurrencyCloudBeneficiaryDto } from '../../currency-cloud/model/create-currency-cloud-beneficiary.dto';
import { RoutingCodeType, getRoutingCodeByCountry } from '../../currency-cloud/model/routing-code-type.enum';

export function createCurrencyCloudBeneficiaryDto(data: CreateBeneficiaryDto | Beneficiary): CreateCurrencyCloudBeneficiaryDto {
    const fullName = `${data.firstname} ${data.lastname}`;
    const result: CreateCurrencyCloudBeneficiaryDto = {
        name: fullName,
        bankAccountHolderName: fullName,
        bankCountry: data.bankCountry,
        currency: data.currency,
        beneficiaryCity: data.city,
        beneficiaryCountry: data.country,
        beneficiaryEntityType: data.entityType
    };

    if (data instanceof Beneficiary) {
        result.bankName = data.bankName;
        result.bankAddress = data.bankAddress;
    }

    if (data.entityType === AccountType.Individual) {
        result.name = fullName;
        result.beneficiaryFirstName = data.firstname;
        result.beneficiaryLastName = data.lastname;
        result.beneficiaryEntityType = 'individual';
        result.beneficiaryAddress = data.address.replace('\n', ', ');
    } 
    else {
        result.name = data.companyName;
        result.bankAccountHolderName = data.companyName;
        result.beneficiaryCompanyName = data.companyName;
        result.beneficiaryEntityType = 'company';
        if (data.address)
            result.beneficiaryAddress = data.address.replace('\n', ', ');
    }

    result.beneficiaryStateOrProvince = data.state;
    result.beneficiaryPostcode = data.postcode;
    if (isInUk(data.bankCountry)) {
        if (data.accountNumber)
            result.accountNumber = data.accountNumber;

        if (data.sortCode) {
            result.routingCodeType1 = RoutingCodeType.SortCode;
            result.routingCodeValue1 = data.sortCode;
        }

        if ((!data.accountNumber || !data.sortCode) && data.IBAN) {
            result.routingCodeType1 = RoutingCodeType.SortCode;
            result.accountNumber = data.IBAN.substring(14, 22);
            result.routingCodeValue1 = data.IBAN.substring(8, 14);
        }
    } 
    else if (data.accountNumber) {
        const routingCode = getRoutingCodeByCountry(data.bankCountry);
        result.accountNumber = data.accountNumber;
        if (routingCode && data.sortCode) {
            result.routingCodeType1 = routingCode;
            result.routingCodeValue1 = data.sortCode;
        }
    }

    if (data.IBAN) {
        result.iban = data.IBAN;
        if (data.bicSwift)
            result.bicSwift = data.bicSwift;
    } 
    else if (isSwift(data.bankCountry)) {
        result.bicSwift = data.bicSwift;
    }
    
    return result;
}
