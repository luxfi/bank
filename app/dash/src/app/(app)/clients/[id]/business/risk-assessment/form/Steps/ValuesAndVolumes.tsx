import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { RadioGroup } from '@/components/RadioGroup';

import {
  EStepRiskAssessment,
  EXPECTED_VOLUME_TRANSACTIONS,
  VALUE_ENTITY,
  VOLUME_EXPECTED_ACCOUNT_TURNOVER,
  useContextBusinessRiskAssessment,
} from '@/context/businessRiskAssessment';

import { Button, Column, Row, Text } from '@luxbank/ui';

import {
  expectedValueTurnover,
  expectedVolumeTransactionsOptions,
  valueOfEntityOptions,
} from '../../types';

export function ValuesAndVolumes() {
  const router = useRouter();

  const {
    onChangeData,
    resetConversion,
    valuesAndVolumesExpectedValueAccountTurnover,
    valuesAndVolumesExpectedVolumeOfTransactions,
    valuesAndVolumesValueOfEntity,
  } = useContextBusinessRiskAssessment();

  const disableNext = useMemo((): boolean => {
    return (
      !valuesAndVolumesExpectedValueAccountTurnover ||
      !valuesAndVolumesExpectedVolumeOfTransactions ||
      !valuesAndVolumesValueOfEntity
    );
  }, [
    valuesAndVolumesExpectedValueAccountTurnover,
    valuesAndVolumesExpectedVolumeOfTransactions,
    valuesAndVolumesValueOfEntity,
  ]);

  return (
    <Column style={{ width: 808, gap: 16 }}>
      <RadioGroup
        label="Value of entity?"
        options={valueOfEntityOptions}
        value={valuesAndVolumesValueOfEntity}
        onChangeData={(v) =>
          onChangeData('valuesAndVolumesValueOfEntity', v as VALUE_ENTITY)
        }
      />

      <RadioGroup
        label="Expected volume of transactions [ Per Annum ] Numbers quoted to be considered in light of practical experience?"
        options={expectedVolumeTransactionsOptions}
        value={valuesAndVolumesExpectedVolumeOfTransactions}
        onChangeData={(v) =>
          onChangeData(
            'valuesAndVolumesExpectedVolumeOfTransactions',
            v as EXPECTED_VOLUME_TRANSACTIONS
          )
        }
      />

      <Text
        style={{ fontSize: 12 }}
        variant="body_md_regular"
      >{`How many transactions are expected to flow through the entity (including bank accounts, income, expenses, loan positions, and any other transactions entered into by the company) during a typical year.`}</Text>

      <RadioGroup
        label="Expected value of annual account turnover?"
        options={expectedValueTurnover}
        value={valuesAndVolumesExpectedValueAccountTurnover}
        onChangeData={(v) =>
          onChangeData(
            'valuesAndVolumesExpectedValueAccountTurnover',
            v as VOLUME_EXPECTED_ACCOUNT_TURNOVER
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
          disabled={disableNext}
          onClick={() =>
            onChangeData(
              'currentStep',
              EStepRiskAssessment.RISK_RATING_ASSESSMENT
            )
          }
          text="Next"
          roundness="rounded"
        />
      </Row>
    </Column>
  );
}
