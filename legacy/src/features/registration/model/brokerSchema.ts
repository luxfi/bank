import * as yup from 'yup';
export const brokerSchema = yup.object({
    uuid: yup.string(),
    name: yup.string(),
    address: yup.string(),
    kyc: yup.string(),
    client: yup.string(),
    percentageSplit: yup.number(),
    payment: yup.string(),
    bankAccount: yup.string(),
    contract: yup.string(),
    comment: yup.string(),
    createdAt: yup.string() || undefined,
    updatedAt:yup.string() || undefined,
});

export type BrokerDto = yup.TypeOf<typeof brokerSchema>;
