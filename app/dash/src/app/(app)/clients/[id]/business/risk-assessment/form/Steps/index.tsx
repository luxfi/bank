'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useCallback, useEffect, useMemo } from 'react';

import Input from '@/components/Input';
import Steps, { IStepItems } from '@/components/Step';

import {
  EStepRiskAssessment,
  useContextBusinessRiskAssessment,
} from '@/context/businessRiskAssessment';

import { useClients } from '@/store/useClient';
import { Button, Column, Text, useTheme } from '@luxbank/ui';

import { AreasOfOperations } from './AreasOfOperations';
import { BeneficialOwners } from './BeneficialOwners';
import { BusinessPurpose } from './BusinessPurpose';
import { Jurisdiction } from './Jurisdiction';
import { PrincipalKnown } from './PrincipalKnown';
import { ResidenceNationality } from './ResidenceNationality';
import { RiskRatingAssessment } from './RiskRatingAssessment';
import { SourceOfFunds } from './SourceOfFunds';
import { Container, StepContainer, Subtitle, Title } from './styles';
import { ValuesAndVolumes } from './ValuesAndVolumes';

export const stepsConversions: Array<IStepItems> = [
  { title: 'Residence/Nationality' },
  { title: 'Principal Known' },
  { title: 'Beneficial Owners' },
  { title: 'Source of funds/wealth' },
  { title: 'Jurisdiction' },
  { title: 'Area of operation' },
  { title: 'Business purpose' },
  { title: 'Values and volumes' },
  { title: 'Risk rating assessment' },
];

export default function FormRiskAssessment() {
  const router = useRouter();

  const { theme } = useTheme();

  const { clientSelected } = useClients();
  const { currentStep, residenceNationalityCompanyName, onChangeData } =
    useContextBusinessRiskAssessment();

  useEffect(() => {
    if (clientSelected?.businessMetadata?.companyName) {
      onChangeData(
        'residenceNationalityCompanyName',
        clientSelected?.businessMetadata?.companyName
      );
    }

    if (!clientSelected) {
      router.push('/clients/details/business/risk-assessment');
    }
  }, []);

  const renderStep: Record<EStepRiskAssessment, ReactNode> = {
    RESIDENCE_NATIONALITY: <ResidenceNationality />,
    PRINCIPAL_KNOWN: <PrincipalKnown />,
    BENEFICIAL_OWNERS: <BeneficialOwners />,
    SOURCE_OF_FUNDS: <SourceOfFunds />,
    JURISDICTION: <Jurisdiction />,
    AREAS_OF_OPERATION: <AreasOfOperations />,
    BUSINESS_PURPOSE: <BusinessPurpose />,
    VALUES_AND_VOLUME: <ValuesAndVolumes />,
    RISK_RATING_ASSESSMENT: <RiskRatingAssessment />,
  };

  const getCurrentStep = useMemo(() => {
    return (
      Object.keys(EStepRiskAssessment).findIndex((key) => key === currentStep) +
      1
    );
  }, [currentStep]);

  const renderTitleStep: Record<EStepRiskAssessment, string> = {
    RESIDENCE_NATIONALITY: 'Residence and nationality of beneficial owners',
    PRINCIPAL_KNOWN: 'Principal Known to CDAX',
    BENEFICIAL_OWNERS: 'Beneficial owners',
    SOURCE_OF_FUNDS: 'Source of funds/source of wealth (initial and on-going)',
    JURISDICTION: 'Jurisdiction of client entity',
    AREAS_OF_OPERATION: 'Principal areas of operation',
    BUSINESS_PURPOSE: 'Business purpose',
    VALUES_AND_VOLUME: 'Values and volumes',
    RISK_RATING_ASSESSMENT: 'Risk Rating Assessment',
  };

  const renderSubtitleStep: Record<EStepRiskAssessment, string> = {
    RESIDENCE_NATIONALITY:
      'Refer to list of high risk and sanctioned countries',
    PRINCIPAL_KNOWN: '',
    BENEFICIAL_OWNERS: '',
    SOURCE_OF_FUNDS:
      'We must have adequate knowledge and understanding of how the client has acquired his wealth and the source of founds.',
    JURISDICTION: 'See list of high risk and sanctioned countries',
    AREAS_OF_OPERATION:
      'Consider where the business principally conducts business and cross border operations',
    BUSINESS_PURPOSE: 'Consider the following factors',
    VALUES_AND_VOLUME: '',
    RISK_RATING_ASSESSMENT:
      'If the rating has attracted a High Risk rating in response to any of the questions then the overall rating must automatically be regarded as High risk to begin with. The rationale for any downgrade from this position must be fully documented',
  };

  const backButtonIsVisible = useMemo(() => {
    return currentStep !== EStepRiskAssessment.RESIDENCE_NATIONALITY;
  }, [currentStep]);

  const handleBackButton = useCallback(() => {
    const backStep: Record<EStepRiskAssessment, () => void> = {
      RESIDENCE_NATIONALITY: () => null,
      PRINCIPAL_KNOWN: () =>
        onChangeData('currentStep', EStepRiskAssessment.RESIDENCE_NATIONALITY),
      BENEFICIAL_OWNERS: () =>
        onChangeData('currentStep', EStepRiskAssessment.PRINCIPAL_KNOWN),
      SOURCE_OF_FUNDS: () =>
        onChangeData('currentStep', EStepRiskAssessment.BENEFICIAL_OWNERS),
      JURISDICTION: () =>
        onChangeData('currentStep', EStepRiskAssessment.SOURCE_OF_FUNDS),
      AREAS_OF_OPERATION: () =>
        onChangeData('currentStep', EStepRiskAssessment.JURISDICTION),
      BUSINESS_PURPOSE: () =>
        onChangeData('currentStep', EStepRiskAssessment.AREAS_OF_OPERATION),
      VALUES_AND_VOLUME: () =>
        onChangeData('currentStep', EStepRiskAssessment.BUSINESS_PURPOSE),
      RISK_RATING_ASSESSMENT: () =>
        onChangeData('currentStep', EStepRiskAssessment.VALUES_AND_VOLUME),
    };
    return backStep[currentStep]();
  }, [currentStep, onChangeData]);

  return (
    <Container>
      <Title style={{ alignSelf: 'flex-start', marginBottom: 48 }}>
        Company Client Risk Assessment
      </Title>

      <StepContainer>
        {currentStep === EStepRiskAssessment.RESIDENCE_NATIONALITY && (
          <Column gap="sm" style={{ marginBottom: 40 }}>
            <Text
              style={{ fontSize: 12 }}
              color={theme.textColor.layout.secondary.value}
              variant="body_sm_semibold"
            >{`NOTE: e.g. A Delaware Co would be rated low risk on US Country rating but could have bearer shares and no publicly accessible records.  Ownership could change without being able to find out. !!  would therefore present a higher risk.`}</Text>
            <Text variant="body_sm_semibold">{`To ensure that the risk rating is assessed accurately ALL sections and questions on this form must be completed`}</Text>

            <Input
              value={residenceNationalityCompanyName}
              onChange={(v) =>
                onChangeData('residenceNationalityCompanyName', v)
              }
              label="Company name"
              placeholder="Company"
            />
          </Column>
        )}
        <Steps current={getCurrentStep} items={stepsConversions} />
      </StepContainer>

      <Title style={{ marginTop: 18 }}>{renderTitleStep[currentStep]}</Title>
      <Subtitle style={{ marginTop: -16, textAlign: 'center', maxWidth: 800 }}>
        {renderSubtitleStep[currentStep]}
      </Subtitle>

      {backButtonIsVisible && (
        <Button
          style={{ alignSelf: 'start' }}
          leftIcon="arrow-left"
          roundness="rounded"
          text="Back"
          variant="tertiary"
          onClick={handleBackButton}
        />
      )}

      {renderStep[currentStep]}
    </Container>
  );
}
