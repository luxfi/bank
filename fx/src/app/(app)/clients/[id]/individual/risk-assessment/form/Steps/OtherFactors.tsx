import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import Input from '@/components/Input';
import { RadioGroup } from '@/components/RadioGroup';

import {
  EStepRiskAssessment,
  YES_NO,
  useContextIndividualRiskAssessment,
} from '@/context/IndividualRiskAssessment';

import {
  Button,
  Column,
  Row,
  Text,
  useTheme,
} from '@cdaxfx/ui';

import { yesNoOptions } from '../../types';

export function OtherFactors() {
  const router = useRouter();
  const { theme } = useTheme();

  const {
    otherFactorsHaveTheClientsEverBeenMetFaceToFace,
    otherFactorsHaveTheClientsEverBeenMetFaceToFaceDetails,
    otherFactorsIsTheApplicantToCDAX,
    otherFactorsIsTheApplicantToCDAXDetails,
    onChangeData,
    resetConversion,
  } = useContextIndividualRiskAssessment();

  const disableNext = useMemo((): boolean => {
    return (
      !otherFactorsHaveTheClientsEverBeenMetFaceToFace ||
      (otherFactorsHaveTheClientsEverBeenMetFaceToFace === 'Yes' &&
        !otherFactorsHaveTheClientsEverBeenMetFaceToFaceDetails) ||
      !otherFactorsIsTheApplicantToCDAX ||
      (otherFactorsIsTheApplicantToCDAX === 'No' &&
        !otherFactorsIsTheApplicantToCDAXDetails)
    );
  }, [
    otherFactorsHaveTheClientsEverBeenMetFaceToFace,
    otherFactorsHaveTheClientsEverBeenMetFaceToFaceDetails,
    otherFactorsIsTheApplicantToCDAX,
    otherFactorsIsTheApplicantToCDAXDetails,
  ]);

  return (
    <Column style={{ width: 808, gap: 16 }}>
      <RadioGroup
        label="Is the applicant known to CDAX?"
        options={yesNoOptions}
        value={otherFactorsHaveTheClientsEverBeenMetFaceToFace}
        onChangeData={(v) =>
          onChangeData(
            'otherFactorsHaveTheClientsEverBeenMetFaceToFace',
            v as YES_NO
          )
        }
      />

      <Input
        disabled={
          !otherFactorsHaveTheClientsEverBeenMetFaceToFace ||
          otherFactorsHaveTheClientsEverBeenMetFaceToFace === 'No'
        }
        label="If yes, how long have we known them    "
        value={otherFactorsHaveTheClientsEverBeenMetFaceToFaceDetails}
        onChange={(v) =>
          onChangeData(
            'otherFactorsHaveTheClientsEverBeenMetFaceToFaceDetails',
            v
          )
        }
      />

      <RadioGroup
        label="Have the clients ever been met face to face?"
        options={yesNoOptions}
        value={otherFactorsIsTheApplicantToCDAX}
        onChangeData={(v) =>
          onChangeData('otherFactorsIsTheApplicantToCDAX', v as YES_NO)
        }
      />

      <Input
        disabled={
          !otherFactorsIsTheApplicantToCDAX ||
          otherFactorsIsTheApplicantToCDAX === 'Yes'
        }
        label="If no to the above who has met the client face to face?"
        value={otherFactorsIsTheApplicantToCDAXDetails}
        onChange={(v) =>
          onChangeData('otherFactorsIsTheApplicantToCDAXDetails', v)
        }
      />

      <Text variant="body_md_bold">{`RISK RATING ASSESSMENT`}</Text>

      <Text
        style={{ fontSize: 12 }}
        variant="body_md_regular"
      >{`If the rating has attracted a YES response to any of the questions (apart from whether known to CDAX) or the client is associated to a high risk jurisdiction then the overall rating must automatically be regarded as High Risk to begin with. The rationale for any downgrade from this position must be fully documented. All downgrades must be approved by a Director.`}</Text>

      <Text
        style={{ fontSize: 12 }}
        color={theme.textColor.layout.secondary.value}
        variant="body_md_regular"
      >{`NOTE. Where the rating is due to a connection to a country in list A or B of High Risk jurisdiction lists issued by IOM Gov Dept of Home Affairs or any Sanctions implications MUST be categorised as high and no downgrade can be applied.`}</Text>

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
            onChangeData('currentStep', EStepRiskAssessment.RISK_RATING)
          }
          disabled={disableNext}
          text="Next"
          roundness="rounded"
        />
      </Row>
    </Column>
  );
}
