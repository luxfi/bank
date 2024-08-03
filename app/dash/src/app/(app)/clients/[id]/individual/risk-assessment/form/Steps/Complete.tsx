import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import Input from '@/components/Input';
import SelectDate from '@/components/SelectDate';

import { useContextIndividualRiskAssessment } from '@/context/IndividualRiskAssessment';
import { useMessages } from '@/context/Messages';

import { Button, Column, Row, Text } from '@cdaxfx/ui';

export function Complete() {
  const router = useRouter();
  const { onShowMessage } = useMessages();

  const {
    completeAnyNotesRegardingRiskAssessment,
    completeAssessmentCompleteByName,
    completeDate,
    completeDetail,
    completeNotesRationaleToJustify,
    completeWhereApplicableNameOfDirector,
    onChangeData,
    onSubmit,
    resetConversion,
  } = useContextIndividualRiskAssessment();

  const disableNext = useMemo((): boolean => {
    return (
      completeAnyNotesRegardingRiskAssessment === '' ||
      completeAssessmentCompleteByName === '' ||
      completeDate === '' ||
      completeDetail === '' ||
      completeNotesRationaleToJustify === '' ||
      completeWhereApplicableNameOfDirector === ''
    );
  }, [
    completeAnyNotesRegardingRiskAssessment,
    completeAssessmentCompleteByName,
    completeDate,
    completeDetail,
    completeNotesRationaleToJustify,
    completeWhereApplicableNameOfDirector,
  ]);

  return (
    <Column style={{ width: 808, gap: 16 }}>
      <Text
        style={{ fontSize: 14 }}
        variant="callout_regular"
      >{`NOTE. Where the rating is due to a connection to a country in list A or B of High Risk jurisdiction lists issued by IOM Gov Dept of Home Affairs or any Sanctions implications MUST be categorised as high and no downgrade can be applied.`}</Text>
      <Input
        label="Detail below"
        value={completeDetail}
        onChange={(v) => onChangeData('completeDetail', v)}
      />
      <Input
        label="Notes re rationale to justify any changes to grading"
        value={completeNotesRationaleToJustify}
        onChange={(v) => onChangeData('completeNotesRationaleToJustify', v)}
      />

      <Input
        label="Assessment Completed by (name)"
        value={completeAssessmentCompleteByName}
        onChange={(v) => onChangeData('completeAssessmentCompleteByName', v)}
      />
      <Text
        style={{ fontSize: 14 }}
        variant="callout_regular"
      >{`Where the rating is High Risk, involves a PEP or is being downgraded the application must also be approved by a Director.`}</Text>
      <Input
        label="Where applicable, Name of Director approving"
        value={completeWhereApplicableNameOfDirector}
        onChange={(v) =>
          onChangeData('completeWhereApplicableNameOfDirector', v)
        }
      />
      <SelectDate
        format="DD MMM YYYY"
        value={completeDate}
        label="Date"
        onChange={(date) => onChangeData('completeDate', date)}
      />
      <Input
        label="Any further notes regarding risk assessment"
        value={completeAnyNotesRegardingRiskAssessment}
        onChange={(v) =>
          onChangeData('completeAnyNotesRegardingRiskAssessment', v)
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
          onClick={() => {
            onShowMessage({
              isVisible: true,
              title: 'Are you sure you wish to proceed with the change?',
              type: 'question',
              onConfirm: () => onSubmit(),
            });
          }}
          disabled={disableNext}
          text="Finish"
          roundness="rounded"
        />
      </Row>
    </Column>
  );
}
