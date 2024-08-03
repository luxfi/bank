import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import Input from '@/components/Input';
import { RadioGroup } from '@/components/RadioGroup';

import {
  EStepRiskAssessment,
  YES_NO,
  useContextBusinessRiskAssessment,
} from '@/context/businessRiskAssessment';

import { Button, Column, Row, Text } from '@luxbank/ui';

import { yesNoOptions } from '../../types';

export function SourceOfFunds() {
  const router = useRouter();

  const {
    onChangeData,
    resetConversion,
    sourceOfFoundsAreFoundsAssets,
    sourceOfFoundsAreFundsAssetsComingFromA3D,
    sourceOfFoundsAreFundsAssetsComingFromA3DDetails,
    sourceOfFoundsDoTheyOriginateFormHighRisk,
    sourceOfFoundsDoTheyOriginateFromJurisdiction,
    sourceOfFoundsDoesThisApplyThisCase,
  } = useContextBusinessRiskAssessment();

  const disableNext = useMemo((): boolean => {
    return (
      !sourceOfFoundsAreFoundsAssets ||
      !sourceOfFoundsAreFundsAssetsComingFromA3D ||
      !sourceOfFoundsDoTheyOriginateFormHighRisk ||
      !sourceOfFoundsDoTheyOriginateFromJurisdiction ||
      !sourceOfFoundsDoesThisApplyThisCase ||
      (sourceOfFoundsAreFundsAssetsComingFromA3D === 'Yes' &&
        !sourceOfFoundsAreFundsAssetsComingFromA3DDetails)
    );
  }, [
    sourceOfFoundsAreFoundsAssets,
    sourceOfFoundsAreFundsAssetsComingFromA3D,
    sourceOfFoundsAreFundsAssetsComingFromA3DDetails,
    sourceOfFoundsDoTheyOriginateFormHighRisk,
    sourceOfFoundsDoTheyOriginateFromJurisdiction,
    sourceOfFoundsDoesThisApplyThisCase,
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
        label="If yes is the rationale fully understood, provide detail below"
        value={sourceOfFoundsAreFundsAssetsComingFromA3DDetails}
        onChange={(v) =>
          onChangeData('sourceOfFoundsAreFundsAssetsComingFromA3DDetails', v)
        }
      />

      <Text
        style={{ fontSize: 12 }}
        variant="body_md_regular"
      >{`Where the client has a material connection to a country covered by a statement from an international body  (list A or B of High Risk jurisdiction lists issued by IOM Gov Dept of Home Affairs) then MUST rate the relationship as High Risk.`}</Text>

      <RadioGroup
        label="Does this apply in this case?"
        options={yesNoOptions}
        value={sourceOfFoundsDoesThisApplyThisCase}
        onChangeData={(v) =>
          onChangeData('sourceOfFoundsDoesThisApplyThisCase', v as YES_NO)
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
            onChangeData('currentStep', EStepRiskAssessment.JURISDICTION)
          }
          text="Next"
          roundness="rounded"
        />
      </Row>
    </Column>
  );
}
