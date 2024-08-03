interface IListItem {
  title: string;
  value: string;
}

export interface IGetList {
  receiptList: Array<IListItem>;
  beneficiaryDetails: Array<IListItem>;
  beneficiaryBankDetails: Array<IListItem>;
  payerList: Array<IListItem>;
}
