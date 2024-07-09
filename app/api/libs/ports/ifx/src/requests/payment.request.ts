export interface Payment {
  beneficiaryAccountId: string;
  amount: number;
  currency: string;
  reference: string;
  arriveBy: string;
  paymentMethod?: string;
  ultimateDebtor?: string;
  purposeOfPayment?: PurposeOfPayment;
}

export interface PurposeOfPayment {
  purposeCode: string;
  invoiceNumber: string;
  invoiceDate: string;
  charityNumber: number;
}
