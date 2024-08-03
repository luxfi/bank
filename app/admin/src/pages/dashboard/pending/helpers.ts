import { ITransaction } from "../../../features/pending/models/Transaction";
import { dateToHuman } from "../../../utils/text-helpers";
import { RoutingCodeTypeDictionary } from "../balances/BalanceDetails";
// import { RoutingCodeTypeDictionary } from "../balances/BalanceDetails";

export const statusMap = {
  pending: "Pending",
  done: "Completed",
  rejected: "Rejected",
  expired: "Expired",
};

export const getLists = (data: ITransaction) => {
  const receiptList = [
    {
      title: "Amount",
      value: data.amount_out ? `${data.amount_out} ${data.currency}` : null,
    },
    {
      title: "Payment Type",
      value: data.beneficiary?.payment_types[0] || null,
    },
    {
      title: "Payment Date",
      value: data.completed_date ? dateToHuman(data.completed_date) : null,
    },
    {
      title: "Payment Reason",
      value: data.reason || null,
    },
    {
      title: "Payment Reference",
      value: data.reference || null,
    },
    {
      title: "Payment Status",
      value: data.status_approval ? `${statusMap[data.status_approval]}` : null,
    },
  ];

  if (data.description) {
    receiptList.splice(2, 0, {
      title: "Rejection reason",
      value: data.description || null,
    });
  }

  const creatorList = [
    {
      title: "First Name",
      value: data.account_name ? data.account_name.split(" ")[0] : null,
    },
    {
      title: "Last Name",
      value: data.account_name ? data.account_name.split(" ")[1] : null,
    },
    {
      title: "Email",
      value: data.contact_email || null,
    },
  ];

  const beneficiaryDetails = [
    {
      title: "Beneficiary Name",
      value: data?.beneficiary?.name ?? null,
    },
  ];

  const beneficiaryBankDetails = [
    {
      title: "Entity Type",
      value: data.beneficiary?.beneficiary_entity_type ?? null,
    },
    {
      title: "Company Name",
      value: data.beneficiary?.name ?? null,
    },
    {
      title: "Address",
      value: data.beneficiary?.beneficiary_address ?? null,
    },
    {
      title: "City",
      value: data.beneficiary?.beneficiary_city ?? null,
    },
    {
      title: "Country",
      value: data.beneficiary?.beneficiary_country ?? null,
    },
    {
      title: "Account Number",
      value: data.beneficiary?.account_number ?? null,
    },
    {
      title:
        data.beneficiary?.routing_code_type_1 &&
        RoutingCodeTypeDictionary[data.beneficiary?.routing_code_type_1],
      value: data.beneficiary?.routing_code_value_1 || null,
    },
    {
      title: "BIC/SWIFT Code",
      value: data.beneficiary?.bic_swift ?? null,
    },
    {
      title: "IBAN",
      value: data.beneficiary?.iban ?? null,
    },
  ];

  const individualPayer = [
    {
      title: "First Name",
      value: data.payer?.firstname ?? null,
    },
    {
      title: "Last Name",
      value: data.payer?.lastname ?? null,
    },
    {
      title: "Country",
      value: data.payer?.country ?? null,
    },
  ];

  const businessPayer = [
    {
      title: "Company Name",
      value: data.payer?.companyName ?? null,
    },
    {
      title: "Country Of Registration",
      value: data.payer?.countryOfRegistration ?? null,
    },
  ];

  const payerList = data?.payer?.companyName ? businessPayer : individualPayer;

  return {
    receiptList,
    creatorList,
    beneficiaryDetails,
    beneficiaryBankDetails,
    payerList,
  };
};
