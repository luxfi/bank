import { User } from '@tools/models';
import { CreateOpenPaydAccountDto } from './model/create-open-payd-account.dto';
import { CreateOpenPaydBeneficiaryDto } from './model/create-open-payd-beneficiary.dto';
import { CreateOpenPaydLinkedClientDto } from './model/create-open-payd-linked-client';

export interface OpenPaydInterface {
  createAccount(account: CreateOpenPaydAccountDto): Promise<string>;
  createLinkedClient(client: CreateOpenPaydLinkedClientDto): Promise<string>;

  validateBeneficiaryToCreate(
    beneficiary: CreateOpenPaydBeneficiaryDto,
    user?: User,
  ): Promise<void>;

  createBeneficiary(
    beneficiary: CreateOpenPaydBeneficiaryDto,
    payment_types: string[],
    user?: User,
  ): Promise<string[]>;

  deleteBeneficiary(id: string, user: User): Promise<void>;
}
