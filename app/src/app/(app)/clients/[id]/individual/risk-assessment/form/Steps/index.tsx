'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useCallback, useEffect, useMemo } from 'react';

import Steps, { IStepItems } from '@/components/Step';

import {
  EStepRiskAssessment,
  useContextIndividualRiskAssessment,
} from '@/context/IndividualRiskAssessment';

import { useClients } from '@/store/useClient';
import { Button } from '@cdaxfx/ui';

import { Complete } from './Complete';
import { HigherRiskClient } from './HigherRiskClient';
import { OtherFactors } from './OtherFactors';
import { ResidenceNationality } from './ResidenceNationality';
import { RiskRating } from './RiskRating';
import { SourceOfFunds } from './SourceOfFunds';
import { Container, StepContainer, Subtitle, Title } from './styles';

export const stepsConversions: Array<IStepItems> = [
  { title: 'Residence/Nationality' },
  { title: 'Higher risk client' },
  { title: 'Source of funds/wealth' },
  { title: 'Other factors' },
  { title: 'Risk Rating' },
  { title: 'Complete' },
];

export default function FormRiskAssessment() {
  const router = useRouter();

  const { clientSelected } = useClients();
  const { currentStep, onChangeData } = useContextIndividualRiskAssessment();

  useEffect(() => {
    if (!clientSelected) {
      router.push('/clients');
    }
  }, []);

  const renderStep: Record<EStepRiskAssessment, ReactNode> = {
    RESIDENCE_NATIONALITY: <ResidenceNationality />,
    HIGHER_RISK_CLIENT: <HigherRiskClient />,
    SOURCE_OF_FOUNDS: <SourceOfFunds />,
    OTHER_FACTORS: <OtherFactors />,
    RISK_RATING: <RiskRating />,
    COMPLETE: <Complete />,
  };

  const getCurrentStep = useMemo(() => {
    return (
      Object.keys(EStepRiskAssessment).findIndex((key) => key === currentStep) +
      1
    );
  }, [currentStep]);

  const renderTitleStep: Record<EStepRiskAssessment, string> = {
    RESIDENCE_NATIONALITY: 'Jurisdiction of client residence/nationality',
    HIGHER_RISK_CLIENT: 'Higher risk client',
    SOURCE_OF_FOUNDS: 'Source of funds/source of wealth (Initial and on-going)',
    OTHER_FACTORS: 'Other factors to consider',
    RISK_RATING: 'Determination of Risk Rating',
    COMPLETE: 'Complete below',
  };

  const renderSubtitleStep: Record<EStepRiskAssessment, string> = {
    RESIDENCE_NATIONALITY:
      'Refer to List of High Risk and Sanctioned Countries',
    HIGHER_RISK_CLIENT: '(e.g. PEP, adverse media or press profile',
    SOURCE_OF_FOUNDS:
      'We must have adequate knowledge and understanding of how the client has acquired his wealth and the source of funds',
    OTHER_FACTORS: 'when arriving at final rating',
    RISK_RATING:
      'Considering all the above information what is the risk rating of the client.',
    COMPLETE:
      'If higher risk client consider the enhanced CDD requirements, what on-going monitoring should be carried out, and any additional data required.',
  };

  const backButtonIsVisible = useMemo(() => {
    return currentStep !== EStepRiskAssessment.RESIDENCE_NATIONALITY;
  }, [currentStep]);

  const handleBackButton = useCallback(() => {
    const backStep: Record<EStepRiskAssessment, () => void> = {
      RESIDENCE_NATIONALITY: () => null,
      HIGHER_RISK_CLIENT: () =>
        onChangeData('currentStep', EStepRiskAssessment.RESIDENCE_NATIONALITY),
      SOURCE_OF_FOUNDS: () =>
        onChangeData('currentStep', EStepRiskAssessment.HIGHER_RISK_CLIENT),
      OTHER_FACTORS: () =>
        onChangeData('currentStep', EStepRiskAssessment.SOURCE_OF_FOUNDS),
      RISK_RATING: () =>
        onChangeData('currentStep', EStepRiskAssessment.OTHER_FACTORS),
      COMPLETE: () =>
        onChangeData('currentStep', EStepRiskAssessment.RISK_RATING),
    };
    return backStep[currentStep]();
  }, [currentStep, onChangeData]);

  return (
    <Container>
      <Title style={{ alignSelf: 'flex-start', marginBottom: 48 }}>
        Individual Client Risk Assessment
      </Title>

      <StepContainer>
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
