import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { RadioGroup } from '@/components/RadioGroup';

import {
  EStepRiskAssessment,
  RISK_LEVELS,
  YES_NO,
  useContextBusinessRiskAssessment,
} from '@/context/businessRiskAssessment';

import { Button, Column, Row, Text } from '@luxbank/ui';

import { riskLevelOptions, yesNoOptions } from '../../types';

export function AreasOfOperations() {
  const router = useRouter();

  const {
    onChangeData,
    resetConversion,
    areasOfOperationDoesThisApplyThisCase,
    areasOfOperationIsTheCountryAnySanctions,
    areasOfOperationWhatIsTheRiskRating,
  } = useContextBusinessRiskAssessment();

  const disableNext = useMemo((): boolean => {
    return (
      !areasOfOperationDoesThisApplyThisCase ||
      !areasOfOperationIsTheCountryAnySanctions ||
      !areasOfOperationWhatIsTheRiskRating
    );
  }, [
    areasOfOperationDoesThisApplyThisCase,
    areasOfOperationIsTheCountryAnySanctions,
    areasOfOperationWhatIsTheRiskRating,
  ]);

  return (
    <Column style={{ width: 808, gap: 16 }}>
      <RadioGroup
        label="Is the country subject to any sanctions?"
        options={yesNoOptions}
        value={areasOfOperationIsTheCountryAnySanctions}
        onChangeData={(v) =>
          onChangeData('areasOfOperationIsTheCountryAnySanctions', v as YES_NO)
        }
      />

      <RadioGroup
        label="What is the risk rating of the jurisdiction?"
        options={riskLevelOptions}
        value={areasOfOperationWhatIsTheRiskRating}
        onChangeData={(v) =>
          onChangeData('areasOfOperationWhatIsTheRiskRating', v as RISK_LEVELS)
        }
      />

      <Text
        style={{ fontSize: 12 }}
        variant="body_md_regular"
      >{`Where the client has a material connection to a country covered by a statement from an international body (list A or B of High Risk jurisdiction lists issued by IOM Gov Dept of Home Affairs) then MUST rate the relationship as High Risk and no downgrade can be applied.*`}</Text>

      <RadioGroup
        label="Do they originate from a high risk jurisdiction?"
        options={yesNoOptions}
        value={areasOfOperationDoesThisApplyThisCase}
        onChangeData={(v) =>
          onChangeData('areasOfOperationDoesThisApplyThisCase', v as YES_NO)
        }
      />

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
          disabled={disableNext}
          onClick={() =>
            onChangeData('currentStep', EStepRiskAssessment.BUSINESS_PURPOSE)
          }
          text="Next"
          roundness="rounded"
        />
      </Row>
    </Column>
  );
}
