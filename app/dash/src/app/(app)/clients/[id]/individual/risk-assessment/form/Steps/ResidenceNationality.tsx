import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import Input from '@/components/Input';
import { RadioGroup } from '@/components/RadioGroup';
import Select from '@/components/Select';

import {
  EStepRiskAssessment,
  RISK_LEVELS,
  YES_NO,
  useContextIndividualRiskAssessment,
} from '@/context/IndividualRiskAssessment';

import { countriesOptions } from '@/utils/lib';

import { Button, Column, Row, Text, useTheme } from '@luxbank/ui';

import { riskLevelOptions, yesNoOptions } from '../../types';

export function ResidenceNationality() {
  const router = useRouter();

  const { theme } = useTheme();

  const {
    residenceClientNationality,
    residenceResidenceOfClient,
    residenceIsTheCountrySubjectSanctions,
    residenceDoesThisApplyThisCase,
    residenceWhatIsTheRiskRatingJurisdictionAccordion,
    onChangeData,
    resetConversion,
  } = useContextIndividualRiskAssessment();

  const disableNext = useMemo((): boolean => {
    return (
      !residenceIsTheCountrySubjectSanctions ||
      !residenceDoesThisApplyThisCase ||
      !residenceWhatIsTheRiskRatingJurisdictionAccordion
    );
  }, [
    residenceIsTheCountrySubjectSanctions,
    residenceDoesThisApplyThisCase,
    residenceWhatIsTheRiskRatingJurisdictionAccordion,
  ]);

  // useEffect(() => {
  //   if (!residenceClientNationality) {
  //     onChangeData(
  //       'residenceClientNationality',
  //       clientSelected?.individualMetadata?.country ?? ''
  //     );
  //   }

  //   if (!residenceResidenceOfClient) {
  //     onChangeData(
  //       'residenceResidenceOfClient',
  //       clientSelected?.individualMetadata?.addressLine1 ?? ''
  //     );
  //   }
  // }, []);

  return (
    <Column style={{ width: 808, gap: 16 }}>
      <Select
        label={'Client nationality'}
        value={residenceClientNationality}
        onChange={(v) => onChangeData('residenceClientNationality', v)}
        options={countriesOptions}
        showSearch
      />
      <Input
        label={'Residence of client'}
        value={residenceResidenceOfClient}
        onChange={(v) => onChangeData('residenceResidenceOfClient', v)}
      />

      <RadioGroup
        label="Is the country subject to any sanctions?"
        options={yesNoOptions}
        value={residenceIsTheCountrySubjectSanctions}
        onChangeData={(v) =>
          onChangeData('residenceIsTheCountrySubjectSanctions', v as YES_NO)
        }
      />

      <RadioGroup
        label="What is the risk rating of the jurisdiction according to the Country Risk list*?"
        options={riskLevelOptions}
        value={residenceWhatIsTheRiskRatingJurisdictionAccordion}
        onChangeData={(v) =>
          onChangeData(
            'residenceWhatIsTheRiskRatingJurisdictionAccordion',
            v as RISK_LEVELS
          )
        }
      />

      <Text
        style={{ fontSize: 12 }}
        color={theme.textColor.layout.secondary.value}
        variant="body_sm_semibold"
      >{`NOTE * Where the client has a material connection to a country covered by a statement from an international body (list A or B of High Risk jurisdiction lists issued by IOM Gov Dept of Home Affairs) then MUST rate the relationship as High Risk and no downgrade can be applied`}</Text>

      <RadioGroup
        label="Does this apply in this case?"
        options={yesNoOptions}
        value={residenceDoesThisApplyThisCase}
        onChangeData={(v) =>
          onChangeData('residenceDoesThisApplyThisCase', v as YES_NO)
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
            onChangeData('currentStep', EStepRiskAssessment.HIGHER_RISK_CLIENT)
          }
          text="Next"
          roundness="rounded"
        />
      </Row>
    </Column>
  );
}
