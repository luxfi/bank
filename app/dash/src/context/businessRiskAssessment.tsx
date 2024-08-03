'use client';

import { useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { useClients } from '@/store/useClient';
import dayjs from 'dayjs';

import { useMessages } from './Messages';
import { useNotification } from './Notification';

export enum EStepRiskAssessment {
  RESIDENCE_NATIONALITY = 'RESIDENCE_NATIONALITY',
  PRINCIPAL_KNOWN = 'PRINCIPAL_KNOWN',
  BENEFICIAL_OWNERS = 'BENEFICIAL_OWNERS',
  SOURCE_OF_FUNDS = 'SOURCE_OF_FUNDS',
  JURISDICTION = 'JURISDICTION',
  AREAS_OF_OPERATION = 'AREAS_OF_OPERATION',
  BUSINESS_PURPOSE = 'BUSINESS_PURPOSE',
  VALUES_AND_VOLUME = 'VALUES_AND_VOLUME',
  RISK_RATING_ASSESSMENT = 'RISK_RATING_ASSESSMENT',
}

export type YES_NO = 'Yes' | 'No' | undefined;
export type RISK_LEVELS = 'Low' | 'Standard' | 'High' | undefined;
export type YEARS = '1yr' | '5yrs+' | '10yrs+' | undefined;
export type NUMBERS_OWNERS =
  | 'Two or less spouse/partners'
  | 'Less than 5'
  | 'More than 5'
  | undefined;
export type AVAILABLE = 'N/A' | 'Yes' | 'No' | undefined;
export type VALUE_ENTITY = 'Less 10M' | '10M-20M' | 'More 20M' | undefined;
export type EXPECTED_VOLUME_TRANSACTIONS = '0-25' | '26-50' | '51+' | undefined;
export type VOLUME_EXPECTED_ACCOUNT_TURNOVER =
  | 'Less 5M'
  | '5M-10M'
  | 'More 10M'
  | undefined;

interface IDataForm {
  currentStep: EStepRiskAssessment;

  residenceNationalityCompanyName: string;
  residenceNationalityResidenceOfBeneficial: string;
  residenceNationalityClientNacional: string;
  residenceNationalityWhatIsNationality: string;
  residenceNationalityIsTheCountrySubject: YES_NO;
  residenceNationalityWhatIsTheRiskRatingTheJurisdiction: RISK_LEVELS;
  residenceNationalityDoesThisApplyThisCase: YES_NO;

  principalKnownIsTheCompanyKnownToCDAX: YES_NO;
  principalKnownIfYesHowLongHaveWeKnown: YEARS;
  principalKnownHaveTheClientsEverBeenMetFaceToFace: YES_NO;
  principalKnownIfNoToTheAboveHasMetTheClientFaceToFace: string;

  beneficialOwnersNumberOfBeneficialOwners: NUMBERS_OWNERS;
  beneficialOwnersAreAnyOfTheBeneficialOwners: YES_NO;
  beneficialOwnersAnyAdverseInformation: YES_NO;
  beneficialOwnersAnyAdverseInformationDetails: string;
  beneficialOwnersCopyComplianceUpload?: File;

  sourceOfFoundsAreFoundsAssets: YES_NO;
  sourceOfFoundsDoTheyOriginateFromJurisdiction: YES_NO;
  sourceOfFoundsDoTheyOriginateFormHighRisk: YES_NO;
  sourceOfFoundsAreFundsAssetsComingFromA3D: YES_NO;
  sourceOfFoundsAreFundsAssetsComingFromA3DDetails: string;
  sourceOfFoundsDoesThisApplyThisCase: YES_NO;

  jurisdictionWithinCorporateStructure: YES_NO;
  jurisdictionWithinCorporateHighRisk: YES_NO;
  jurisdictionWhatIsTheHighestRisk: RISK_LEVELS;
  jurisdictionIsTheEntityPublicListed: YES_NO;
  jurisdictionAreThereAnyBearerSharesIssued: YES_NO;
  jurisdictionIsCompanyOwnershipDirectors: AVAILABLE;
  jurisdictionDoesThisApplyThisCase: YES_NO;

  areasOfOperationIsTheCountryAnySanctions: YES_NO;
  areasOfOperationWhatIsTheRiskRating: RISK_LEVELS;
  areasOfOperationDoesThisApplyThisCase: YES_NO;

  businessPurposeWhatIsTheBusinessActivity: string;
  businessPurposeIsTheClientsRegulated: YES_NO;
  businessPurposeIfYesWhoItRegulatedBy: string;

  valuesAndVolumesValueOfEntity: VALUE_ENTITY;
  valuesAndVolumesExpectedVolumeOfTransactions: EXPECTED_VOLUME_TRANSACTIONS;
  valuesAndVolumesExpectedValueAccountTurnover: VOLUME_EXPECTED_ACCOUNT_TURNOVER;

  riskRatingAssessmentDeterminationRiskRating: RISK_LEVELS;
  riskRatingAssessmentNotesReRationaleToJustify: string;
  riskRatingAssessmentAssessmentCompletedBy: string;
  riskRatingAssessmentWhereApplicableNameOfDirector: string;
  riskRatingAssessmentDate: string;
  riskRatingAssessmentAnyFurtherNotesRegardingRiskAssessment: string;

  completeAnyNotesRegardingRiskAssessment: string;
  sourceOfFoundsAreFundsAssetsComingFromA3d2: string;
  sourceOfFoundsAreFundsAssetsComingFromA3d2Details: string;

  raAttachDocumentUuid: string;
  raAttachDocument: {
    uuid: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    originalFilename: string;
    ownCloudPath: string;
    creator: string;
    deletedAt: Date | null;
  };
}

interface IProps extends IDataForm {
  onSubmit(): void;
  resetConversion(): void;
  isSendingRiskAssessment: boolean;
  onChangeData<T extends keyof IDataForm>(key: T, value: IDataForm[T]): void;
}

const initForm: IDataForm = {
  currentStep: EStepRiskAssessment.RESIDENCE_NATIONALITY,

  raAttachDocumentUuid: '',
  raAttachDocument: {
    createdAt: null,
    creator: '',
    deletedAt: null,
    originalFilename: '',
    ownCloudPath: '',
    updatedAt: null,
    uuid: '',
  },

  residenceNationalityCompanyName: '',
  residenceNationalityResidenceOfBeneficial: '',
  residenceNationalityWhatIsNationality: '',
  residenceNationalityClientNacional: '',
  residenceNationalityIsTheCountrySubject: undefined,
  residenceNationalityWhatIsTheRiskRatingTheJurisdiction: undefined,
  residenceNationalityDoesThisApplyThisCase: undefined,

  principalKnownIsTheCompanyKnownToCDAX: undefined,
  principalKnownIfYesHowLongHaveWeKnown: undefined,
  principalKnownHaveTheClientsEverBeenMetFaceToFace: undefined,
  principalKnownIfNoToTheAboveHasMetTheClientFaceToFace: '',

  beneficialOwnersNumberOfBeneficialOwners: undefined,
  beneficialOwnersAreAnyOfTheBeneficialOwners: undefined,
  beneficialOwnersAnyAdverseInformation: undefined,
  beneficialOwnersAnyAdverseInformationDetails: '',
  beneficialOwnersCopyComplianceUpload: undefined,

  sourceOfFoundsAreFoundsAssets: undefined,
  sourceOfFoundsDoTheyOriginateFromJurisdiction: undefined,
  sourceOfFoundsDoTheyOriginateFormHighRisk: undefined,
  sourceOfFoundsAreFundsAssetsComingFromA3D: undefined,
  sourceOfFoundsAreFundsAssetsComingFromA3DDetails: '',
  sourceOfFoundsDoesThisApplyThisCase: undefined,

  jurisdictionWithinCorporateStructure: undefined,
  jurisdictionWithinCorporateHighRisk: undefined,
  jurisdictionWhatIsTheHighestRisk: undefined,
  jurisdictionIsTheEntityPublicListed: undefined,
  jurisdictionAreThereAnyBearerSharesIssued: undefined,
  jurisdictionIsCompanyOwnershipDirectors: undefined,
  jurisdictionDoesThisApplyThisCase: undefined,

  areasOfOperationIsTheCountryAnySanctions: undefined,
  areasOfOperationWhatIsTheRiskRating: undefined,
  areasOfOperationDoesThisApplyThisCase: undefined,

  businessPurposeWhatIsTheBusinessActivity: '',
  businessPurposeIsTheClientsRegulated: undefined,
  businessPurposeIfYesWhoItRegulatedBy: '',

  valuesAndVolumesValueOfEntity: undefined,
  valuesAndVolumesExpectedVolumeOfTransactions: undefined,
  valuesAndVolumesExpectedValueAccountTurnover: undefined,

  riskRatingAssessmentDeterminationRiskRating: undefined,
  riskRatingAssessmentNotesReRationaleToJustify: '',
  riskRatingAssessmentAssessmentCompletedBy: '',
  riskRatingAssessmentWhereApplicableNameOfDirector: '',
  riskRatingAssessmentDate: '',
  riskRatingAssessmentAnyFurtherNotesRegardingRiskAssessment: '',
  completeAnyNotesRegardingRiskAssessment: '',
  sourceOfFoundsAreFundsAssetsComingFromA3d2: '',
  sourceOfFoundsAreFundsAssetsComingFromA3d2Details: '',
};

const Context = createContext({} as IProps);

export function BusinessRiskAssessmentProvider({
  children,
}: React.PropsWithChildren) {
  const router = useRouter();

  const { clientSelected, submitRiskAssessment, getClientsInfo } = useClients();
  const { onShowNotification } = useNotification();
  const { onShowMessage } = useMessages();

  const [data, setData] = useState<IDataForm>(initForm);
  const [isSendingRiskAssessment, setIsSendingRiskAssessment] = useState(false);

  const handleChangeConversionsData = useCallback(
    <T extends keyof IDataForm>(key: T, value: IDataForm[T]) => {
      setData((pS) => ({
        ...pS,
        [key]: value,
      }));
    },
    []
  );

  const handleReset = useCallback(() => {
    setData(initForm);
  }, []);

  const handleSubmit = useCallback(async () => {
    setIsSendingRiskAssessment(true);

    await submitRiskAssessment({
      clientUuid: clientSelected?.uuid ?? '',
      clientName: data.residenceNationalityCompanyName,

      sanction: data.residenceNationalityIsTheCountrySubject as string,
      rating:
        data.residenceNationalityWhatIsTheRiskRatingTheJurisdiction as string,
      apply: data.residenceNationalityDoesThisApplyThisCase as string,

      known: data.principalKnownIsTheCompanyKnownToCDAX as string,
      yearsKnown: data.principalKnownIfYesHowLongHaveWeKnown as string,
      metFace:
        data.principalKnownHaveTheClientsEverBeenMetFaceToFace === 'No'
          ? (data.principalKnownIfNoToTheAboveHasMetTheClientFaceToFace as string)
          : 'Yes',

      numberOfBeneficialOwners:
        data.beneficialOwnersNumberOfBeneficialOwners as string,
      pep: data.beneficialOwnersAreAnyOfTheBeneficialOwners as string,
      adverseInformation:
        data.beneficialOwnersAnyAdverseInformation === 'Yes'
          ? data.beneficialOwnersAnyAdverseInformationDetails
          : 'No',

      automaticallyHigh:
        data.sourceOfFoundsDoTheyOriginateFormHighRisk as string,
      aml: data.sourceOfFoundsAreFoundsAssets as string,
      sanctionedJurisdiction:
        data.sourceOfFoundsDoTheyOriginateFromJurisdiction as string,
      highRiskJurisdiction:
        data.sourceOfFoundsDoTheyOriginateFormHighRisk as string,
      thirdParty: data.sourceOfFoundsAreFundsAssetsComingFromA3D as string,
      understood: data.sourceOfFoundsAreFundsAssetsComingFromA3DDetails,
      materialConnection: data.sourceOfFoundsDoesThisApplyThisCase as string,
      ownershipInfo: data.residenceNationalityWhatIsNationality as string,

      residenceNationalityResidenceOfBeneficial:
        data.residenceNationalityResidenceOfBeneficial,

      sanctionedCorporate: data.jurisdictionWithinCorporateStructure as string,
      bearer: data.jurisdictionAreThereAnyBearerSharesIssued as string,
      highRiskCorporate: data.jurisdictionWithinCorporateHighRisk as string,
      highestRisk: data.jurisdictionWhatIsTheHighestRisk as string,
      publicOrWholly: data.jurisdictionIsTheEntityPublicListed as string,
      clientEntityApply: data.jurisdictionDoesThisApplyThisCase as string,

      principalAreaSanction:
        data.areasOfOperationIsTheCountryAnySanctions as string,
      principalAreaRisk: data.areasOfOperationWhatIsTheRiskRating as string,
      principalAreaApply: data.areasOfOperationDoesThisApplyThisCase as string,

      activityRegulated: data.businessPurposeIsTheClientsRegulated as string,
      businessPurpose: data.businessPurposeWhatIsTheBusinessActivity as string,
      businessPurposeOptions: '',
      highRiskActivity: '',

      businessPurposeIfYesWhoItRegulatedBy:
        data.businessPurposeIfYesWhoItRegulatedBy,

      valueOfEntity: data.valuesAndVolumesValueOfEntity as string,
      volume: data.valuesAndVolumesExpectedVolumeOfTransactions as string,
      transactions: data.valuesAndVolumesExpectedValueAccountTurnover as string,

      riskRating: data.riskRatingAssessmentDeterminationRiskRating as string,
      completedBy: data.riskRatingAssessmentAssessmentCompletedBy,
      director: data.riskRatingAssessmentWhereApplicableNameOfDirector,
      completionDate: dayjs(data.riskRatingAssessmentDate).toDate(),

      completeAnyNotesRegardingRiskAssessment:
        data.riskRatingAssessmentAnyFurtherNotesRegardingRiskAssessment,

      riskRatingAssessmentCompleted: '',
      approvalDate: new Date(),

      sourceOfFoundsAreFundsAssetsComingFromA3d2:
        data.sourceOfFoundsAreFundsAssetsComingFromA3d2,

      sourceOfFoundsAreFundsAssetsComingFromA3d2Details:
        data.sourceOfFoundsAreFundsAssetsComingFromA3d2Details as string,

      completeAssessmentCompleteByName: '',
      completeDetail: '',
      completeNotesRationaleToJustify: '',

      jurisdictionIsCompanyOwnershipDirectors:
        data.jurisdictionIsCompanyOwnershipDirectors as string,

      riskRatingAssessmentNotesReRationaleToJustify:
        data.riskRatingAssessmentNotesReRationaleToJustify,

      classifyAsPep: '',
      considerWhere: '',
      knowledge: '',
      notes: '',

      sensitiveActivity: '',
      applicantForBusiness: '',

      raAttachDocumentUuid: data.raAttachDocumentUuid,
      raAttachDocument: data.raAttachDocument,
    })
      .then((response) => {
        onShowMessage({
          isVisible: true,
          title: `The company ${data.residenceNationalityCompanyName} has been classified as ${response.rating} risk`,
          type: 'message',
          description: '',
          status: 'success',
          onClose: () => {
            getClientsInfo(clientSelected?.uuid ?? '');
            router.back();
          },
        });
      })
      .catch((error) =>
        onShowNotification({
          type: 'ERROR',
          description: `Error on send risk assessment ${error}`,
          message: 'Error!',
        })
      )
      .finally(() => setIsSendingRiskAssessment(false));
  }, [
    clientSelected?.uuid,
    data,
    onShowMessage,
    getClientsInfo,
    onShowNotification,
    router,
    submitRiskAssessment,
  ]);

  const values = useMemo(
    (): IProps => ({
      onChangeData: handleChangeConversionsData,
      onSubmit: handleSubmit,
      isSendingRiskAssessment,
      resetConversion: handleReset,
      ...data,
    }),
    [
      data,
      isSendingRiskAssessment,
      handleChangeConversionsData,
      handleReset,
      handleSubmit,
    ]
  );

  return <Context.Provider value={values}>{children}</Context.Provider>;
}

export function useContextBusinessRiskAssessment() {
  const context = useContext(Context);
  return context;
}
