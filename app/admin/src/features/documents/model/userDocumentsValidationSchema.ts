import * as yup from 'yup';

const userDocumentValidationSchema = yup.object({
  uuid: yup.string().uuid(),
  type: yup.string(),
  text: yup.string()
});

export const userDocumentsValidationSchema = yup.object({
  documents: yup.array(userDocumentValidationSchema),
});

export type UserDocumentsDto = yup.TypeOf<typeof userDocumentsValidationSchema>;
export type UserDocumentDto = yup.TypeOf<typeof userDocumentValidationSchema>;
