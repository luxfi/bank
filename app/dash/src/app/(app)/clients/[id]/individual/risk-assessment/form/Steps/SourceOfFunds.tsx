import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import Input from '@/components/Input';
import { RadioGroup } from '@/components/RadioGroup';

import {
  EStepRiskAssessment,
  YES_NO,
  useContextIndividualRiskAssessment,
} from '@/context/IndividualRiskAssessment';

import { Button, Column, Row, Text } from '@luxbank/ui';

import { yesNoOptions } from '../../types';

export function SourceOfFunds() {
  const router = useRouter();

  const {
    sourceOfFoundsAreFoundsAssets,
    sourceOfFoundsAreFundsAssetsComingFromA3D,
    sourceOfFoundsAreFundsAssetsComingFromA3d2,
    sourceOfFoundsAreFundsAssetsComingFromA3d2Details,
    sourceOfFoundsDoTheyOriginateFormHighRisk,
    sourceOfFoundsDoTheyOriginateFromJurisdiction,
    sourceOfFoundsIfYesIsTheRationale,
    sourceOfFoundsSeeClientRiskAssessmentGuidance,
    sourceOfFoundsSeeClientRiskAssessmentGuidanceDetails,
    onChangeData,
    resetConversion,
  } = useContextIndividualRiskAssessment();

  const disableNext = useMemo((): boolean => {
    return (
      !sourceOfFoundsAreFoundsAssets ||
      !sourceOfFoundsDoTheyOriginateFormHighRisk ||
      !sourceOfFoundsAreFundsAssetsComingFromA3D ||
      (sourceOfFoundsAreFundsAssetsComingFromA3D === 'Yes' &&
        !sourceOfFoundsIfYesIsTheRationale) ||
      !sourceOfFoundsAreFundsAssetsComingFromA3d2 ||
      (sourceOfFoundsAreFundsAssetsComingFromA3d2 === 'Yes' &&
        !sourceOfFoundsAreFundsAssetsComingFromA3d2Details) ||
      !sourceOfFoundsDoTheyOriginateFormHighRisk ||
      !sourceOfFoundsDoTheyOriginateFromJurisdiction ||
      !sourceOfFoundsSeeClientRiskAssessmentGuidance ||
      (sourceOfFoundsSeeClientRiskAssessmentGuidance === 'Yes' &&
        !sourceOfFoundsSeeClientRiskAssessmentGuidanceDetails)
    );
  }, [
    sourceOfFoundsAreFoundsAssets,
    sourceOfFoundsAreFundsAssetsComingFromA3D,
    sourceOfFoundsAreFundsAssetsComingFromA3d2,
    sourceOfFoundsAreFundsAssetsComingFromA3d2Details,
    sourceOfFoundsDoTheyOriginateFormHighRisk,
    sourceOfFoundsDoTheyOriginateFromJurisdiction,
    sourceOfFoundsIfYesIsTheRationale,
    sourceOfFoundsSeeClientRiskAssessmentGuidance,
    sourceOfFoundsSeeClientRiskAssessmentGuidanceDetails,
  ]);

  return (
    <Column style={{ width: 808, gap: 16 }}>
      <RadioGroup
        label="Are funds/assets in or derived from an AML Equivalent jurisdiction?"
        options={yesNoOptions}
        value={sourceOfFoundsAreFoundsAssets}
        onChangeData={(v) =>
          onChangeData('sourceOfFoundsAreFoundsAssets', v as YES_NO)
        }
      />

      <RadioGroup
        label="Do they originate from a sanctioned jurisdiction?"
        options={yesNoOptions}
        value={sourceOfFoundsDoTheyOriginateFromJurisdiction}
        onChangeData={(v) =>
          onChangeData(
            'sourceOfFoundsDoTheyOriginateFromJurisdiction',
            v as YES_NO
          )
        }
      />

      <RadioGroup
        label="Do they originate from a high risk jurisdiction?"
        options={yesNoOptions}
        value={sourceOfFoundsDoTheyOriginateFormHighRisk}
        onChangeData={(v) =>
          onChangeData('sourceOfFoundsDoTheyOriginateFormHighRisk', v as YES_NO)
        }
      />

      <RadioGroup
        label="Are funds/assets coming from a 3rd party?"
        options={yesNoOptions}
        value={sourceOfFoundsAreFundsAssetsComingFromA3D}
        onChangeData={(v) =>
          onChangeData('sourceOfFoundsAreFundsAssetsComingFromA3D', v as YES_NO)
        }
      />

      <Input
        disabled={
          !sourceOfFoundsAreFundsAssetsComingFromA3D ||
          sourceOfFoundsAreFundsAssetsComingFromA3D === 'No'
        }
        label="If yes is the rationale fully understood"
        value={sourceOfFoundsIfYesIsTheRationale}
        onChange={(v) => onChangeData('sourceOfFoundsIfYesIsTheRationale', v)}
      />

      <Text variant="body_sm_regular">{`Where the client has a material connection to a country covered by a statement from an international body (list A or B of High Risk jurisdiction lists issued by IOM Gov Dept of Home Affairs) then MUST rate the relationship as High Risk.`}</Text>

      <RadioGroup
        label="Are funds/assets coming from a 3rd party?"
        options={yesNoOptions}
        value={sourceOfFoundsAreFundsAssetsComingFromA3d2}
        onChangeData={(v) =>
          onChangeData(
            'sourceOfFoundsAreFundsAssetsComingFromA3d2',
            v as YES_NO
          )
        }
      />

      <Input
        disabled={
          !sourceOfFoundsAreFundsAssetsComingFromA3d2 ||
          sourceOfFoundsAreFundsAssetsComingFromA3d2 === 'No'
        }
        label="If yes is the rationale fully understood"
        value={sourceOfFoundsAreFundsAssetsComingFromA3d2Details}
        onChange={(v) =>
          onChangeData('sourceOfFoundsAreFundsAssetsComingFromA3d2Details', v)
        }
      />

      <Text variant="body_sm_regular">{`Does the Source of Funds or Source of Wealth originate from a higher risk or sensitive business activity or profession.  `}</Text>

      <RadioGroup
        label="For example, Arms and Military, Mining, Gold or Precious metal trading, Gambling, Time share, Pharmaceutical, cross border trade. (See Client Risk Assessment Guidance)"
        options={yesNoOptions}
        value={sourceOfFoundsSeeClientRiskAssessmentGuidance}
        onChangeData={(v) =>
          onChangeData(
            'sourceOfFoundsSeeClientRiskAssessmentGuidance',
            v as YES_NO
          )
        }
      />

      <Input
        disabled={
          !sourceOfFoundsSeeClientRiskAssessmentGuidance ||
          sourceOfFoundsSeeClientRiskAssessmentGuidance === 'No'
        }
        label="If Yes please provide explanation below"
        value={sourceOfFoundsSeeClientRiskAssessmentGuidanceDetails}
        onChange={(v) =>
          onChangeData(
            'sourceOfFoundsSeeClientRiskAssessmentGuidanceDetails',
            v
          )
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
          onClick={() =>
            onChangeData('currentStep', EStepRiskAssessment.OTHER_FACTORS)
          }
          disabled={disableNext}
          text="Next"
          roundness="rounded"
        />
      </Row>
    </Column>
  );
}
