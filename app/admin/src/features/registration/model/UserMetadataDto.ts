import { AddressInformationMetadataDto } from "./addressInformationMetadataSchema";
import { AdvancedInformationMetadataDto } from "./advancedInformationMetadataSchema";
import { BankMetadataDto } from "./bankMetadataSchema";
import { BusinessMetadataDto } from "./businessMetadataSchema";
import { formInformationMetadataDto } from "./formInformationMetadataSchema";
import { IndividualMetadataDto } from "./individualMetadataSchema";

export interface UserMetadataDto {
  businessMetadata: BusinessMetadataDto;
  individualMetadata: IndividualMetadataDto;
  bankMetadata?: BankMetadataDto;
  expectedVolumeOfTransactions: string;
  expectedValueOfTurnover: string;
  advancedInformationMetadata?: AdvancedInformationMetadataDto;
  addressInformationMetadata: AddressInformationMetadataDto;
  formInformationMetadata: formInformationMetadataDto;
}
