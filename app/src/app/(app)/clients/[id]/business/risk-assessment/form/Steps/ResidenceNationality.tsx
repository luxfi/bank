import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import Input from '@/components/Input';
import { RadioGroup } from '@/components/RadioGroup';
import Select from '@/components/Select';

import {
  EStepRiskAssessment,
  RISK_LEVELS,
  YES_NO,
  useContextBusinessRiskAssessment,
} from '@/context/businessRiskAssessment';

import { countriesOptions } from '@/utils/lib';

import {
  Button,
  Column,
  Row,
  Text,
  useTheme,
} from '@cdaxfx/ui';

import { riskLevelOptions, yesNoOptions } from '../../types';

export function ResidenceNationality() {
  const router = useRouter();

  const { theme } = useTheme();

  const {
    residenceNationalityResidenceOfBeneficial,
    residenceNationalityDoesThisApplyThisCase,
    residenceNationalityIsTheCountrySubject,
    residenceNationalityWhatIsNationality,
    residenceNationalityCompanyName,
    residenceNationalityWhatIsTheRiskRatingTheJurisdiction,
    onChangeData,
    resetConversion,
  } = useContextBusinessRiskAssessment();

  const disableNext = useMemo((): boolean => {
    return (
      !residenceNationalityDoesThisApplyThisCase ||
      !residenceNationalityIsTheCountrySubject ||
      !residenceNationalityWhatIsNationality ||
      !residenceNationalityCompanyName ||
      !residenceNationalityWhatIsTheRiskRatingTheJurisdiction
    );
  }, [
    residenceNationalityDoesThisApplyThisCase,
    residenceNationalityIsTheCountrySubject,
    residenceNationalityWhatIsNationality,
    residenceNationalityCompanyName,
    residenceNationalityWhatIsTheRiskRatingTheJurisdiction,
  ]);

  // useEffect(() => {
  //   if (!residenceNationalityResidenceOfBeneficial)
  //     onChangeData(
  //       'residenceNationalityResidenceOfBeneficial',
  //       clientSelected?.businessMetadata?.address1 ?? ''
  //     );
  // }, []);

  return (
    <Column style={{ width: 808, gap: 16 }}>
      <Input
        label="Residence of beneficial owners?"
        value={residenceNationalityResidenceOfBeneficial}
        onChange={(v) =>
          onChangeData('residenceNationalityResidenceOfBeneficial', v)
        }
      />

      {/* <Select
        showSearch
        disabled
        label={'Client nationality'}
        value={clientSelected?.businessMetadata?.countryOfRegistration}
        onChange={(v) => onChangeData('residenceNationality_clientNacional', v)}
        options={countriesOptions}
      /> */}

      <Select
        showSearch
        label={'What is the nationality of the beneficial owners?'}
        value={residenceNationalityWhatIsNationality}
        onChange={(v) =>
          onChangeData('residenceNationalityWhatIsNationality', v)
        }
        options={countriesOptions}
      />

      <RadioGroup
        label="Is the country subject to any sanctions?"
        options={yesNoOptions}
        value={residenceNationalityIsTheCountrySubject}
        onChangeData={(v) =>
          onChangeData('residenceNationalityIsTheCountrySubject', v as YES_NO)
        }
      />

      <RadioGroup
        label="What is the risk rating of the jurisdiction according to the Country Risk list*?"
        options={riskLevelOptions}
        value={residenceNationalityWhatIsTheRiskRatingTheJurisdiction}
        onChangeData={(v) =>
          onChangeData(
            'residenceNationalityWhatIsTheRiskRatingTheJurisdiction',
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
        value={residenceNationalityDoesThisApplyThisCase}
        onChangeData={(v) =>
          onChangeData('residenceNationalityDoesThisApplyThisCase', v as YES_NO)
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
            onChangeData('currentStep', EStepRiskAssessment.PRINCIPAL_KNOWN)
          }
          text="Next"
          roundness="rounded"
        />
      </Row>
    </Column>
  );
}
