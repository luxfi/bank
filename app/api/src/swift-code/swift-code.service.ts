import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { createCurrencyCloudBeneficiaryDto } from '../beneficiaries/model/beneficiary-dto.transformer';
import { CurrencyCloudService } from '../currency-cloud/currency-cloud.service';
import { CreateCurrencyCloudBeneficiaryDto } from '../currency-cloud/model/create-currency-cloud-beneficiary.dto';
import { isInUk } from '@luxbank/tools-misc';
import { IbanResponseDto } from './model/iban-response.dto';
import { SwiftResponseDto } from './model/swift-response.dto';
import { Beneficiary, CreateBeneficiaryDto, User } from '@luxbank/tools-models';

@Injectable()
export class SwiftCodeService {
    private logger = new Logger(SwiftCodeService.name);
    constructor(private readonly currencyCloudService: CurrencyCloudService) { }

    async validate(iban: string, swift: string) {
        const errors: string[] = [];
        try {
            let swiftObject = await this.getDetailsByIban(iban);
            if (!swiftObject)
                errors.push('Invalid IBAN.');

            if (swiftObject?.id !== swift) {
                const swiftResponse = await this.getDetailsBySwift(swift);
                if (!swiftResponse)
                    errors.push('Invalid SWIFT BIC.');

                if (swiftResponse?.id)
                    swiftObject = swiftResponse;
            }

            return { errors, data: swiftObject };
        } 
        catch (err) {
            this.logger.log(err);
            throw err;
        }
    }

    async getDetailsByAccountNumberAndSortCode(accountNumber: string, sortCode: string) {
        try {
            const iban = 'GB33BUKB' + sortCode + accountNumber;
            const ibanResponse = await this.request<IbanResponseDto>(`v1/ibans/${iban}`);
            if (ibanResponse.data.success)
                return ibanResponse.data.data.swift;
            
            throw new Error(`Invalid IBAN: ${iban}`);
        } 
        catch (err) {
            this.logger.error((err as any).message, (err as any).stack);
        }

        return null;
    }

    async getDetailsBySwift(swift: string) {
        try {
            const swiftResponse = await this.request<SwiftResponseDto>(`v1/swifts/${swift}`);
            if (swiftResponse.data.success)
                return swiftResponse.data.data;
        } 
        catch (err) {
            this.logger.error((err as any).message, (err as any).stack);
        }

        this.logger.error(`Invalid Swift Code: ${swift}`);
        return null;
    }

    async getDetailsByIban(iban: string) {
        try {
            const ibanResponse = await this.request<IbanResponseDto>(`v1/ibans/${iban}`);
            if (ibanResponse.data.success)
                return ibanResponse.data.data.swift;
            
            throw new Error(`Invalid IBAN: ${iban}`);
        } 
        catch (err) {
            this.logger.error((err as any).message, (err as any).stack);
        }

        return null;
    }

    private async request<T>(endpoint: string): Promise<AxiosResponse<T>> {
        const baseUrl = process.env.SWIFT_CODE_API_URL;
        return axios.get<T, AxiosResponse<T>>(`${baseUrl}/${endpoint}`, {
            headers: {Accept: 'application/json', 'X-Api-Key': String(process.env.SWIFT_CODE_API_KEY)}
        });
    }

    async getBankDetails(createBeneficiaryDto: CreateBeneficiaryDto | Beneficiary, user: User) {
        let details;
        if (createBeneficiaryDto.IBAN) {
            details = await this.getDetailsByIban(createBeneficiaryDto.IBAN);
            if (createBeneficiaryDto.bicSwift) {
                const detailsVerification = await this.getDetailsBySwift(createBeneficiaryDto.bicSwift);
                if (detailsVerification?.bank?.name !== details?.bank?.name) {
                    return {
                        bankName: details?.bank?.name,
                        bankNameMismatch: detailsVerification?.bank?.name,
                        bicSwift: details?.id,
                        bankAddress: details?.address,
                        branchName: details?.branch_name,
                        bankCountry: '',
                        country: createBeneficiaryDto.country,
                        city: createBeneficiaryDto.city,
                        address: createBeneficiaryDto.address
                    };
                }
            }
        }

        if (!details && createBeneficiaryDto.bicSwift)
            details = await this.getDetailsBySwift(createBeneficiaryDto.bicSwift);

        if (!details && isInUk(createBeneficiaryDto.bankCountry) && createBeneficiaryDto.accountNumber !== '' && createBeneficiaryDto.sortCode !== '')
            details = await this.getDetailsByAccountNumberAndSortCode(createBeneficiaryDto.accountNumber, createBeneficiaryDto.sortCode);

        if (details !== null && typeof details !== 'undefined') {
            return {
                bankName: details?.bank?.name,
                bankAddress: details?.address,
                branchName: details?.branch_name,
                bankCountry: details?.bank.country_id,
                country: createBeneficiaryDto.country,
                city: createBeneficiaryDto.city,
                address: createBeneficiaryDto.address
            };
        } 
        else {
            //Validate Mexico etc
            const currencyCloudData = createCurrencyCloudBeneficiaryDto(createBeneficiaryDto);
            const { errors: currencyCloudErrors, beneficiary } = await this.validateOnCurrencyCloud(currencyCloudData, '', user);
            return beneficiary
                ? {
                    bankName: beneficiary?.bank_name || 'UNKNOWN',
                    bankAddress: beneficiary.bank_address.join('\n'),
                    branchName: details?.branch_name,
                    bankCountry: beneficiary.bank_country,
                    country: createBeneficiaryDto.country,
                    city: createBeneficiaryDto.city,
                    address: createBeneficiaryDto.address
                }
                : {
                    errors: Object.keys(currencyCloudErrors).reduce((errors, k) => {
                        const v = k == 'routing_code' ? 'sortCode' : k;
                        errors[v] = currencyCloudErrors[k]
                            .map((e) => e.message)
                            .join(',');
                        return errors;
                    }, {})
                };
        }
    }

    async validateOnCurrencyCloud(data: CreateCurrencyCloudBeneficiaryDto, updaterId: string, user: User): Promise<any> {
        delete data.bankAddress;
        delete data.bankName;
        const validation = await this.currencyCloudService.validateBeneficiaryToCreate(data, updaterId, user);
        const errors = validation.response?.data?.error_messages || [];

        return { errors, beneficiary: !errors.length ? validation.data : null };
    }
}
