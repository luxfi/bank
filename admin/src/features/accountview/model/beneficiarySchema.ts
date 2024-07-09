import * as yup from "yup";

export const beneficiarySchema = yup.object({
  beneficiary_nickname: yup.string().required(),
  beneficiary_country: yup.string(),
  bene_bank_country: yup.string(),
  currency: yup.string(),
  bank_holder: yup.string()
         .required(),
        // .matches(/^[0-9]{8}$/, "Account number needs to be 8 digits.")
        
  // bankholder: yup.string(),
  beneficiary_type: yup.string().required()
});

export type BeneficiaryDetailsMetadtaDto = yup.TypeOf<typeof beneficiarySchema>;

