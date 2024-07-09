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
  HIGHER_RISK_CLIENT = 'HIGHER_RISK_CLIENT',
  SOURCE_OF_FOUNDS = 'SOURCE_OF_FOUNDS',
  OTHER_FACTORS = 'OTHER_FACTORS',
  RISK_RATING = 'RISK_RATING',
  COMPLETE = 'COMPLETE',
}

export type YES_NO = 'Yes' | 'No' | undefined;
export type RISK_LEVELS = 'Low' | 'Standard' | 'High' | undefined;

interface IDataForm {
  currentStep: EStepRiskAssessment;

  residenceClientNationality: string;
  residenceResidenceOfClient: string;
  residenceIsTheCountrySubjectSanctions: YES_NO;
  residenceWhatIsTheRiskRatingJurisdictionAccordion: RISK_LEVELS;
  residenceDoesThisApplyThisCase: YES_NO;

  riskClientIsTheClientExposedPersonPEP: YES_NO;
  riskClientAnyAdverseInformationFromCompliance: YES_NO;
  riskClientIfAnyAdverseInformation: string;
  riskClientUploadCompliance?: File;

  sourceOfFoundsAreFoundsAssets: YES_NO;
  sourceOfFoundsDoTheyOriginateFromJurisdiction: YES_NO;
  sourceOfFoundsDoTheyOriginateFormHighRisk: YES_NO;
  sourceOfFoundsAreFundsAssetsComingFromA3D: YES_NO;
  sourceOfFoundsIfYesIsTheRationale: string;
  sourceOfFoundsAreFundsAssetsComingFromA3d2: YES_NO;
  sourceOfFoundsAreFundsAssetsComingFromA3d2Details: string;
  sourceOfFoundsSeeClientRiskAssessmentGuidance: YES_NO;
  sourceOfFoundsSeeClientRiskAssessmentGuidanceDetails: string;

  otherFactorsIsTheApplicantToCDAX: YES_NO;
  otherFactorsIsTheApplicantToCDAXDetails: string;
  otherFactorsHaveTheClientsEverBeenMetFaceToFace: YES_NO;
  otherFactorsHaveTheClientsEverBeenMetFaceToFaceDetails: string;

  riskRatingRiskRating: RISK_LEVELS;
  riskRatingAddNotesIfRequired: string;
  riskRatingAssessmentCompleted: string;
  riskRatingWhereApplicableNameOfDirector: string;
  riskRatingDate: string;
  riskRatingNextReviewDue: string;

  completeDetail: string;
  completeNotesRationaleToJustify: string;
  completeAssessmentCompleteByName: string;
  completeWhereApplicableNameOfDirector: string;
  completeDate: string;
  completeAnyNotesRegardingRiskAssessment: string;

  raAttachDocumentUuid: string;
  raAttachDocument: {
    createdAt: Date | null;
    creator: string;
    deletedAt: Date | null;
    originalFilename: string;
    ownCloudPath: string;
    updatedAt: Date | null;
    uuid: string;
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

  completeAnyNotesRegardingRiskAssessment: '',
  completeAssessmentCompleteByName: '',
  completeDate: '',
  completeDetail: '',
  completeNotesRationaleToJustify: '',
  completeWhereApplicableNameOfDirector: '',

  otherFactorsHaveTheClientsEverBeenMetFaceToFace: undefined,
  otherFactorsHaveTheClientsEverBeenMetFaceToFaceDetails: '',
  otherFactorsIsTheApplicantToCDAX: undefined,
  otherFactorsIsTheApplicantToCDAXDetails: '',

  residenceClientNationality: '',
  residenceDoesThisApplyThisCase: undefined,
  residenceIsTheCountrySubjectSanctions: undefined,
  residenceResidenceOfClient: '',
  residenceWhatIsTheRiskRatingJurisdictionAccordion: undefined,

  riskClientAnyAdverseInformationFromCompliance: undefined,
  riskClientIfAnyAdverseInformation: '',
  riskClientIsTheClientExposedPersonPEP: undefined,
  riskClientUploadCompliance: undefined,
  riskRatingAddNotesIfRequired: '',
  riskRatingAssessmentCompleted: '',
  riskRatingDate: '',
  riskRatingNextReviewDue: '',
  riskRatingRiskRating: undefined,
  riskRatingWhereApplicableNameOfDirector: '',

  sourceOfFoundsAreFoundsAssets: undefined,
  sourceOfFoundsAreFundsAssetsComingFromA3D: undefined,
  sourceOfFoundsAreFundsAssetsComingFromA3d2: undefined,
  sourceOfFoundsAreFundsAssetsComingFromA3d2Details: '',
  sourceOfFoundsDoTheyOriginateFormHighRisk: undefined,
  sourceOfFoundsDoTheyOriginateFromJurisdiction: undefined,
  sourceOfFoundsIfYesIsTheRationale: '',
  sourceOfFoundsSeeClientRiskAssessmentGuidance: undefined,
  sourceOfFoundsSeeClientRiskAssessmentGuidanceDetails: '',

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
};

const Context = createContext({} as IProps);

export function IndividualRiskAssessmentProvider({
  children,
}: React.PropsWithChildren) {
  const router = useRouter();

  const { submitRiskAssessment, clientSelected, getClientsInfo } = useClients();
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
      sanction: data.residenceIsTheCountrySubjectSanctions as string,
      rating: data.residenceWhatIsTheRiskRatingJurisdictionAccordion as string,
      apply: data.residenceDoesThisApplyThisCase as string,

      pep: data.riskClientIsTheClientExposedPersonPEP as string,
      adverseInformation:
        data.riskClientAnyAdverseInformationFromCompliance === 'Yes'
          ? data.riskClientIfAnyAdverseInformation
          : 'No',

      aml: data.sourceOfFoundsAreFoundsAssets as string,
      sanctionedJurisdiction:
        data.sourceOfFoundsDoTheyOriginateFromJurisdiction as string,
      highestRisk: data.sourceOfFoundsDoTheyOriginateFormHighRisk as string,
      thirdParty: data.sourceOfFoundsAreFundsAssetsComingFromA3D as string,
      understood: data.sourceOfFoundsIfYesIsTheRationale as string,
      sensitiveActivity:
        data.sourceOfFoundsSeeClientRiskAssessmentGuidance as string,
      activityRegulated:
        data.sourceOfFoundsSeeClientRiskAssessmentGuidance === 'Yes'
          ? data.sourceOfFoundsSeeClientRiskAssessmentGuidanceDetails
          : 'No',

      sourceOfFoundsAreFundsAssetsComingFromA3d2:
        data.sourceOfFoundsAreFundsAssetsComingFromA3d2 as string,

      sourceOfFoundsAreFundsAssetsComingFromA3d2Details:
        data.sourceOfFoundsAreFundsAssetsComingFromA3d2Details,

      known: data.otherFactorsHaveTheClientsEverBeenMetFaceToFace as string,
      yearsKnown: data.otherFactorsHaveTheClientsEverBeenMetFaceToFaceDetails,
      metFace:
        data.otherFactorsIsTheApplicantToCDAX === 'No'
          ? data.otherFactorsIsTheApplicantToCDAXDetails
          : 'Yes',

      riskRating: data.riskRatingRiskRating as string,
      classifyAsPep: data.riskRatingWhereApplicableNameOfDirector,
      completionDate: dayjs(data.riskRatingDate).toDate(),
      // completionDate: dayjs(data.riskRatingNextReviewDue).toDate(),
      notes: data.riskRatingAddNotesIfRequired,
      riskRatingAssessmentCompleted: data.riskRatingAssessmentCompleted,

      completedBy: data.completeAssessmentCompleteByName,
      director: data.completeWhereApplicableNameOfDirector,
      completeDetail: data.completeDetail,
      completeNotesRationaleToJustify: data.completeNotesRationaleToJustify,
      completeAssessmentCompleteByName: data.completeAssessmentCompleteByName,
      approvalDate: dayjs(data.completeDate).toDate(),
      completeAnyNotesRegardingRiskAssessment:
        data.completeAnyNotesRegardingRiskAssessment,

      applicantForBusiness: '',
      automaticallyHigh: '',
      bearer: '',
      businessPurpose: '',
      businessPurposeOptions: '',
      clientEntityApply: '',
      clientName: '',
      considerWhere: '',
      highRiskActivity: '',
      highRiskCorporate: '',
      highRiskJurisdiction: '',
      knowledge: '',
      materialConnection: '',
      numberOfBeneficialOwners: '',
      ownershipInfo: data.residenceClientNationality,
      principalAreaApply: '',
      principalAreaRisk: '',
      principalAreaSanction: '',
      publicOrWholly: '',
      sanctionedCorporate: '',
      transactions: '',
      valueOfEntity: '',
      volume: '',
      jurisdictionIsCompanyOwnershipDirectors: '',
      riskRatingAssessmentNotesReRationaleToJustify: '',

      residenceNationalityResidenceOfBeneficial:
        data.residenceResidenceOfClient,

      raAttachDocument: data.raAttachDocument,
      raAttachDocumentUuid: data.raAttachDocumentUuid,

      businessPurposeIfYesWhoItRegulatedBy: '',
    })
      .then((response) => {
        onShowMessage({
          isVisible: true,
          title: `The account ${clientSelected?.individualMetadata?.firstname} has been classified as ${response.rating} risk`,
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
    clientSelected,
    data,
    getClientsInfo,
    onShowMessage,
    onShowNotification,
    router,
    submitRiskAssessment,
  ]);

  const values = useMemo(
    (): IProps => ({
      isSendingRiskAssessment,
      onSubmit: handleSubmit,
      onChangeData: handleChangeConversionsData,
      resetConversion: handleReset,
      ...data,
    }),
    [
      data,
      handleChangeConversionsData,
      handleReset,
      handleSubmit,
      isSendingRiskAssessment,
    ]
  );

  return <Context.Provider value={values}>{children}</Context.Provider>;
}

export function useContextIndividualRiskAssessment() {
  const context = useContext(Context);
  return context;
}
