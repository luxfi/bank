import { IDefaultStates } from '../helpers/setStates';
import { IDocument } from '../useClient/types';

export interface IDocumentsStates extends IDefaultStates<IDocumentsActions> {}

export interface IDocumentsActions {
  uploadClientDocuments: (file: FormData) => Promise<IDocument>;

  deleteClientDocument: (payload: IDeleteDocumentPayload) => Promise<void>;

  downloadClientDocument: (id: string) => Promise<string | Blob>;

  linkDocumentToClient: (payload: ILinkDocumentToClient) => Promise<void>;
}

export const PATHS = {
  UPLOAD_CLIENT_DOCUMENTS: '/api/v1/documents',
  LINK_DOCUMENT_TO_CLIENT: (uuid: string) => `/api/v1/documents/client/${uuid}`,
  DELETE_DOCUMENT: (uuid: string) => `/api/v1/documents/client/${uuid}`,
  DOWNLOAD_DOCUMENT: (uuid: string) => `/api/v1/documents/${uuid}`,
};

export enum EnumClientDocumentType {
  //required:
  IdentityDocument = 'identity_document',
  ResidentialAddressVerification = 'residential_address_verification',
  //optional:
  Other = 'other',
  GroupStructureChart = 'group_structure_chart',
  IncorporationDocument = 'incorporation_document',
  RegisterOfDirectors = 'register_of_directors',
  RegisterOfMembers = 'register_of_members',
  FinancialStatement = 'financial_statement',
  ShareholderIdentityProof = 'shareholder_identity_proof',
  DirectorIdentityProof = 'director_identity_proof',
}

export interface ILinkDocumentToClient {
  clientId: string;
  documentUuid: string;
  type: EnumClientDocumentType;
}

export interface IDeleteDocumentPayload {
  clientId: string;
  documentUuid: string;
}
