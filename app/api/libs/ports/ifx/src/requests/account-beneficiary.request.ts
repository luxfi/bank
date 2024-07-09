export interface AccountBeneficiary {
  id?: string;
  currency: string;
  accountHolder: string;
  nickname: string;
  iban?: string;
  swiftBic?: string;
  defaultReference: string;
  sortCode?: string;
  accountNumber?: string;
}
