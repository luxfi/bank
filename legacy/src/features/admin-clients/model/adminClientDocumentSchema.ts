import * as yup from "yup";

export const clientDocumentSchema = yup.object({
  uuid: yup.string(),
  isApproved: yup.boolean(),
  type: yup.string(),
  createdAt: yup.date(),
  updatedAt: yup.date(),
  document: yup.string(),
  deletedAt: yup.string(),
  user: yup.object(),
});

export type clientDocumentDto = yup.TypeOf<typeof clientDocumentSchema>;
