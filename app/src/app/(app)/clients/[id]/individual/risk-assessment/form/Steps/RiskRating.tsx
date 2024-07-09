import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import Input from '@/components/Input';
import { RadioGroup } from '@/components/RadioGroup';
import SelectDate from '@/components/SelectDate';

import {
  EStepRiskAssessment,
  RISK_LEVELS,
  useContextIndividualRiskAssessment,
} from '@/context/IndividualRiskAssessment';

import { Button, Column, Row, Text } from '@cdaxfx/ui';

import { riskLevelOptions } from '../../types';

export function RiskRating() {
  const router = useRouter();

  const {
    riskRatingAddNotesIfRequired,
    riskRatingAssessmentCompleted,
    riskRatingDate,
    // riskRatingNextReviewDue,
    riskRatingRiskRating,
    riskRatingWhereApplicableNameOfDirector,
    onChangeData,
    resetConversion,
  } = useContextIndividualRiskAssessment();

  const disableNext = useMemo((): boolean => {
    return (
      !riskRatingAddNotesIfRequired ||
      !riskRatingAssessmentCompleted ||
      !riskRatingDate ||
      !riskRatingRiskRating ||
      !riskRatingWhereApplicableNameOfDirector
    );
  }, [
    riskRatingAddNotesIfRequired,
    riskRatingAssessmentCompleted,
    riskRatingDate,
    riskRatingRiskRating,
    riskRatingWhereApplicableNameOfDirector,
  ]);

  return (
    <Column style={{ width: 808, gap: 16 }}>
      <RadioGroup
        label="Risk Rating"
        options={riskLevelOptions}
        value={riskRatingRiskRating}
        onChangeData={(v) =>
          onChangeData('riskRatingRiskRating', v as RISK_LEVELS)
        }
      />

      <Input
        label="Add notes if required"
        value={riskRatingAddNotesIfRequired}
        onChange={(v) => onChangeData('riskRatingAddNotesIfRequired', v)}
      />

      <Input
        label="Assessment Completed by (name)"
        value={riskRatingAssessmentCompleted}
        onChange={(v) => onChangeData('riskRatingAssessmentCompleted', v)}
      />

      <Text
        style={{ fontSize: 14 }}
        variant="callout_regular"
      >{`Where the rating is High Risk, involves a PEP or is being downgraded the application must also be approved by a Director.`}</Text>

      <Input
        label="Where the rating is High Risk, involves a PEP or is being downgraded the application must also be approved by a Director"
        value={riskRatingWhereApplicableNameOfDirector}
        onChange={(v) =>
          onChangeData('riskRatingWhereApplicableNameOfDirector', v)
        }
      />

      <SelectDate
        format="DD MMM YYYY"
        value={riskRatingDate}
        label="Date"
        onChange={(date) => onChangeData('riskRatingDate', date)}
      />
      {/* 
      <SelectDate
        format="DD MMM YYYY"
        value={riskRatingNextReviewDue}
        label="Next Review Due"
        onChange={(date) => onChangeData('riskRatingNextReviewDue', date)}
      /> */}

      <Row
        style={{ marginTop: 48 }}
        align="center"
        justify="center"
        width="100%"
        gap="lg"
      >
        <Button
          onClick={() => {
            resetConversion();
            router.back();
          }}
          text="Cancel"
          roundness="rounded"
          variant="secondary"
        />
        <Button
          onClick={() =>
            onChangeData('currentStep', EStepRiskAssessment.COMPLETE)
          }
          disabled={disableNext}
          text="Next"
          roundness="rounded"
        />
      </Row>
    </Column>
  );
}
