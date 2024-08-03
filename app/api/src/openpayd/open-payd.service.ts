import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { OpenPaydCurrencies, User } from '@cdaxfx/tools-models';
import axios from 'axios';
import { BeneficiariesService } from '../beneficiaries/services/beneficiaries.service';
import { FeesService } from '../fees/fees.service';
import { TransactionsService } from '../transactions/services/transactions.service';
import { CreateCurrencyBeneficiary, CreateCurrencyQuote, CreateCurrencyTopUp, CreateValidatePayment } from './model/create-currency-quote.dto';
import { CreateOpenPaydAccountDto } from './model/create-open-payd-account.dto';
import { CreateOpenPaydBeneficiaryDto } from './model/create-open-payd-beneficiary.dto';
import { CreateOpenPaydLinkedClientDto, UpdateOpenPaydLinkedClientDto } from './model/create-open-payd-linked-client';
import { getRoutingCodeByCountry } from './model/routing-code-type.enum';
import { OpenPaydInterface } from './open-payd.interface';

@Injectable()
export class OpenPaydService implements OpenPaydInterface {
    private readonly logger = new Logger(OpenPaydService.name);
    private token: string;
    private accountHolderId: string;
    private tokenExpiresIn: string;
    private tokenCreatedAt: Date | null;
    private currencyRatesCache: Map<string, object> = new Map();

    constructor(
        private readonly transactionsService: TransactionsService,
        private readonly feesService: FeesService,
        private readonly beneficiariesService: BeneficiariesService,
    ) { }

    async getBasicRate(from: string, to: string) {
        const currencyPair = `${from}${to}`;
        if (this.currencyRatesCache.get(currencyPair))
            return this.currencyRatesCache.get(currencyPair);
        
        const response = await this.getRequest(`transactions/exchange/quote/basic?currencyPairs=${currencyPair}`);
        if (response.status === 200) {
            this.currencyRatesCache = this.currencyRatesCache.set(currencyPair, response.data);
            return response.data;
        } 
        else {
            return response.data;
        }
    }

    async createAccount(account: CreateOpenPaydAccountDto): Promise<string> {
        throw new Error('createAccount not implemented');
    }

    async getLinkedClients(): Promise<any> {
        const response = await this.getRequest('linkedClient?size=1000');
        return response.data.content;
    }

    async createLinkedClient(contact: CreateOpenPaydLinkedClientDto): Promise<any> {
        const response = await this.postRequest('linkedClient', contact);
        if (response.status === 201) {
            return response.data;
        } 
        else {
            console.error('failed createLinkedClient', response.data);
            return response.data;
        }
    }

    async updateLinkedClient(id: string, contact: UpdateOpenPaydLinkedClientDto) {
        const response = await this.putRequest(`linkedClient/${id}`, contact);
        if (response.status === 200) {
            return response.data;
        } 
        else {
            console.error('failed updateLinkedClient', response.data);
            return response.data;
        }
    }

    async validateBeneficiaryToCreate(beneficiary: CreateOpenPaydBeneficiaryDto, user?: User): Promise<any> {
        try {
            const data = this.removeValidateBeneficiaryExtraParameters(beneficiary);
            const validation = await this.postRequest(
                'beneficiaries/validate',
                {
                    bankAccountCurrency: data.currency,
                    bankAccountCountry: data.bankCountry,
                    beneficiaryType: data.beneficiaryEntityType == 'individual' ? 'RETAIL' : 'CORPORATE',
                    bankAccountType: data.bankAccountType,
                    bankName: data.bankName,
                    bankAddress: data.bankAddress,
                    bankAccountHolderName: data.beneficiaryEntityType == 'individual'
                            ? `${data.beneficiaryFirstName} ${data.beneficiaryLastName}`
                            : `${data.beneficiaryCompanyName}`,
                    accountNumber: data.accountNumber,
                    iban: data.iban,
                    bic: data.bicSwift,
                    companyName: data.beneficiaryCompanyName,
                    title: 'Mr.',
                    beneficiaryFirstName: data.beneficiaryFirstName,
                    beneficiaryLastName: data.beneficiaryLastName,
                    beneficiaryBirthDate: data.beneficiaryDateOfBirth,
                    beneficiaryAddressLine: data.beneficiaryAddress,
                    beneficiaryCity: data.beneficiaryCity,
                    beneficiaryCountry: data.beneficiaryCountry,
                    beneficiaryPostalCode: data.beneficiaryPostcode,
                    bankRoutingCodes: [
                        {
                            routingCodeKey: getRoutingCodeByCountry(data.bankCountry),
                            routingCodeValue: data.routingCodeValue1
                        }
                    ]
                },
                {},
                user
            );
            return validation;
        } 
        catch (err) {
            this.logger.error('Beneficiary validation failed', (err as Error).stack, (err as Error).message);

            if (axios.isAxiosError(err)) {
                this.logger.error(err.response?.data);
                if (err.response && err.response.status === 400)
                    throw new BadRequestException('Beneficiary is invalid');
            }

            throw err;
        }
    }

    async createBeneficiary(beneficiary: CreateOpenPaydBeneficiaryDto, payment_types: string[], user?: User): Promise<string[]> {
        const createBeneficiary = {
            beneficiaryType: beneficiary.beneficiaryEntityType == 'individual' ? 'RETAIL' : 'CORPORATE',
            friendlyName: beneficiary.beneficiaryEntityType == 'individual'
                    ? `${beneficiary.beneficiaryFirstName} ${beneficiary.beneficiaryLastName}`
                    : beneficiary.beneficiaryCompanyName,
            companyName: beneficiary.beneficiaryCompanyName,
            title: 'Mr.',
            firstName: beneficiary.beneficiaryFirstName,
            lastName: beneficiary.beneficiaryLastName,
            tag: 'THIRD_PARTY'
        };
        const response = await this.postRequest('beneficiaries', createBeneficiary, {}, user);
        const bankDetails = {
            bankAccountCurrency: beneficiary.currency,
            beneficiaryType: beneficiary.beneficiaryEntityType == 'individual' ? 'RETAIL' : 'CORPORATE',
            beneficiaryCurrency: beneficiary.currency,
            beneficiaryAddressLine: beneficiary.beneficiaryAddress,
            beneficiaryCity: beneficiary.beneficiaryCity,
            beneficiaryCountry: beneficiary.beneficiaryCountry,
            beneficiaryPostalCode: beneficiary.beneficiaryPostcode,
            bankAccountCountry: beneficiary.bankCountry,
            paymentTypes: payment_types,
            iban: beneficiary.iban,
            bic: beneficiary.bicSwift,
            companyName: beneficiary.beneficiaryCompanyName,
            title: 'Mr.',
            beneficiaryFirstName: beneficiary.beneficiaryFirstName,
            beneficiaryLastName: beneficiary.beneficiaryLastName,
            accountNumber: beneficiary.accountNumber,
            bankAccountHolderName: beneficiary.beneficiaryEntityType == 'individual'
                    ? `${beneficiary.beneficiaryFirstName} ${beneficiary.beneficiaryLastName}`
                    : `${beneficiary.beneficiaryCompanyName}`,
            bankRoutingCodes: [],
            bankName: beneficiary.bankName,
            bankAddress: beneficiary.bankAddress
        };

        if (beneficiary.routingCodeValue1) {
            bankDetails.bankRoutingCodes = <any>[
                {
                    routingCodeKey: getRoutingCodeByCountry(beneficiary.bankCountry),
                    routingCodeValue: beneficiary.routingCodeValue1
                }
            ];
        }

        if (response.status === 201) {
            const beneficiaryId = response.data.id;
            await this.postRequest(`beneficiaries/${beneficiaryId}/bank-beneficiaries`, bankDetails, {}, user);
            return [beneficiaryId, payment_types.join(',')];
        }

        throw new Error("Beneficiary couldn't be created.");
    }

    async updateBeneficiary(id: string, beneficiary: CreateOpenPaydBeneficiaryDto, payment_types: string[], user?: User): Promise<string[]> {
        const updateBeneficiary = {
            beneficiaryType: beneficiary.beneficiaryEntityType == 'individual' ? 'RETAIL' : 'CORPORATE',
            friendlyName: beneficiary.beneficiaryEntityType == 'individual'
                    ? `${beneficiary.beneficiaryFirstName} ${beneficiary.beneficiaryLastName}`
                    : beneficiary.beneficiaryCompanyName,
            companyName: beneficiary.beneficiaryCompanyName,
            title: 'Mr.',
            firstName: beneficiary.beneficiaryFirstName,
            lastName: beneficiary.beneficiaryLastName,
            tag: 'THIRD_PARTY'
        };
        const response = await this.putRequest(`beneficiaries/${id}`, updateBeneficiary, {}, user);
        if (response.status === 200) {
            const bankDetails = {
                bankAccountCurrency: beneficiary.currency,
                beneficiaryType: beneficiary.beneficiaryEntityType == 'individual' ? 'RETAIL' : 'CORPORATE',
                beneficiaryCurrency: beneficiary.currency,
                beneficiaryAddressLine: beneficiary.beneficiaryAddress,
                beneficiaryCity: beneficiary.beneficiaryCity,
                beneficiaryCountry: beneficiary.beneficiaryCountry,
                beneficiaryPostalCode: beneficiary.beneficiaryPostcode,
                bankAccountCountry: beneficiary.bankCountry,
                paymentTypes: payment_types,
                iban: beneficiary.iban,
                bic: beneficiary.bicSwift,
                companyName: beneficiary.beneficiaryCompanyName,
                title: 'Mr.',
                beneficiaryFirstName: beneficiary.beneficiaryFirstName,
                beneficiaryLastName: beneficiary.beneficiaryLastName,
                accountNumber: beneficiary.accountNumber,
                bankAccountHolderName: beneficiary.beneficiaryEntityType == 'individual'
                        ? `${beneficiary.beneficiaryFirstName} ${beneficiary.beneficiaryLastName}`
                        : beneficiary.beneficiaryCompanyName,
                bankRoutingCodes: [],
                bankName: beneficiary.bankName,
                bankAddress: beneficiary.bankAddress
            };

            if (beneficiary.routingCodeValue1) {
                bankDetails.bankRoutingCodes = <any>[
                    {
                        routingCodeKey: getRoutingCodeByCountry(beneficiary.bankCountry),
                        routingCodeValue: beneficiary.routingCodeValue1
                    }
                ];
            }
            const bankBeneficiaries = await this.getRequest(`bank-beneficiaries/?parentBeneficiaryIds=${id}`, {}, user);
            if (!bankBeneficiaries.data?.content?.length) {
                await this.postRequest(`beneficiaries/${response.data.id}/bank-beneficiaries`, bankDetails, {}, user);
            } 
            else {
                const existingBeneficiaryBank = bankBeneficiaries.data.content[0];
                if (existingBeneficiaryBank.currency !== beneficiary.currency) {
                    await this.deleteRequest(`bank-beneficiaries/${existingBeneficiaryBank.id}`, {}, {}, user);
                    await this.postRequest(`beneficiaries/${response.data.id}/bank-beneficiaries`, bankDetails, {}, user);
                } 
                else {
                    await this.putRequest(`beneficiaries/bank-beneficiaries/${existingBeneficiaryBank.id}`, bankDetails, {}, user);
                }
            }
            return [response.data.id, payment_types.join(',')];
        }
        else {
            console.error('updateBeneficiary', response);
        }

        throw new Error("Beneficiary couldn't be updated.");
    }

    async getBalances(user: User | null) {
        try {
            const response = await this.getRequest(`accounts?size=100`, {}, user);
            if (response.status === 200) {
                return {
                    balances: response.data.content
                        .filter((account) => account.status == 'ACTIVE')
                        .map((account) => ({
                            account_id: account.id,
                            amount: Number(account.availableBalance.value).toFixed(2),
                            created_at: account.createdOn,
                            currency: account.availableBalance.currency,
                            id: account.internalAccountId,
                            updated_at: account.createdOn,
                            status: account.status
                        }))
                };
            }
        } 
        catch (err) {
            this.logger.error((err as any).message, (err as any).stack);
        }
        return null;
    }

    async getCurrencies(user: User) {
        return { currencies: OpenPaydCurrencies };
    }

    async getBeneficiaries(currency: string, user: User) {
        try {
            const beneficiaries = (
                await this.beneficiariesService.getActiveBeneficiariesByCurrency(user, currency)
            ).beneficiaries;
            const response = await this.getRequest(`bank-beneficiaries/?currencyIncluding=${currency}&size=100`, {}, user);
            if (response.status === 200) {
                return {
                    beneficiaries: response.data.content.filter((beneficiary) => {
                            return (beneficiaries.findIndex((beneficiaryFromDB) => beneficiaryFromDB.openPaydId == beneficiary.beneficiaryId) !== -1);
                        })
                        .map((beneficiary) => ({
                            account_number: beneficiary.accountNumber,
                            bank_account_holder_name: beneficiary.bankAccountHolderName,
                            bank_account_type: null,
                            bank_address: [
                                beneficiary.bankAddress
                                    ? beneficiary.bankAddress
                                    : beneficiaries[beneficiaries.findIndex((beneficiaryFromDB) => beneficiaryFromDB.openPaydId == beneficiary.beneficiaryId)].bankAddress
                            ],
                            bank_country: beneficiary.bankAccountCountry,
                            bank_name: beneficiary.bankName,
                            beneficiary_address: beneficiary.beneficiaryAddressLine ? [beneficiary.beneficiaryAddressLine] : [],
                            beneficiary_city: beneficiary.beneficiaryCity,
                            beneficiary_company_name: beneficiary.companyName,
                            beneficiary_country: beneficiary.beneficiaryCountry,
                            beneficiary_date_of_birth: null,
                            beneficiary_entity_type: beneficiary.beneficiaryType == 'RETAIL' ? 'individual' : 'business',
                            beneficiary_external_reference: null,
                            beneficiary_first_name: beneficiary.beneficiaryFirstName,
                            beneficiary_identification_type: null,
                            beneficiary_identification_value: null,
                            beneficiary_last_name: beneficiary.beneficiaryLastName,
                            beneficiary_postcode: beneficiary.beneficiaryPostalCode,
                            beneficiary_state_or_province: null,
                            bic_swift: beneficiary.bic,
                            created_at: '',
                            creator_contact_id: beneficiary.accountHolderId,
                            currency: beneficiary.currency,
                            default_beneficiary: 'false',
                            email: null,
                            iban: beneficiary.iban,
                            id: beneficiary.id,
                            beneficiaryId: beneficiary.beneficiaryId,
                            name: beneficiary.bankAccountHolderName,
                            payment_types: beneficiary.paymentTypes,
                            routing_code_type_1: beneficiary.bankRoutingCodes[0]?.routingCodeKey,
                            routing_code_type_2: beneficiary.bankRoutingCodes[1]?.routingCodeKey || null,
                            routing_code_value_1: beneficiary.bankRoutingCodes[0]?.routingCodeValue,
                            routing_code_value_2: beneficiary.bankRoutingCodes[1]?.routingCodeValue || null,
                            updated_at: ''
                        })),
                    pagination: this.convertContentToPagination(response.data)
                };
            }
        } 
        catch (err) {
            this.logger.error((err as any).message, (err as any).stack);
        }

        return null;
    }

    async getPayer(uuid: string, user: User) {
        throw new Error('getPayer not implemented');
    }

    async findDashboardInfo(module: string | string[], status: string | string[], user: User, completed?: string) {
        try {
            if (typeof status !== 'string')
                status = status.join('&status=');
            
            if (typeof module !== 'string')
                module = module.join('&type=');
            
            let query = `transactions?type=${module}&status=${status}&size=1000`;

            if (completed) {
                const date = new Date(completed);
                date.setHours(0, 0, 0, 0);
                const from = date.toISOString();
                date.setHours(23, 59, 59, 999);
                const to = date.toISOString();
                query += `&from=${from}&to=${to}`;
            }

            const response = await this.getRequest(query, {}, user);
            if (response.status === 200)
                return response.data.totalElements;
        } 
        catch (err) {
            this.logger.error((err as any).message, (err as any).stack);
        }
        return null;
    }

    convertContentToPagination(content: any) {
        return {
            current_page: content.pageable.pageNumber + 1,
            next_page: content.last ? -1 : content.pageable.pageNumber + 2,
            order: 'default',
            order_asc_desc: 'asc',
            per_page: content.pageable.pageSize,
            previous_page: content.first ? -1 : content.pageable.pageNumber,
            total_entries: content.totalElements,
            total_pages: content.totalPages
        };
    }

    async searchTransactions(
        user: User,
        shortReference?: string,
        action?: string,
        settles_at_from?: string,
        settles_at_to?: string,
        created_at_from?: string,
        created_at_to?: string,
        completed_at_from?: string,
        completed_at_to?: string,
        status?: string | string[],
        type?: string,
        amount_from?: number,
        amount_to?: number,
        currency?: string,
        scope?: string,
        page?: number,
        account_id?: string
    ) {
        try {
            let query = `transactions?size=1000`;
            
            if (shortReference) 
                query += `&shortId=${shortReference}`;

            if (action) {
                if (action == 'payment_failure')
                    query += `&status=FAILED&type=PAYOUT`;
                else if (action == 'payment')
                    query += '&type=PAYOUT';
                else if (action == 'conversion')
                    query += '&type=EXCHANGE';
                else if (action == 'funding')
                    query += '&type=PAYIN';
            } 
            else {
                query += '&type=PAYOUT&type=EXCHANGE&type=PAYIN';
            }

            if (settles_at_from) {
                const date = new Date(settles_at_from);
                date.setHours(0, 0, 0, 0);
                const from = date.toISOString();
                query += `&from=${from}`;
            }

            if (settles_at_to) {
                const date = new Date(settles_at_to);
                date.setHours(23, 59, 59, 999);
                const to = date.toISOString();
                query += `&to=${to}`;
            }

            if (created_at_from) {
                const date = new Date(created_at_from);
                date.setHours(0, 0, 0, 0);
                const from = date.toISOString();
                query += `&from=${from}`;
            }

            if (created_at_to) {
                const date = new Date(created_at_to);
                date.setHours(23, 59, 59, 999);
                const to = date.toISOString();
                query += `&to=${to}`;
            }

            if (completed_at_from) {
                const date = new Date(completed_at_from);
                date.setHours(0, 0, 0, 0);
                const from = date.toISOString();
                query += `&from=${from}`;
            }

            if (completed_at_to) {
                const date = new Date(completed_at_to);
                date.setHours(23, 59, 59, 999);
                const to = date.toISOString();
                query += `&to=${to}`;
            }

            if (status) {
                if (status == 'pending')
                    status = ['INITIATED', 'PROCESSING', 'PENDING', 'RELEASED'];
                else if (status == 'completed')
                    status = 'COMPLETED';
                else if (typeof status === 'string')
                    status = status.toLocaleUpperCase();
                
                if (typeof status !== 'string')
                    status = status.join('&status=');
                
                query += `&status=${status}`;
            }

            if (type) 
                query += `&type=${type}`;

            if (amount_from) 
                query += `&amountFrom=${amount_from}`;

            if (amount_to) 
                query += `&amountTo=${amount_to}`;

            if (page) 
                query += `&page=${page}`;

            if (currency && !account_id) {
                const balances = await this.getBalances(user);
                const currencyAccount = balances?.balances?.filter((b) => b.currency == currency).map((b) => b.account_id);
                query += `&accountId=${currencyAccount.join('&accountId=')}`;
            } 
            else if (account_id) {
                query += `&accountId=${account_id}`;
            }

            const response = await this.getRequest(query, {}, user);
            if (response.status === 200) {
                const transactions = await Promise.all(
                    response.data.content.map(async (t) => {
                        if (t.type == 'EXCHANGE') {
                            //FIXME: duplicate the transaction to show the 'incoming' part
                        }
                        const dbTX = await this.transactionsService.findByShortId(t.shortId, 'openpayd');
                        const amountValue = t.type == 'EXCHANGE' && currency && t.buyAmount.currency == currency ? t.buyAmount.value : t.totalAmount.value;
                        const currencyValue = t.type == 'EXCHANGE' && currency && t.buyAmount.currency == currency ? t.buyAmount.currency : t.totalAmount.currency;
                        const feeAmount =
                            (t.type == 'EXCHANGE' && ((currency && currency !== t.amount.currency) || t.fixedSide == 'BUY')) ||
                                t.type === 'PAYOUT'
                                ? Number(dbTX?.fee_amount || 0)
                                : 0;
                        const buyFeeAmount = t.buyAmount?.value ? Number(dbTX?.fee_amount || 0) : 0;

                        let related_entity_type = t.type;
                        if (related_entity_type == 'EXCHANGE')
                            related_entity_type = 'conversion';
                        else if (related_entity_type == 'PAYOUT')
                            related_entity_type = 'payment';
                        else if (related_entity_type == 'PAYIN')
                            related_entity_type = 'inbound_funds';
                        
                        return {
                            account_name: t.sourceInfo.internalAccountId || t.source,
                            account_id: t.accountId,
                            action: related_entity_type,
                            amount: (
                                Math.abs(amountValue) +
                                feeAmount *
                                (t.type == 'EXCHANGE'
                                    ? t.fixedSide == 'BUY'
                                        ? Number(amountValue) < 0
                                            ? 0
                                            : -1
                                        : -1
                                    : 1)
                            ).toFixed(2),
                            buy_amount: t.buyAmount && t.buyAmount.currency !== currencyValue ? (Math.abs(t.buyAmount?.value) - buyFeeAmount).toFixed(2) : null,
                            buy_currency: t.buyAmount && t.buyAmount.currency !== currencyValue ? t.buyAmount?.currency : null,
                            sell_amount: t.sellAmount && t.sellAmount.currency !== currencyValue ? Math.abs(t.sellAmount?.value).toFixed(2) : null,
                            sell_currency: t.sellAmount && t.sellAmount.currency !== currencyValue ? t.sellAmount?.currency : null,
                            balance_amount: null,
                            balance_id: t.accountId,
                            completed_at: t.paymentDate,
                            created_at: t.createdDate,
                            currency: currencyValue,
                            id: t.transactionId,
                            reason: dbTX?.reason || t.transactionReference,
                            related_entity_id: t.id,
                            related_entity_short_reference: t.shortId,
                            related_entity_type,
                            settles_at: t.paymentDate,
                            status: t.status,
                            type: Number(amountValue) < 0 ? 'debit' : 'credit',
                            updated_at: t.updatedDate
                        };
                    })
                );
                return {
                    pagination: this.convertContentToPagination(response.data),
                    transactions
                };
            }
        } 
        catch (err) {
            this.logger.error('Something went wrong', (err as any).message, (err as any).stack);
        }
        return null;
    }

    async getTransaction(account_id: string, currency: string, settles_at_from: string, completed_at_from: string, page: number, user: User) {
        try {
            //FIXME
            const response = await this.getRequest(`transactions?currency=${currency}&page=${page - 1}`, {}, user);
            if (response.status === 200) {
                return {
                    pagination: this.convertContentToPagination(response.data),
                    transactions: response.data.content
                };
            }
        } 
        catch (err) {
            this.logger.error((err as any).message, (err as any).stack);
        }
        return null;
    }

    async getPayinDetails(transaction_id: string, user: User | null) {
        const response = await this.getRequest(`transactions/payin/${transaction_id}`, {}, user);
        return response.data;
    }

    async getTransactionRef(short_ref: string, user: User) {
        const transaction = await this.getPayment(short_ref, user);
        return { transactions: [transaction] };
    }

    async getConversion(uuid: string, user: User) {
        try {
            const response = await this.getRequest(`transactions/${uuid}`, {}, user);
            if (response.status === 200) {
                const t = response.data;
                const currency = t.buyAmount.currency;
                const amountValue = t.type == 'EXCHANGE' && currency && t.buyAmount.currency == currency ? t.buyAmount.value : t.amount.value;
                const currencyValue = t.type == 'EXCHANGE' && currency && t.buyAmount.currency == currency ? t.buyAmount.currency : t.amount.currency;
                
                let related_entity_type = t.type;
                if (related_entity_type == 'EXCHANGE')
                    related_entity_type = 'conversion';
                else if (related_entity_type == 'PAYOUT')
                    related_entity_type = 'payment';
                else if (related_entity_type == 'PAYIN')
                    related_entity_type = 'inbound_funds';
                
                const dbTX = await this.transactionsService.findByShortId(t.shortId, 'openpayd');
                const feeAmount = Number(dbTX?.fee_amount || 0);
                const buyAmount = Number(t.buyAmount.value - feeAmount).toFixed(2);
                const sellAmount = Number(t.sellAmount.value).toFixed(2);
                const fxRate = Number(Number(buyAmount) / Number(sellAmount)).toFixed(5);
                
                return {
                    sell_currency: t.sellAmount.currency,
                    buy_currency: t.buyAmount.currency,
                    client_sell_amount: sellAmount,
                    client_buy_amount: buyAmount,
                    short_reference: t.shortId,
                    conversion_date: t.updatedDate,
                    core_rate: fxRate,
                    client_rate: fxRate,
                    account_id: t.accountId,
                    action: 'conversion',
                    amount: Math.abs(amountValue).toFixed(2),
                    balance_amount: null,
                    balance_id: t.accountId,
                    completed_at: t.paymentDate,
                    created_at: t.createdDate,
                    currency: currencyValue,
                    id: t.transactionId,
                    reason: t.transactionReference,
                    related_entity_id: t.id,
                    related_entity_short_reference: t.shortId,
                    related_entity_type,
                    settles_at: t.paymentDate,
                    status: t.status,
                    type: Number(amountValue) > 0 ? 'debit' : 'credit',
                    updated_at: t.updatedDate,
                    fee_amount: null,
                    fee_currency: null
                };
            }
        } 
        catch (err) {
            this.logger.error((err as any).message, (err as any).stack);
        }
        return null;
    }

    async splitPreview(uuid: string, amount: string, user: User) {
        // FIXME ?
        return null;
    }

    async dateChange(uuid: string, new_settlement_date: string) {
        // FIXME ?
        return null;
    }

    async split(uuid: string, amount: string, user: User) {
        // FIXME ?
        return null;
    }

    async getPayment(uuid: string, user: User) {
        try {
            const response = await this.getRequest(`transactions/${uuid}`, {}, user);
            if (response.status === 200) {
                const t = response.data;
                
                let pay_in_details = null;
                if (t.type == 'PAYIN')
                    pay_in_details = await this.getPayinDetails(t.transactionId, user);
                
                const dbTX = await this.transactionsService.findByShortId(t.shortId, 'openpayd');
                const amountValue = t.amount.value;
                
                let related_entity_type = t.type;
                if (related_entity_type == 'EXCHANGE')
                    related_entity_type = 'conversion';
                else if (related_entity_type == 'PAYOUT')
                    related_entity_type = 'payment';
                else if (related_entity_type == 'PAYIN')
                    related_entity_type = 'inbound_funds';
                
                const feeAmount = Number(dbTX?.fee_amount);

                return {
                    short_reference: t.shortId,
                    conversion_date: t.updatedDate,
                    core_rate: t.fxRate,
                    account_id: t.accountId,
                    action: related_entity_type,
                    account_name: t.sourceInfo.internalAccountId,
                    amount: Math.abs(amountValue).toFixed(2),
                    balance_amount: null,
                    balance_id: t.accountId,
                    completed_at: t.paymentDate,
                    created_at: t.createdDate,
                    currency: t.amount.currency,
                    payment_type: t.paymentType,
                    payment_date: t.paymentDate,
                    id: t.transactionId,
                    reason: dbTX?.reason || t.comment,
                    reference: t.transactionReference,
                    related_entity_id: t.id,
                    related_entity_short_reference: t.shortId,
                    related_entity_type,
                    settles_at: t.paymentDate,
                    status: t.status !== 'PENDING' ? t.status : 'ready_to_send',
                    type: Number(amountValue) > 0 && related_entity_type != 'inbound_funds' ? 'debit' : 'credit',
                    updated_at: t.updatedDate,
                    fee_amount: Number(Number(t.fee.value * -1) + feeAmount).toFixed(2),
                    fee_currency: t.fee.currency,
                    beneficiary_id: t.destinationInfo.identifier,
                    pay_in_details
                };
            }
        } 
        catch (err) {
            this.logger.error((err as any).message, (err as any).stack);
        }
        return null;
    }

    async getBeneficiary(uuid: string, user: User) {
        try {
            const response = await this.getRequest(`beneficiaries/${uuid}`, {}, user);
            if (response.status === 200)
                return response.data;
        } 
        catch (err) {
            this.logger.error((err as any).message, (err as any).stack);
        }
        return null;
    }

    async getBankBeneficiary(uuid: string, user: User) {
        try {
            const response = await this.getRequest(`bank-beneficiaries/${uuid}`, {}, user);
            if (response.status === 200) {
                const beneficiary = response.data;
                return {
                    account_number: beneficiary.accountNumber,
                    bank_account_holder_name: beneficiary.bankAccountHolderName,
                    bank_account_type: null,
                    bank_address: [beneficiary.bankAddress],
                    bank_country: beneficiary.bankAccountCountry,
                    bank_name: beneficiary.bankName,
                    beneficiary_address: beneficiary.beneficiaryAddressLine ? [beneficiary.beneficiaryAddressLine] : [],
                    beneficiary_city: beneficiary.beneficiaryCity,
                    beneficiary_company_name: beneficiary.companyName,
                    beneficiary_country: beneficiary.beneficiaryCountry,
                    beneficiary_date_of_birth: null,
                    beneficiary_entity_type: beneficiary.beneficiaryType == 'RETAIL' ? 'individual' : 'business',
                    beneficiary_external_reference: null,
                    beneficiary_first_name: beneficiary.beneficiaryFirstName,
                    beneficiary_identification_type: null,
                    beneficiary_identification_value: null,
                    beneficiary_last_name: beneficiary.beneficiaryLastName,
                    beneficiary_postcode: beneficiary.beneficiaryPostalCode,
                    beneficiary_state_or_province: null,
                    bic_swift: beneficiary.bic,
                    created_at: '',
                    creator_contact_id: beneficiary.accountHolderId,
                    currency: beneficiary.currency,
                    default_beneficiary: 'false',
                    email: null,
                    iban: beneficiary.iban,
                    id: beneficiary.id,
                    beneficiaryId: beneficiary.beneficiaryId,
                    name: beneficiary.bankAccountHolderName,
                    payment_types: beneficiary.paymentTypes,
                    routing_code_type_1: beneficiary.bankRoutingCodes[0]?.routingCodeKey,
                    routing_code_type_2: beneficiary.bankRoutingCodes[1]?.routingCodeKey || null,
                    routing_code_value_1: beneficiary.bankRoutingCodes[0]?.routingCodeValue,
                    routing_code_value_2: beneficiary.bankRoutingCodes[1]?.routingCodeValue || null,
                    updated_at: ''
                };
            }
        } 
        catch (err) {
            this.logger.error((err as any).message, (err as any).stack);
        }
        return null;
    }

    async getContact(contact_id: string, user: User) {
        throw new Error('getContact not implemented');
    }

    async getAccounts(user: User) {
        throw new Error('getAccounts not implemented');
    }

    async createCurrencyAcccount(currency: string, user: User | null) {
        try {
            const response = await this.postRequest(
                `accounts`,
                {
                    currency,
                    friendlyName: currency
                },
                {},
                user
            );

            if (response.status === 201)
                return response.data;
            else
                return response.response.data;
        } 
        catch (err) {
            this.logger.error((err as any).message, (err as any).stack);
        }
    }

    async getCurrentAccount(user: User) {
        const clients = await this.getLinkedClients();
        const currentAccount = clients.filter((c) => c.accountHolderId == user.contact?.account.openPaydId)[0];
        return currentAccount;
    }

    async getAccount(account_id: string, user: User | 'hook') {
        try {
            const response = await this.getRequest(`accounts/${account_id}`);
            if (response.status === 200) 
                return response.data;
            else 
                return '';
        } 
        catch (err) {
            this.logger.error((err as any).message);
            return '';
        }
    }

    async getAccountHolder(accountHolderId: string) {
        try {
            const response = await this.getRequest(`linkedClient/${accountHolderId}`);
            if (response.status === 200) 
                return response.data;
            else 
                return '';
        } 
        catch (err) {
            this.logger.error((err as any).message);
            return '';
        }
    }

    async getSender(entity_id: string, user: User) {
        console.error('getSender not implemented');
        return null;
    }

    async getContacts(account_id: string, user: User) {
        throw new Error('getContacts not implemented');
    }

    async getSettleAccounts(currency: string, account: string, user: User) {
        try {
            const response = await this.getRequest(`bank-accounts?currency=${currency}&status=ACTIVE`, {}, user);
            if (response.status === 200) {
                return {
                    settlement_accounts: response.data.map((account) => ({
                        bank_account_holder_name: account.bankAccountHolderName,
                        account_number: account.accountNumber,
                        bank_address: [account.bankAddress],
                        bank_country: account.bankCountry,
                        bank_name: account.bankName,
                        beneficiary_address: '',
                        beneficiary_country: '',
                        currency: account.currency,
                        iban: account.iban,
                        routing_code_type_1: account.routingCodeEntries?.length ? account.routingCodeEntries[0].routingCodeKey : '',
                        routing_code_value_1: account.routingCodeEntries?.length ? account.routingCodeEntries[0].routingCodeValue : '',
                        bic_swift: account.bic
                    }))
                };
            }
        } 
        catch (err) {
            this.logger.error((err as any).message, (err as any).stack);
        }

        return null;
    }

    async getCurrencyQuote(buy_currency: string, sell_currency: string, fixed_side: string, amount: string, date: string, user: User) {
        try {
            const balancesRequest = await this.getBalances(user);
            const balances = balancesRequest?.balances;
            const buy_currency_account =
                balances[
                    balances.findIndex((balance) =>
                        buy_currency.length == 3 ? balance.currency == buy_currency : balance.id == buy_currency
                    )
                ].account_id;
            const sell_currency_account =
                balances[
                    balances.findIndex((balance) =>
                        sell_currency.length == 3 ? balance.currency == sell_currency : balance.id == sell_currency,
                    )
                ].account_id;
            const rawFeeAmount = await this.feesService.getRawFeeAmount(
                amount,
                user.contact?.account.openPaydId,
                'conversion',
                sell_currency_account
            );
            const conversion_amount =
                fixed_side == 'sell'
                    ? Number(amount).toFixed(2)
                    : Number(Number(amount) + (Number(amount) * Number(rawFeeAmount.amount)) / 100).toFixed(2);
            const response = await this.postRequest(
                `transactions/exchange/quote/detailed`,
                {
                    fixedSide: fixed_side.toUpperCase(),
                    amount: conversion_amount,
                    destination: {
                        identifier: buy_currency_account,
                        type: 'ACCOUNT'
                    },
                    source: {
                        identifier: sell_currency_account,
                        type: 'ACCOUNT'
                    }
                },
                {},
                user
            );

            if (response.status === 200) {
                const sellAmount = Number(response.data.sellAmount.value).toFixed(2);
                const buyAmount = Number(fixed_side == 'sell' ? Number((response.data.buyAmount.value * (100 - rawFeeAmount.amount)) / 100) : amount).toFixed(2);
                const fxRate = Number(Number(buyAmount) / Number(sellAmount)).toFixed(5);
                return {
                    client_buy_amount: buyAmount,
                    client_buy_currency: response.data.buyAmount.currency,
                    client_rate: fxRate,
                    client_sell_amount: sellAmount,
                    client_sell_currency: response.data.sellAmount.currency,
                    core_rate: fxRate,
                    currency_pair: `${response.data.sellAmount.currency}${response.data.buyAmount.currency}`,
                    deposit_amount: 0,
                    deposit_required: false,
                    fixed_side,
                    settlement_cut_off_time: new Date(response.data.quoteValidUntil),
                    quoteId: response.data.quoteId
                };
            } 
            else {
                console.error('quotePreview error', response);
            }
        } 
        catch (err) {
            this.logger.error((err as any).message, (err as any).stack);
        }

        return null;
    }

    async getDeliveryDate(currency: string, country: string, date: string, type: string, user: User) {
        console.error('getDeliveryDate not available');
        return null;
    }

    async postCurrencyQuote(data: CreateCurrencyQuote, user: User) {
        try {
            const balancesRequest = await this.getBalances(user);
            const balances = balancesRequest?.balances;
            const buy_currency_account = balances[balances.findIndex((balance) => data.buy_account_id ? balance.id == data.buy_account_id : balance.currency == data.buy_currency)].account_id;
            const sell_currency_account = balances[balances.findIndex((balance) => data.sell_account_id ? balance.id == data.sell_account_id : balance.currency == data.sell_currency)].account_id;
            const response = await this.postRequest(
                `transactions/exchange`,
                {
                    quoteId: data.quoteId || '',
                    fixedSide: 'SELL',
                    amount: {
                        value: data.amount,
                        currency: data.sell_currency
                    },
                    destination: {
                        identifier: buy_currency_account,
                        type: 'ACCOUNT'
                    },
                    source: {
                        identifier: sell_currency_account,
                        type: 'ACCOUNT'
                    }
                },
                {},
                user
            );

            if (response.status === 201) {
                const quoteData = response.data;
                if (process.env.OPENPAYD_LOGIN == 'michailpayd') {
                    const finish = await this.putRequest(
                        `simulator/exchange/${quoteData.transactionId}`,
                        { status: 'COMPLETED'},
                        {},
                        user
                    );
                }

                const rawFee = await this.feesService.getRawFeeAmount(
                    quoteData.buyAmount.value,
                    user.contact?.account.openPaydId,
                    'conversion',
                    quoteData.buyAmount.currency
                );
                const amountForFee = data.fixed_side == 'sell' ? quoteData.buyAmount.value : (quoteData.buyAmount.value / (rawFee.amount + 100)) * 100;
                const feeAmount = await this.feesService.getFee(
                    amountForFee,
                    user.contact?.account.openPaydId,
                    'conversion',
                    quoteData.buyAmount.currency
                );
                const buyAmount = Number(quoteData.buyAmount.value - feeAmount).toFixed(2);
                const clientFxRate = Number(Number(buyAmount) / Number(quoteData.sellAmount.value)).toFixed(5);
                
                await this.transactionsService.create(
                    {
                        action: 'conversion',
                        gateway: 'openpayd',
                        account_id: user.contact?.account.openPaydId,
                        balance_id: data.sell_account_id,
                        destination_balance_id: data.buy_account_id,
                        currency: quoteData.sellAmount.currency,
                        buy_currency: quoteData.buyAmount.currency,
                        amount: quoteData.sellAmount.value,
                        buy_amount: quoteData.buyAmount.value,
                        client_rate: clientFxRate,
                        core_rate: quoteData.fxRate,
                        fee_amount: feeAmount,
                        fee_currency: quoteData.buyAmount.currency,
                        fixed_side: quoteData.fixedSide,
                        short_id: quoteData.shortId,
                        status: quoteData.status,
                        transaction_id: quoteData.transactionId,
                        gateway_fee_amount: quoteData.fee.value,
                        gateway_fee_currency: quoteData.fee.currency
                    },
                    user
                );

                return {
                    account_id: quoteData.accountId,
                    buy_currency: quoteData.buyAmount.currency,
                    client_buy_amount: Number(quoteData.buyAmount.value - feeAmount).toFixed(2),
                    client_rate: clientFxRate,
                    client_sell_amount: Number(quoteData.sellAmount.value).toFixed(2),
                    conversion_date: quoteData.createdDate,
                    core_rate: clientFxRate,
                    created_at: quoteData.createdDate,
                    creator_contact_id: quoteData.accountId,
                    currency_pair: `${quoteData.sellAmount.currency}${quoteData.buyAmount.currency}`,
                    deposit_amount: '0.00',
                    deposit_currency: '',
                    deposit_required: false,
                    deposit_required_at: '',
                    deposit_status: 'not_required',
                    fixed_side: quoteData.fixedSide,
                    id: quoteData.id,
                    mid_market_rate: clientFxRate,
                    partner_buy_amount: buyAmount,
                    partner_rate: clientFxRate,
                    partner_sell_amount: quoteData.sellAmount.value,
                    payment_ids: [],
                    sell_currency: quoteData.sellAmount.currency,
                    settlement_date: quoteData.createdDate,
                    short_reference: quoteData.shortId,
                    status: quoteData.status,
                    unallocated_funds: '',
                    unique_request_id: '',
                    updated_at: quoteData.createdDate
                };
            } 
            else {
                console.error('****CONVERSION error*****', response, response?.status, response.response?.data?.errors, response.data);
                return null;
            }
        } 
        catch (err) {
            this.logger.error((err as any).message, (err as any).stack);
        }

        return null;
    }

    async postCurrencyTopUp(data: CreateCurrencyTopUp, user: User) {
        return null;
    }

    async postCurrencyBeneficiary(data: CreateCurrencyBeneficiary, user: User) {
        try {
            const response = await this.postRequest('v2/beneficiaries/create', data, {}, user);
            if (response.status === 200) 
                return response.data;
        } 
        catch (err) {
            this.logger.error((err as any).message, (err as any).stack);
        }
        return null;
    }

    async validatePayment(data: CreateValidatePayment, user: User) {
        console.error('validatePayment not available');
        return null;
    }

    async getFees(data: CreateValidatePayment, payment_type: string, user: User) {
        try {
            const pay_account = data.account_id;
            const response = await this.postRequest(
                'transactions/fees',
                {
                    amount: {
                        currency: data.currency,
                        value: Number(data.amount)
                    },
                    source: {
                        identifier: pay_account,
                        type: 'ACCOUNT'
                    },
                    destination: {
                        identifier: data.beneficiary_id,
                        type: 'BANK'
                    },
                    paymentType: payment_type,
                    type: 'PAYOUT'
                },
                {},
                user
            );

            if (response.status === 200) {
                const payment = response.data;
                const feeAmount = await this.feesService.getFee(
                    data.amount,
                    user.contact?.account.openPaydId,
                    'payment',
                    data.currency,
                    payment_type
                );
                return {
                    fee_amount: Number(Number(payment.feeAmount.value) + feeAmount).toFixed(2),
                    fee_currency: payment.feeAmount.currency,
                };
            } 
            else {
                console.error('fee error?', response.response);
                return { error: response.response.data };
            }
        } 
        catch (err) {
            this.logger.error((err as any).message, (err as any).stack);
        }
        return null;
    }

    async createPayment(data: CreateValidatePayment, user: User) {
        try {
            const pay_account = data.account_id;
            const response = await this.postRequest(
                'transactions/bank-payouts',
                {
                    accountId: pay_account,
                    beneficiaryId: data.beneficiary_id,
                    amount: {
                        currency: data.currency,
                        value: Number(data.amount),
                    },
                    paymentType: data.payment_type,
                    reference: data.reference,
                    paymentDate: data.payment_date,
                    reasonCode: 'FUNDS'
                },
                {},
                user
            );

            if (response.status === 201) {
                const payment = response.data;
                const feeAmount = await this.getFeeAmount(
                    String(pay_account),
                    payment.shortId,
                    data,
                    user,
                    payment.sourceInfo.accountHolderId,
                    data.payment_type
                );
                
                if (process.env.OPENPAYD_LOGIN == 'michailpayd') {
                    const finish = await this.postRequest(
                        `simulator/payout/${payment.id}`,
                        { status: 'COMPLETED'},
                        {},
                        user
                    );
                }

                await this.transactionsService.create(
                    {
                        action: 'payment',
                        gateway: 'openpayd',
                        account_id: user?.contact?.account.openPaydId,
                        balance_id: payment.sourceInfo.internalAccountId,
                        currency: payment.amount.currency,
                        amount: Number(payment.amount.value * -1).toFixed(2),
                        fee_amount: feeAmount,
                        fee_currency: data.currency,
                        short_id: payment.shortId,
                        status: payment.status,
                        transaction_id: payment.transactionId,
                        gateway_fee_amount: payment.fee.value,
                        gateway_fee_currency: payment.fee.currency,
                        beneficiary_id: payment.destinationInfo.identifier,
                        payment_date: payment.paymentDate,
                        payment_type: payment.paymentType,
                        reason: data.reason,
                        reference: data.reference,
                        payment_reason: payment.reason,
                        purpose_code: data.purpose_code
                    },
                    user
                );

                return {
                    amount: Number(payment.amount.value * -1).toFixed(2),
                    authorisation_steps_required: '0',
                    beneficiary_id: payment.destinationInfo.identifier,
                    charge_type: 'shared',
                    conversion_id: null,
                    created_at: payment.createdDate,
                    creator_contact_id: payment.createdBy,
                    currency: payment.amount.currency,
                    failure_reason: '',
                    failure_returned_amount: '0.00',
                    fee_amount: Number(Number(payment.fee.value) + feeAmount).toFixed(2),
                    fee_currency: payment.fee.currency,
                    id: payment.transactionId,
                    related_entity_id: payment.id,
                    last_updater_contact_id: payment.createdBy,
                    payer_details_source: 'account',
                    payer_id: payment.sourceInfo.identifier,
                    payment_date: payment.paymentDate,
                    payment_group_id: null,
                    payment_type: payment.paymentType,
                    purpose_code: data.purpose_code,
                    reason: data.reason,
                    reference: payment.transactionReference,
                    short_reference: payment.shortId,
                    status: payment.status,
                    transferred_at: '',
                    ultimate_beneficiary_name: null,
                    unique_request_id: null,
                    updated_at: payment.updatedDate
                };
            } 
            else {
                console.error('payment error?', response.response);
                return { error: response.response.data };
            }
        } 
        catch (err) {
            this.logger.error((err as any).message, (err as any).stack);
        }
        return null;
    }

    async getMainBalance(currency: string) {
        const mainBalances = await this.getBalances(null);
        const mainBalance = mainBalances?.balances ?.filter((b) => b.currency == currency).map((b) => b.account_id);
        if (!mainBalance.length) {
            const mainBalanceID = await this.createCurrencyAcccount(currency, null);
            return mainBalanceID.id;
        } 
        else {
            return mainBalance[0];
        }
    }

    async getFeeAmount(
        take_fees_from: string,
        transaction_id: string,
        data: CreateValidatePayment | CreateCurrencyQuote,
        user: User | null,
        account_id: string,
        payment_type: string | undefined
    ) {
        try {
            const currency = data instanceof CreateValidatePayment ? data.currency : data.sell_currency;
            const type = data instanceof CreateValidatePayment ? 'payment' : 'conversion';
            const feeAmount = await this.feesService.getFee(data.amount, account_id, type, currency, payment_type);
            if (feeAmount <= 0) 
                return 0;
            return feeAmount;
        } 
        catch (err) {
            this.logger.error((err as any).message, (err as any).stack);
        }
        return 0;
    }

    async createFeeTransfer(
        type: string,
        take_fees_from: string,
        transaction_id: string,
        amount: number,
        currency: string,
        user: User | null,
        account_id: string,
        payment_type: string | undefined
    ) {
        try {
            const feeAmount = await this.feesService.getFee(amount, account_id, type, currency, payment_type);
            if (feeAmount <= 0) return 0;
            const feeReceiver = await this.getMainBalance(currency);
            const response = await this.postRequest(
                'transactions',
                {
                    type: 'TRANSFER',
                    amount: {
                        currency: currency,
                        value: feeAmount
                    },
                    source: {
                        identifier: take_fees_from,
                        type: 'ACCOUNT'
                    },
                    destination: {
                        identifier: feeReceiver,
                        type: 'ACCOUNT'
                    },
                    comment: 'CDAX_FEE',
                    additionalParams: {
                        transaction_id,
                        type
                    }
                },
                {},
                user
            );

            if (response.status === 201) {
                const payment = response.data;
                return feeAmount;
            } 
            else {
                console.error('fee payment error?', response.response.data);
            }
        } 
        catch (err) {
            this.logger.error((err as any).message, (err as any).stack);
        }
        return 0;
    }

    async editPayment(data: CreateValidatePayment, user: User) {
        return null;
    }

    async cancelConversion(id: string, user: User) {
        return null;
    }

    async renameLinkedClient(user: User, id: string, friendlyName: string) {
        const rename = await this.putRequest(`linkedClient/${id}`, { friendlyName }, {}, user);
        return rename;
    }

    async deletePayment(id: string, user: User) {
        try {
            const response = await this.putRequest(`transactions/${id}`, { status: 'CANCELLED' }, {}, user);
            if (response.status === 200)
                return response.data;
        } 
        catch (err) {
            this.logger.error((err as any).message, (err as any).stack);
        }
        return null;
    }

    async deleteBeneficiary(id: string, user: User): Promise<void> {
        const deleteRequest = await this.deleteRequest(`beneficiaries/${id}`, {}, {}, user);
        return deleteRequest;
    }

    private async login() {
        if (!this.isTokenExpired())
            return;
        
        if (this.token)
            await this.logout();
        
        const login = process.env.OPENPAYD_LOGIN;
        const password = process.env.OPENPAYD_PASSWORD;
        const response = await this.postRequest(
            'oauth/token?grant_type=client_credentials',
            {},
            {
                Authorization: 'Basic ' + btoa(`${login}:${password}`),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        );

        if (response.status === 200) {
            this.token = response.data.access_token;
            this.accountHolderId = response.data.accountHolderId;
            this.tokenCreatedAt = new Date();
            this.tokenExpiresIn = response.data.expires_in;
        } 
        else {
            console.error('tokenresponse', response);
        }
    }

    private isTokenExpired() {
        return (!this.tokenCreatedAt || new Date().valueOf() - this.tokenCreatedAt.valueOf() > 1000 * (Number(this.tokenExpiresIn) - 3));
    }

    private async logout(): Promise<void> {
        if (!this.token) 
            return;

        try {
            this.tokenCreatedAt = null;
            this.accountHolderId = '';
            this.tokenExpiresIn = '';
            this.token = '';
        } 
        catch (err) {
            this.logger.error(`Logging out failed: ${(err as Error).message}`);
        }
    }

    private removeValidateBeneficiaryExtraParameters(beneficiary: CreateOpenPaydBeneficiaryDto): Record<string, string> {
        const allowedKeys = [
            'bankCountry',
            'currency',
            'beneficiaryAddress',
            'beneficiaryCountry',
            'accountNumber',
            'routingCodeType1',
            'routingCodeValue1',
            'routingCodeType2',
            'routingCodeValue2',
            'bicSwift',
            'iban',
            'bankAddress',
            'bankName',
            'bankAccountType',
            'beneficiaryEntityType',
            'beneficiaryCompanyName',
            'beneficiaryFirstName',
            'beneficiaryLastName',
            'beneficiaryCity',
            'beneficiaryPostcode',
            'beneficiaryStateOrProvince',
            'beneficiaryDateOfBirth',
            'beneficiaryIdentificationType',
            'beneficiaryIdentificationValue',
            'paymentTypes',
            'onBehalfOf'
        ];

        return Object.keys(beneficiary).reduce((acc, key) => {
            if (allowedKeys.includes(key))
                acc[key] = beneficiary[key];

            return acc;
        }, {});
    }

    private async deleteRequest(endpoint: string, data: Record<string, any> = {}, headers: Record<string, string> = {}, user: User | null = null) {
        if (endpoint.indexOf('oauth/token') === -1) {
            await this.login();
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        if (user && user.contact?.account?.openPaydId)
            headers['x-account-holder-id'] = user.contact.account.openPaydId;
        else if (this.accountHolderId)
            headers['x-account-holder-id'] = this.accountHolderId;
        
        const baseUrl = process.env.OPENPAYD_BASE_URL || 'https://sandbox.openpayd.com/api';
        const uri = `${baseUrl}/${endpoint}`;
        return axios
            .delete(uri, {headers})
            .then((response) => {
                return response;
            })
            .catch((response) => {
                console.error('delete', endpoint, response.response?.data?.errors);
                return response;
            });
    }

    private async putRequest(endpoint: string, data: Record<string, any> = {}, headers: Record<string, string> = {}, user: User | null = null) {
        if (endpoint.indexOf('oauth/token') === -1) {
            await this.login();
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        if (user && user.contact?.account?.openPaydId)
            headers['x-account-holder-id'] = user.contact.account.openPaydId;
        else if (this.accountHolderId)
            headers['x-account-holder-id'] = this.accountHolderId;
        
        const baseUrl = process.env.OPENPAYD_BASE_URL || 'https://sandbox.openpayd.com/api';
        const uri = `${baseUrl}/${endpoint}`;
        return axios
            .put(uri, data, {headers})
            .then((response) => {
                return response;
            })
            .catch((response) => {
                console.error('put', endpoint, response.response?.data?.errors);
                return response;
            });
    }

    private async postRequest(endpoint: string, data: Record<string, any> = {}, headers: Record<string, string> = {}, user: User | null = null) {
        if (endpoint.indexOf('oauth/token') === -1) {
            await this.login();
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        if (user && user.contact?.account?.openPaydId)
            headers['x-account-holder-id'] = user.contact.account.openPaydId;
        else if (this.accountHolderId)
            headers['x-account-holder-id'] = this.accountHolderId;
        
        const baseUrl = process.env.OPENPAYD_BASE_URL || 'https://sandbox.openpayd.com/api';
        const uri = `${baseUrl}/${endpoint}`;
        return axios
            .post(uri, data, {headers})
            .then((response) => {
                return response;
            })
            .catch((response) => {
                console.error('post', endpoint, response.response?.data?.errors, response);
                return response;
            });
    }

    private async getRequest(endpoint: string, headers: Record<string, string> = {}, user: User | null = null) {
        if (endpoint.indexOf('oauth/token') === -1) {
            await this.login();
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        if (user && user.contact?.account?.openPaydId)
            headers['x-account-holder-id'] = user.contact.account.openPaydId;
        else if (this.accountHolderId)
            headers['x-account-holder-id'] = this.accountHolderId;
        
        const baseUrl = process.env.OPENPAYD_BASE_URL || 'https://sandbox.openpayd.com/api';
        const uri = `${baseUrl}/${endpoint}`;
        return axios
            .get(uri, {headers})
            .then((req) => {
                return req;
            })
            .catch((req) => {
                console.error('get', endpoint, req.response?.data, req.response.status);
                return req;
            });
    }
}