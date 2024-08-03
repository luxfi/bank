import { BadRequestException, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { BeneficiariesService } from '../beneficiaries/services/beneficiaries.service';
import { ClientsService } from '../clients/clients.service';
import { UsersService } from '../users/users.service';
import { CurrencyCloudInterface } from './currency-cloud.interface';
import { AccountResponse, ContactResponse } from './currency-cloud.types';
import { CreateCurrencyCloudAccountDto } from './model/create-currency-cloud-account.dto';
import { CreateCurrencyCloudBeneficiaryDto } from './model/create-currency-cloud-beneficiary.dto';
import { CreateCurrencyCloudContactDto } from './model/create-currency-cloud-contact.dto';
import { CreateCurrencyCloudConversionDto } from './model/create-currency-cloud-conversion';
import { CreateCurrencyBeneficiary, CreateCurrencyQuote, CreateCurrencyTopUp, CreateValidatePayment } from './model/create-currency-quote.dto';
import { propertiesToSnakeCase } from './utils/object-transformers';
import { BankMetadata, BusinessMetadata, CurrencyCloudCurrencies, IndividualMetadata, User } from '@luxbank/tools-models';
import PendingPaymentEmail from './emails/pending-payment';
import ApprovePaymentEmail from './emails/approve-payment';
import RejectPaymentEmail from './emails/reject-payment';
import { MailerService } from '../mailer/mailer.service';
import dayjs from 'dayjs';
import { getConfigCurrencyCloud } from '@luxbank/tools-misc';

@Injectable()
export class CurrencyCloudService implements CurrencyCloudInterface {
    private readonly logger = new Logger(CurrencyCloudService.name);
    private token: string;
    private loginId: string;
    private tokenCreatedAt: Date | null;

    constructor(
        private readonly usersService: UsersService,
        @Inject(forwardRef(() => BeneficiariesService))
        private readonly beneficiariesService: BeneficiariesService,
        private readonly clientsService: ClientsService,
        private readonly mailer: MailerService
    ) { }

    async getPayerAndBankInfo(clientUuid: string): Promise<{
        payer: IndividualMetadata | BusinessMetadata | undefined;
        bank: BankMetadata | undefined;
    }> {
        const client = await this.clientsService.findByUuidWithMetadata(clientUuid);
        const payer = client?.account?.individualMetadata || client?.account?.businessMetadata;
        const bank = client?.account?.bankMetadata;

        return {payer, bank};
    }

    async notifyManagersToApprovePayment(accountId: string, transactionId: string, creator: User) {
        const users = await this.usersService.getManagerUsersByAccountId(accountId);

        const emailsPromises = users.map((user) =>
            this.mailer.send(
                new PendingPaymentEmail({
                    to: user.username,
                    uuid: transactionId,
                    fullName: creator.getFullName(),
                    email: creator.username,
                    phone: creator.contact?.mobileNumber,
                    createdAt: dayjs().format('DD/MM/YYYY HH:mm')
                })
            )
        );

        return Promise.all(emailsPromises);
    }

    async notifyUserApprovedPayment(to: string, name: string, reference: string) {
        const emails = [to, `${process.env.BACKOFFICE_EMAIL}`];
        const emailsPromises = emails.map((sendTo) =>
            this.mailer.send(
                new ApprovePaymentEmail({
                    to: sendTo,
                    name,
                    reference,
                    createdAt: dayjs().format('DD/MM/YYYY HH:mm')
                })
            )
        );

        return Promise.all(emailsPromises);
    }

    async notifyUserRejectedPayment(to: string, name: string, email, reference: string, description: string) {
        const emails = [to, `${process.env.BACKOFFICE_EMAIL}`];

        const emailsPromises = emails.map((sendTo) =>
            this.mailer.send(
                new RejectPaymentEmail({
                    to: sendTo,
                    name,
                    email,
                    reference,
                    description,
                    createdAt: dayjs().format('DD/MM/YYYY HH:mm')
                })
            )
        );

        return Promise.all(emailsPromises);
    }

    async createAccount(account: CreateCurrencyCloudAccountDto, user: User): Promise<string> {
        const response = await this.postRequest(
            'accounts/create',
            account,
            {},
            user,
            {},
            false
        );

        if ((response as any).status === 200)
            return (response as any).data.id;
        
        throw new Error("Account couldn't be created.");
    }

    async createContact(contact: CreateCurrencyCloudContactDto, user: User): Promise<string> {
        const response = await this.postRequest(
            'contacts/create',
            contact,
            {},
            user,
            {},
            false
        );

        if ((response as any).status === 200)
            return (response as any).data.id;

        throw new Error("Contact couldn't be created.");
    }

    async validateBeneficiaryToCreate(beneficiary: CreateCurrencyCloudBeneficiaryDto, contactId: string | null, user: User): Promise<any> {
        if (contactId)
            beneficiary.onBehalfOf = contactId;
        
        try {
            const data = this.removeValidateBeneficiaryExtraParameters(beneficiary);

            return this.postRequest(
                'beneficiaries/validate',
                data,
                {},
                user,
                {},
                false
            );
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

    async createBeneficiary(beneficiary: CreateCurrencyCloudBeneficiaryDto, contactId: string | null, user: User): Promise<string[]> {
        if (contactId)
            beneficiary.onBehalfOf = contactId;

        const response = await this.postRequest(
            'beneficiaries/create',
            beneficiary,
            {},
            user,
            {},
            false
        );

        if ((response as any).status === 200)
            return [(response as any).data.id, (response as any).data.payment_types.join(',')];

        throw new Error("Beneficiary couldn't be created.");
    }

    async updateBeneficiary(id: string, beneficiary: CreateCurrencyCloudBeneficiaryDto, contactId: string | null, user: User): Promise<string[]> {
        if (contactId)
            beneficiary.onBehalfOf = contactId;
        
        const response = await this.postRequest(
            `beneficiaries/${id}`,
            beneficiary,
            {},
            user,
            {},
            false
        );

        if ((response as any).status === 200)
            return [(response as any).data.id, (response as any).data.payment_types.join(',')];

        throw new Error("Beneficiary couldn't be updated.");
    }

    async getBalances(user: User) {
        try {
            const response = await this.getRequest(
                `balances/find?per_page=50`,
                {},
                user,
                {},
                true
            );

            if ((response as any).status === 200) {
                return {
                    balances: (response as any).data.balances.map((d) => ({
                        ...d,
                        id: d.currency + d.id
                    }))
                };
            }
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }

        return null;
    }

    async getCurrencies(user: User) {
        return { currencies: CurrencyCloudCurrencies };
    }

    async getBeneficiaries(currency: string, user: User) {
        try {
            const response = await this.postRequest(
                `beneficiaries/find`,
                {},
                {},
                user,
                { currency },
                true
            );

            if ((response as any).status === 200) {
                const beneficiaries = (
                    await this.beneficiariesService.getActiveBeneficiariesByCurrency(user, currency)
                ).beneficiaries;

                return {
                    pagination: (response as any).data.pagination,
                    beneficiaries: (response as any).data.beneficiaries.filter((beneficiary) => {
                        return (
                            beneficiaries.length &&
                            beneficiaries.findIndex((beneficiaryFromDB) => beneficiaryFromDB.currencyCloudId == beneficiary.id) !== -1
                        );
                    })
                };
            }
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }

        return null;
    }

    async getConversionDates(conversion_pair: string, user: User) {
        try {
            const response = await this.getRequest(
                `reference/conversion_dates`,
                {},
                user,
                { conversion_pair },
                true
            );

            if ((response as any).status === 200)
                return (response as any).data;
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }

        return null;
    }

    async getPaymentDates(currency: string, user: User) {
        try {
            const response = await this.getRequest(
                `reference/payment_dates?currency=${currency}`,
                {},
                user,
                {},
                true
            );

            if ((response as any).status === 200)
                return (response as any).data;
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }

        return null;
    }

    async getPayer(uuid: string, user: User) {
        try {
            const response = await this.getRequest(
                `payers/${uuid}`,
                {},
                user,
                {},
                true
            );

            if ((response as any).status === 200)
                return (response as any).data;
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }

        return null;
    }

    async findDashboardInfo(module: string, status: string, user: User, completed?: string) {
        try {
            const params = { status };
            if (completed) {
                params['updated_at_from'] = completed;
                params['updated_at_to'] = completed;
            }

            const response = await this.getRequest(
                `${module}/find`,
                {},
                user,
                params,
                true
            );

            if ((response as any).status === 200)
                return (response as any).data.pagination.total_entries;
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }

        return null;
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
        status?: string,
        type?: string,
        amount_from?: number,
        amount_to?: number,
        currency?: string,
        scope?: string,
        page?: number
    ) {
        try {
            const params = { per_page: 15, order: 'default', order_asc_desc: 'desc' };

            if (shortReference)
                params['related_entity_short_reference'] = shortReference;
            
            if (action) 
                params['action'] = action;
            
            if (settles_at_from) 
                params['settles_at_from'] = settles_at_from;

            if (settles_at_to) 
                params['settles_at_to'] = settles_at_to;

            if (created_at_from) 
                params['created_at_from'] = created_at_from;

            if (created_at_to) 
                params['created_at_to'] = created_at_to;

            if (completed_at_from) 
                params['completed_at_from'] = completed_at_from;

            if (completed_at_to) 
                params['completed_at_to'] = completed_at_to;

            if (status) 
                params['status'] = status;

            if (type) 
                params['type'] = type;

            if (amount_from) 
                params['amount_from'] = amount_from;

            if (amount_to) 
                params['amount_to'] = amount_to;

            if (currency) 
                params['currency'] = currency;

            if (scope) 
                params['scope'] = scope;

            if (page) 
                params['page'] = page;

            const response = await this.getRequest('transactions/find', {}, user, params, true);

            if ((response as any).status === 200)
                return (response as any).data;
        } 
        catch (err) {
            this.logger.error('Something went wrong', (err as Error).message, (err as Error).stack);
        }

        return null;
    }

    async getTransaction(currency: string, settles_at_from: string, completed_at_from: string, page: number, user: User) {
        try {
            const response = await this.getRequest(
                `transactions/find?currency=${currency}&settles_at_from=${settles_at_from}&page=${page}`,
                {},
                user,
                {},
                true
            );

            if ((response as any).status === 200)
                return (response as any).data;
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }

        return null;
    }

    async getTransactionRef(short_ref: string, user: User) {
        try {
            const response = await this.getRequest(
                `transactions/find?related_entity_id=${short_ref}`,
                {},
                user,
                {},
                true
            );

            if ((response as any).status === 200)
                return (response as any).data;
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }

        return null;
    }

    async getConversion(uuid: string, user: User) {
        try {
            const response = await this.getRequest(
                `conversions/${uuid}`,
                {},
                user,
                {},
                true
            );

            if ((response as any).status === 200)
                return (response as any).data;
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }

        return null;
    }

    async splitPreview(uuid: string, amount: string, user: User) {
        try {
            const response = await this.getRequest(
                `conversions/${uuid}/split_preview?amount=${amount}`,
                {},
                user,
                {},
                false
            );

            if ((response as any).status === 200)
                return (response as any).data;
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }

        return null;
    }

    async dateChange(uuid: string, new_settlement_date: string, user: User) {
        try {
            const response = await this.postRequest(
                `conversions/${uuid}/date_change`,
                {
                    new_settlement_date
                },
                {},
                user,
                {},
                false
            );

            if ((response as any).status === 200)
                return (response as any).data;
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }

        return null;
    }

    async split(uuid: string, amount: string, user: User) {
        try {
            const response = await this.postRequest(
                `conversions/${uuid}/split`,
                {
                    amount
                },
                {},
                user,
                {},
                false
            );

            if ((response as any).status === 200)
                return (response as any).data;
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }

        return null;
    }

    async getPayment(uuid: string, user: User) {
        try {
            const response = await this.getRequest(
                `payments/${uuid}`,
                {},
                user,
                {},
                true
            );

            if ((response as any).status === 200)
                return (response as any).data;
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }

        return null;
    }

    async getBeneficiary(uuid: string, user: User) {
        try {
            const response = await this.getRequest(
                `beneficiaries/${uuid}`,
                {},
                user,
                {},
                true
            );

            if ((response as any).status === 200)
                return (response as any).data;
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }

        return null;
    }

    async getContact(contact_id: string, user: User) {
        try {
            const response = await this.getRequest(
                `contacts/${contact_id}`,
                {},
                user,
                {},
                false
            );

            if ((response as any).status === 200)
                return (response as any).data;
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }

        return null;
    }

    async getAccounts(user: User) {
        try {
            const response = await this.postRequest(
                'accounts/find',
                {},
                {},
                user,
                {},
                true
            );

            if ((response as any).status === 200)
                return (response as any).data;
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }

        return null;
    }

    async createCurrencyAcccount(currency: string, user: User) {
        try {
            const response = await this.getRequest(
                `balances/${currency}`,
                {},
                user,
                {},
                true
            );

            if ((response as any).status === 200)
                return (response as any).data;
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }
    }

    async getCurrentAccount(user: User) {
        try {
            const response = await this.getRequest(
                'accounts/current',
                {},
                user,
                {},
                false
            );

            if ((response as any).status === 200)
                return (response as any).data;
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }
    }

    async getAccount(account_id: string, user: User) {
        try {
            const response = await this.getRequest(
                `accounts/${account_id}`,
                {},
                user,
                {},
                false
            );

            if ((response as any).status === 200)
                return (response as any).data;
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }

        return null;
    }

    async getSender(entity_id: string, user: User) {
        try {
            const response = await this.getRequest(
                `transactions/sender/${entity_id}`,
                {},
                user,
                {},
                true
            );

            if ((response as any).status === 200)
                return (response as any).data;
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }

        return null;
    }

    async getPaginatedAllContacts(user: User) {
        let page = 1;
        let allContacts: ContactResponse[] = [];

        while (true) {
            const response = await this.postRequest(
                `contacts/find`,
                {},
                {},
                user,
                {
                    page,
                    per_page: 25,
                    status: 'enabled'
                },
                false
            );

            if ((response as any).status !== 200)
                break;

            if ((response as any).data.contacts.length === 0)
                break;

            allContacts = [...allContacts, ...(response as any).data.contacts];
            page++;
        }

        return allContacts;
    }

    async getPaginatedAllAccounts(user: User) {
        let page = 1;
        let allAccounts: AccountResponse[] = [];

        while (true) {
            const response = await this.postRequest(
                `accounts/find`,
                {},
                {},
                user,
                {
                    page,
                    per_page: 25,
                },
                false
            );

            if ((response as any).status !== 200)
                break;

            if ((response as any).data.accounts.length === 0)
                break;

            allAccounts = [...allAccounts, ...(response as any).data.accounts];
            page++;
        }

        return allAccounts;
    }

    async getAllEnabledContacts(user: User) {
        try {
            const subaccounts = await this.getPaginatedAllContacts(user);
            const accounts = await this.getPaginatedAllAccounts(user);

            const subaccountIds = subaccounts.map((subaccount) => subaccount.id);

            const existingSubaccountIds = (
                await this.usersService.getByCurrencyCloudIds(subaccountIds)
            )?.map((user) => user.getCurrentClient()?.account?.cloudCurrencyId);

            return {
                subaccounts: subaccounts.map((contact) => {
                    const contactAccount = accounts.find((a) => a.id == contact.account_id);
                    const disabled = contactAccount?.status !== 'enabled';
                    return {
                        accountHolderId: contact.id,
                        clientType: contact.login_id,
                        friendlyName: `${disabled ? 'DISABLED - ' : ''} ${contactAccount?.account_name} (${contact.first_name} ${contact.last_name})`,
                        taken: existingSubaccountIds?.findIndex((existing) => existing == contact.id,) !== -1
                    };
                })
            };
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }

        return null;
    }

    async getContacts(account_id: string, user: User) {
        try {
            const response = await this.getRequest(
                `contacts/find`,
                {},
                user,
                {
                    account_id,
                },
                true
            );

            if ((response as any).status === 200)
                return (response as any).data;
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }

        return null;
    }
    async getSettleAccounts(currency: string, account_id: string, user: User) {
        try {
            const params = {
                currency,
                account_id
            };

            const responseSettlementAccounts = await this.getRequest(
                `reference/settlement_accounts`,
                {},
                user,
                params,
                false
            );
            const responseFundingAccounts = await this.getRequest(
                `funding_accounts/find`,
                {},
                user,
                params,
                false
            );

            if ((responseSettlementAccounts as any).status === 200 && (responseFundingAccounts as any).status === 200) {
                return {
                    ...(responseFundingAccounts as any).data,
                    ...(responseFundingAccounts as any).data
                };
            }
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }

        return null;
    }
    async getCurrencyQuote(buy_currency: string, sell_currency: string, fixed_side: string, amount: string, date: string, user: User) {
        try {
            const conversionDates = await this.getConversionDates(
                `${sell_currency.substring(0, 3)}${buy_currency.substring(0, 3)}`,
                user
            );

            const params = {
                buy_currency: buy_currency.substring(0, 3),
                sell_currency: sell_currency.substring(0, 3),
                fixed_side,
                amount
            };

            if (date && date !== 'today')
                params['conversion_date'] = date;

            const response = await this.getRequest(
                `rates/detailed`,
                {},
                user,
                params,
                false
            );

            if ((response as any).status === 200)
                return { ...(response as any).data, ...conversionDates };
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }

        return null;
    }

    async getDeliveryDate(currency: string, bank_country: string, payment_date: string, payment_type: string, user: User) {
        try {
            const response = await this.getRequest(
                `payments/payment_delivery_date`,
                {},
                user,
                {
                    payment_date,
                    payment_type,
                    currency,
                    bank_country
                },
                false
            );

            if ((response as any).status === 200)
                return (response as any).data;
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }

        return null;
    }

    async postCurrencyQuote(data: CreateCurrencyQuote, user: User) {
        try {
            const body: CreateCurrencyCloudConversionDto = {
                buy_currency: data.buy_currency.substring(0, 3),
                sell_currency: data.sell_currency.substring(0, 3),
                fixed_side: data.fixed_side,
                amount: data.amount,
                term_agreement: data.term_agreement
            };

            if (data.conversion_date)
                body.conversion_date = data.conversion_date;

            const response = await this.postRequest(
                'conversions/create',
                body,
                {},
                user,
                {},
                true
            );

            if ((response as any).status === 200)
                return (response as any).data;
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }

        return null;
    }

    async postCurrencyTopUp(data: CreateCurrencyTopUp, user: User) {
        try {
            const response = await this.postRequest(
                'balances/top_up_margin',
                data,
                {},
                user,
                {},
                true
            );

            if ((response as any).status === 200)
                return (response as any).data;
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }

        return null;
    }

    async postCurrencyBeneficiary(data: CreateCurrencyBeneficiary, user: User) {
        try {
            const response = await this.postRequest(
                'beneficiaries/create',
                data,
                {},
                user,
                {},
                true
            );

            if ((response as any).status === 200)
                return (response as any).data;
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }

        return null;
    }

    async validatePayment(data: CreateValidatePayment, user: User) {
        try {
            delete data.account_id;
            if (!data.purpose_code || data.purpose_code == '-1')
                delete data.purpose_code;
            
            const response = await this.postRequest(
                'payments/validate',
                data,
                {},
                user,
                {},
                true
            );

            if ((response as any).status === 200)
                return (response as any).data;
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }

        return null;
    }

    async createPayment(data: CreateValidatePayment, user: User, transactionId: string) {
        try {
            delete data.account_id;
            if (!data.purpose_code || data.purpose_code == '-1')
                delete data.purpose_code;
            
            const response = await this.postRequest(
                'payments/create',
                { ...data, unique_request_id: transactionId },
                {},
                user,
                {},
                true
            );

            if ((response as any).status === 200)
                return (response as any).data;
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }

        return null;
    }

    async editPayment(data: CreateValidatePayment, user: User) {
        try {
            const id = data.id;
            const dataP = { ...data };
            delete dataP.id;
            const response = await this.postRequest(
                `payments/${id}`,
                dataP,
                {},
                user,
                {},
                true
            );

            if ((response as any).status === 200)
                return (response as any).data;
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }

        return null;
    }

    async cancelConversion(id: string, user: User) {
        try {
            const response = await this.postRequest(
                `conversions/${id}/cancel`,
                {},
                {},
                user,
                {},
                false
            );

            if ((response as any).status === 200)
                return (response as any).data;
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }

        return null;
    }

    async deletePayment(id: string, user: User) {
        try {
            const response = await this.postRequest(
                `payments/${id}/delete`,
                {},
                {},
                user,
                {},
                true
            );

            if ((response as any).status === 200)
                return (response as any).data;
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
        }

        return null;
    }

    async deleteBeneficiary(id: string, contactId: string | null, user: User): Promise<void> {
        const params: { onBehalfOf?: string } = {};

        if (contactId)
            params.onBehalfOf = contactId;

        await this.postRequest(
            `beneficiaries/${id}/delete`,
            params,
            {},
            user,
            {},
            false
        );
    }

    private async login(baseUrl, loginId: string, apiKey: string) {
        if (!this.isTokenExpired() && loginId === this.loginId)
            return this.token;

        if (this.token && loginId === this.loginId)
            await this.logout(baseUrl);

        try {
            const { data } = await axios.post(`${baseUrl}/authenticate/api`, {
                ...propertiesToSnakeCase({
                    loginId,
                    apiKey
                })
            });

            this.token = data.auth_token;
            this.tokenCreatedAt = new Date();
            this.loginId = loginId;
            return data.auth_token;
        } 
        catch (error) {
            this.logger.error(`Login failed: ${(error as Error).message}`);
            throw error;
        }
    }

    private isTokenExpired() {
        return (
            !this.tokenCreatedAt ||
            new Date().valueOf() - this.tokenCreatedAt.valueOf() > 1000 * 60 * 30
        );
    }

    private async logout(baseUrl: string): Promise<void> {
        if (!this.token) 
            return;
        
        try {
            const headers: Record<string, string> = {};
            headers['X-Auth-Token'] = this.token;

            this.tokenCreatedAt = null;
            this.token = '';

            await axios.post(`${baseUrl}/authenticate/close_session`, null, {headers});
        } 
        catch (err) {
            this.logger.error(`Logging out failed: ${(err as Error).message}`);
        }
    }

    private removeValidateBeneficiaryExtraParameters(beneficiary: CreateCurrencyCloudBeneficiaryDto): Record<string, string> {
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
            'paymentTypes'
        ];

        return Object.keys(beneficiary).reduce((acc, key) => {
            if (allowedKeys.includes(key))
                acc[key] = beneficiary[key];

            return acc;
        }, {});
    }

    private async postRequest(
        endpoint: string,
        data: Record<string, any> = {},
        headers: Record<string, string> = {},
        user: User,
        params: Record<string, any> = {},
        isOnBehalfOf: boolean
    ) {
        const extraData: { on_behalf_of?: string } = {};

        if (isOnBehalfOf && user.getCurrentClient())
            extraData.on_behalf_of = user.getCurrentClient()?.account?.cloudCurrencyId;

        const { baseUrl, apiKey, loginId } = getConfigCurrencyCloud(user.getCurrentClient()?.uuid);

        if (endpoint !== 'authenticate/api')
            headers['X-Auth-Token'] = await this.login(baseUrl, loginId, apiKey);

        const uri = `${baseUrl}/${endpoint}`;

        try {
            const response = await axios.post(
                uri,
                { ...propertiesToSnakeCase(data), ...extraData },
                {
                    headers,
                    params
                }
            );
            return response;
        } 
        catch (error) {
            this.logger.error(uri, (error as Error).message, (error as Error).stack);
            return error;
        }
    }

    private async getRequest(
        endpoint: string,
        headers: Record<string, string> = {},
        user: User,
        requestParams: Record<string, any> = {},
        isOnBehalfOf: boolean
    ) {
        const params = { ...requestParams };

        if (isOnBehalfOf && user.getCurrentClient())
            params.on_behalf_of = user.getCurrentClient()?.account?.cloudCurrencyId;

        const { baseUrl, apiKey, loginId } = getConfigCurrencyCloud(user.getCurrentClient()?.uuid);

        if (endpoint !== 'authenticate/api')
            headers['X-Auth-Token'] = await this.login(baseUrl, loginId, apiKey);

        const uri = `${baseUrl}/${endpoint}`;

        try {
            const response = await axios.get(uri, {headers, params});
            return response;
        } 
        catch (error) {
            this.logger.error(uri, (error as Error).message, (error as Error).stack);
            return error;
        }
    }
}
