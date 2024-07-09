import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import Input from '@/components/Input';
import { RadioGroup } from '@/components/RadioGroup';
import SelectDate from '@/components/SelectDate';

import {
  RISK_LEVELS,
  useContextBusinessRiskAssessment,
} from '@/context/businessRiskAssessment';

import {
  Button,
  Column,
  Row,
  Text,
  useTheme,
} from '@cdaxfx/ui';

import { riskLevelOptions } from '../../types';

export function RiskRatingAssessment() {
  const router = useRouter();

  const { theme } = useTheme();

  const {
    onSubmit,
    onChangeData,
    resetConversion,
    isSendingRiskAssessment,
    riskRatingAssessmentAnyFurtherNotesRegardingRiskAssessment,
    riskRatingAssessmentAssessmentCompletedBy,
    riskRatingAssessmentDate,
    riskRatingAssessmentDeterminationRiskRating,
    riskRatingAssessmentNotesReRationaleToJustify,
    riskRatingAssessmentWhereApplicableNameOfDirector,
  } = useContextBusinessRiskAssessment();

  const disableNext = useMemo((): boolean => {
    return (
      !riskRatingAssessmentAnyFurtherNotesRegardingRiskAssessment ||
      !riskRatingAssessmentAssessmentCompletedBy ||
      !riskRatingAssessmentDate ||
      !riskRatingAssessmentDeterminationRiskRating ||
      !riskRatingAssessmentNotesReRationaleToJustify ||
      !riskRatingAssessmentWhereApplicableNameOfDirector
    );
  }, [
    riskRatingAssessmentAnyFurtherNotesRegardingRiskAssessment,
    riskRatingAssessmentAssessmentCompletedBy,
    riskRatingAssessmentDate,
    riskRatingAssessmentDeterminationRiskRating,
    riskRatingAssessmentNotesReRationaleToJustify,
    riskRatingAssessmentWhereApplicableNameOfDirector,
  ]);

  return (
    <Column style={{ width: 808, gap: 16 }}>
      <Text
        color={theme.textColor.layout.secondary.value}
        style={{ fontSize: 14 }}
        variant="body_md_regular"
      >{`NOTE. Where the rating is due to a connection to a country in list A or B of High Risk jurisdiction lists issued by IOM Gov Dept of Home Affairs MUST be categorised as high and no downgrade can be applied.*`}</Text>

      <RadioGroup
        disabled={isSendingRiskAssessment}
        label="Determination of Risk Rating."
        subLabel="Considering all the above information what is the risk rating of the client. (add notes if required)"
        options={riskLevelOptions}
        value={riskRatingAssessmentDeterminationRiskRating}
        onChangeData={(v) =>
          onChangeData(
            'riskRatingAssessmentDeterminationRiskRating',
            v as RISK_LEVELS
          )
        }
      />

      <Text
        style={{ fontSize: 14 }}
        variant="body_md_regular"
      >{`If higher risk client consider the enhanced CDD requirements and what on-going monitoring should be carried out, and any additional data required. Detail below`}</Text>

      <Input
        disabled={isSendingRiskAssessment}
        label="Notes re rationale to justify any changes to grading"
        value={riskRatingAssessmentNotesReRationaleToJustify}
        onChange={(v) =>
          onChangeData('riskRatingAssessmentNotesReRationaleToJustify', v)
        }
      />

      <Input
        disabled={isSendingRiskAssessment}
        label="Assessment completed by"
        value={riskRatingAssessmentAssessmentCompletedBy}
        onChange={(v) =>
          onChangeData('riskRatingAssessmentAssessmentCompletedBy', v)
        }
      />

      <Text
        style={{ fontSize: 12 }}
        variant="body_md_regular"
      >{`Where the rating is High Risk, involves a PEP or is being downgraded the application must also be approved by a Director.`}</Text>

      <Input
        disabled={isSendingRiskAssessment}
        label="Where applicable, Name of Director approving"
        value={riskRatingAssessmentWhereApplicableNameOfDirector}
        onChange={(v) =>
          onChangeData('riskRatingAssessmentWhereApplicableNameOfDirector', v)
        }
      />

      <SelectDate
        label="Date"
        disabled={isSendingRiskAssessment}
        value={riskRatingAssessmentDate}
        format="DD MMM YYYY"
        onChange={(date) => onChangeData('riskRatingAssessmentDate', date)}
      />

      <Input
        disabled={isSendingRiskAssessment}
        label="Any further notes regarding risk assessment"
        value={riskRatingAssessmentAnyFurtherNotesRegardingRiskAssessment}
        onChange={(v) =>
          onChangeData(
            'riskRatingAssessmentAnyFurtherNotesRegardingRiskAssessment',
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
          disabled={isSendingRiskAssessment}
          onClick={() => {
            resetConversion();
            router.back();
          }}
          text="Cancel"
          roundness="rounded"
          variant="secondary"
        />
        <Button
          disabled={disableNext || isSendingRiskAssessment}
          onClick={() => onSubmit()}
          text="Finish"
          roundness="rounded"
        />
      </Row>
    </Column>
  );
}
