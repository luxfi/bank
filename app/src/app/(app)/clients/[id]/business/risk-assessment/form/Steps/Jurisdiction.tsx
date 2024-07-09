import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { RadioGroup } from '@/components/RadioGroup';

import {
  AVAILABLE,
  EStepRiskAssessment,
  RISK_LEVELS,
  YES_NO,
  useContextBusinessRiskAssessment,
} from '@/context/businessRiskAssessment';

import { Button, Column, Row, Text, useTheme } from '@cdaxfx/ui';

import { availableOptions, riskLevelOptions, yesNoOptions } from '../../types';

export function Jurisdiction() {
  const router = useRouter();
  const { theme } = useTheme();

  const {
    onChangeData,
    resetConversion,
    jurisdictionAreThereAnyBearerSharesIssued,
    jurisdictionDoesThisApplyThisCase,
    jurisdictionIsCompanyOwnershipDirectors,
    jurisdictionIsTheEntityPublicListed,
    jurisdictionWhatIsTheHighestRisk,
    jurisdictionWithinCorporateHighRisk,
    jurisdictionWithinCorporateStructure,
  } = useContextBusinessRiskAssessment();

  const disableNext = useMemo((): boolean => {
    return (
      !jurisdictionAreThereAnyBearerSharesIssued ||
      !jurisdictionDoesThisApplyThisCase ||
      !jurisdictionIsCompanyOwnershipDirectors ||
      !jurisdictionWhatIsTheHighestRisk ||
      !jurisdictionIsTheEntityPublicListed ||
      !jurisdictionWithinCorporateHighRisk ||
      !jurisdictionWithinCorporateStructure
    );
  }, [
    jurisdictionAreThereAnyBearerSharesIssued,
    jurisdictionDoesThisApplyThisCase,
    jurisdictionIsCompanyOwnershipDirectors,
    jurisdictionIsTheEntityPublicListed,
    jurisdictionWhatIsTheHighestRisk,
    jurisdictionWithinCorporateHighRisk,
    jurisdictionWithinCorporateStructure,
  ]);

  return (
    <Column style={{ width: 808, gap: 16 }}>
      <RadioGroup
        label="Within the Corporate structure/ownership is there any country of incorporation subject to Sanctions?"
        options={yesNoOptions}
        value={jurisdictionWithinCorporateStructure}
        onChangeData={(v) =>
          onChangeData('jurisdictionWithinCorporateStructure', v as YES_NO)
        }
      />

      <RadioGroup
        label="Within the Corporate structure/ownership is there any country of incorporation that is High Risk?"
        options={yesNoOptions}
        value={jurisdictionWithinCorporateHighRisk}
        onChangeData={(v) =>
          onChangeData('jurisdictionWithinCorporateHighRisk', v as YES_NO)
        }
      />

      <RadioGroup
        label="What is the highest risk rating of the jurisdictions involved?"
        options={riskLevelOptions}
        value={jurisdictionWhatIsTheHighestRisk}
        onChangeData={(v) =>
          onChangeData('jurisdictionWhatIsTheHighestRisk', v as RISK_LEVELS)
        }
      />

      <RadioGroup
        label="Is the entity a public listed company or wholly owned subsidiary?"
        options={yesNoOptions}
        value={jurisdictionIsTheEntityPublicListed}
        onChangeData={(v) =>
          onChangeData('jurisdictionIsTheEntityPublicListed', v as YES_NO)
        }
      />

      <RadioGroup
        label="Are there any bearer shares issued?"
        options={yesNoOptions}
        value={jurisdictionAreThereAnyBearerSharesIssued}
        onChangeData={(v) =>
          onChangeData('jurisdictionAreThereAnyBearerSharesIssued', v as YES_NO)
        }
      />

      <Text
        style={{ fontSize: 12 }}
        variant="body_md_regular"
      >{`If yes must be imobilizei and undertaking obtained.`}</Text>

      <RadioGroup
        label="Is the Company ownership/Directors information publicly available?"
        subLabel={
          "(Question does not apply to IOM 2006 incorporated company's)"
        }
        options={availableOptions}
        value={jurisdictionIsCompanyOwnershipDirectors}
        onChangeData={(v) =>
          onChangeData(
            'jurisdictionIsCompanyOwnershipDirectors',
            v as AVAILABLE
          )
        }
      />

      {/* <Text
        color={theme.textColor.layout.secondary.value}
        style={{ fontSize: 10, marginTop: -12 }}
        variant="body_md_regular"
      >{`(Question does not apply to IOM 2006 incorporated company's)`}</Text> */}

      <Text
        color={theme.textColor.layout.secondary.value}
        style={{ fontSize: 12 }}
        variant="body_md_regular"
      >{`NOTE: e.g. A Delaware Co would be rated low risk on US Country rating but could have bearer shares and no publicly accessible records.  Ownership could change without being able to find out. !!  would therefore present a higher risk.`}</Text>

      <Text
        // color={theme.textColor.layout.secondary.value}
        style={{ fontSize: 12 }}
        variant="body_md_regular"
      >{`Where the client has a material connection to a country covered by a statement from an international body (list A or B of High Risk jurisdiction lists issued by IOM Gov Dept of Home Affairs) then MUST rate the relationship as High Risk and no downgrade can be applied.*`}</Text>

      <RadioGroup
        label="Does this apply in this case?"
        options={yesNoOptions}
        value={jurisdictionDoesThisApplyThisCase}
        onChangeData={(v) =>
          onChangeData('jurisdictionDoesThisApplyThisCase', v as YES_NO)
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
            onChangeData('currentStep', EStepRiskAssessment.AREAS_OF_OPERATION)
          }
          text="Next"
          roundness="rounded"
        />
      </Row>
    </Column>
  );
}
