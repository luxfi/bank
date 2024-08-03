import { AdvancedInformationMetadataDto } from "./advancedInformationMetadataSchema";
import { User } from "../../auth/AuthApi";
export const advancedMetadataInitialValues = (user: User | null): AdvancedInformationMetadataDto => ({
  title: 'Mr.',
  firstname: user?.firstname || '',
  lastname: user?.lastname || '',
  formername: '',
  otherName: '',
  birth: undefined,
  place: ''
})
