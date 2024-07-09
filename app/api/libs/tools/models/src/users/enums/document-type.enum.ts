export enum DocumentType {
  IdentityDocument = 'identity_document',
  ResidentialAddressVerification = 'residential_address_verification',

  GroupStructureChart = 'group_structure_chart',
  IncorporationDocument = 'incorporation_document',
  RegisterOfDirectors = 'register_of_directors',
  RegisterOfMembers = 'register_of_members',
  FinancialStatement = 'financial_statement',
  ShareholderIdentityProof = 'shareholder_identity_proof',
  DirectorIdentityProof = 'director_identity_proof',
  Other = 'other',
}

export interface S3Object {
  Body: Buffer;
  ContentType: string;
}
