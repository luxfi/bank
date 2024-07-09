export interface PaymentCreated {
  id: string;
}

export interface PaymentDetail {
  id: string;
  batch: BankAccount;
  beneficiary: BankAccount;
  bankAccount: BankAccount;
  amount: Amount;
  reference: string;
  status:
    | 'pending_cancellation'
    | 'cancelled'
    | 'pending_approval'
    | 'approved'
    | 'sent'
    | 'sending'
    | 'new'
    | 'rejected'
    | 'failed_to_send'
    | 'confirmed'
    | 'non_receipt';
  chargeMethod: string;
  sendOn: Date;
  arriveBy: Date;
  purposeOfPayment: PurposeOfPayment;
  ultimateDebtorName: string;
  ultimateDebtorIdentificationNumber: string;
  ultimateDebtorStreetName: string;
  ultimateDebtorBuildingNumber: string;
  ultimateDebtorCity: string;
  ultimateDebtorCountry: string;
  ultimateDebtorPostCode: string;
}

export interface Amount {
  amount: number;
  currency: string;
}

export interface BankAccount {
  id: string;
}

export interface PurposeOfPayment {
  purposeCode: string;
  invoiceNumber: string;
  invoiceDate: Date;
  charityNumber: number;
}
