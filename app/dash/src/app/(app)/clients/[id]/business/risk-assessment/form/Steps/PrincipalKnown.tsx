import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import Input from '@/components/Input';
import { RadioGroup } from '@/components/RadioGroup';

import {
  EStepRiskAssessment,
  YEARS,
  YES_NO,
  useContextBusinessRiskAssessment,
} from '@/context/businessRiskAssessment';

import { Button, Column, Row } from '@luxbank/ui';

import { howLongYearsOptions, yesNoOptions } from '../../types';

export function PrincipalKnown() {
  const router = useRouter();

  const {
    onChangeData,
    resetConversion,
    principalKnownHaveTheClientsEverBeenMetFaceToFace,
    principalKnownIfNoToTheAboveHasMetTheClientFaceToFace,
    principalKnownIfYesHowLongHaveWeKnown,
    principalKnownIsTheCompanyKnownToCDAX,
  } = useContextBusinessRiskAssessment();

  const disableNext = useMemo((): boolean => {
    return (
      !principalKnownHaveTheClientsEverBeenMetFaceToFace ||
      !principalKnownIsTheCompanyKnownToCDAX ||
      (principalKnownIsTheCompanyKnownToCDAX === 'Yes' &&
        !principalKnownIfYesHowLongHaveWeKnown) ||
      (principalKnownHaveTheClientsEverBeenMetFaceToFace === 'No' &&
        !principalKnownIfNoToTheAboveHasMetTheClientFaceToFace)
    );
  }, [
    principalKnownIfYesHowLongHaveWeKnown,
    principalKnownHaveTheClientsEverBeenMetFaceToFace,
    principalKnownIfNoToTheAboveHasMetTheClientFaceToFace,
    principalKnownIsTheCompanyKnownToCDAX,
  ]);

  return (
    <Column style={{ width: 808, gap: 16 }}>
      <RadioGroup
        label="Is the Company known to CDAX?"
        options={yesNoOptions}
        value={principalKnownIsTheCompanyKnownToCDAX}
        onChangeData={(v) =>
          onChangeData('principalKnownIsTheCompanyKnownToCDAX', v as YES_NO)
        }
      />

      <RadioGroup
        disabled={
          principalKnownIsTheCompanyKnownToCDAX &&
          principalKnownIsTheCompanyKnownToCDAX === 'No'
        }
        label="If yes, how long have we known them"
        options={howLongYearsOptions}
        value={principalKnownIfYesHowLongHaveWeKnown}
        onChangeData={(v) =>
          onChangeData('principalKnownIfYesHowLongHaveWeKnown', v as YEARS)
        }
      />

      <RadioGroup
        label="Have the clients ever been met face to face?"
        options={yesNoOptions}
        value={principalKnownHaveTheClientsEverBeenMetFaceToFace}
        onChangeData={(v) =>
          onChangeData(
            'principalKnownHaveTheClientsEverBeenMetFaceToFace',
            v as YES_NO
          )
        }
      />

      <Input
        disabled={
          !principalKnownHaveTheClientsEverBeenMetFaceToFace ||
          principalKnownHaveTheClientsEverBeenMetFaceToFace === 'Yes'
        }
        label="If no to the above who has met the client face to face?"
        value={principalKnownIfNoToTheAboveHasMetTheClientFaceToFace}
        onChange={(v) =>
          onChangeData(
            'principalKnownIfNoToTheAboveHasMetTheClientFaceToFace',
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
          disabled={disableNext}
          onClick={() =>
            onChangeData('currentStep', EStepRiskAssessment.BENEFICIAL_OWNERS)
          }
          text="Next"
          roundness="rounded"
        />
      </Row>
    </Column>
  );
}
