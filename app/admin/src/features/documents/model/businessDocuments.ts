import { DocumentType } from "./DocumentType.enum";

export const businessDocuments = [
  {
    type: DocumentType.GroupStructureChart,
    text: 'Group structure chart;',
  },
  {
    type: DocumentType.IncorporationDocument,
    text: 'Certified copy of the incorporation documents and/or Memorandum and Articles of Association;',
  },
  {
    type: DocumentType.RegisterOfDirectors,
    text: 'Certified copy of the current register of directors and officers;',
  },
  {
    type: DocumentType.RegisterOfMembers,
    text: 'Certified copy of the current register of members;',
  },
  {
    type: DocumentType.FinancialStatement,
    text: 'A signed copy of the latest financial statements;',
  },
  {
    type: DocumentType.ShareholderIdentityProof,
    text: 'Proof of identity of all shareholders holding 25% or more if the shares;',
  },
  {
    type: DocumentType.DirectorIdentityProof,
    text: 'Proof of identity of all directors.',
  },
];
