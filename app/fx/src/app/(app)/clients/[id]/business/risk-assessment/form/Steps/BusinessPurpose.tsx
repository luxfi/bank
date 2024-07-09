import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import Input from '@/components/Input';
import { RadioGroup } from '@/components/RadioGroup';

import {
  EStepRiskAssessment,
  YES_NO,
  useContextBusinessRiskAssessment,
} from '@/context/businessRiskAssessment';

import {
  Button,
  Column,
  Row,
  Text,
  useTheme,
} from '@cdaxfx/ui';

import { yesNoOptions } from '../../types';

export function BusinessPurpose() {
  const router = useRouter();
  const { theme } = useTheme();

  const {
    onChangeData,
    resetConversion,
    businessPurposeIfYesWhoItRegulatedBy,
    businessPurposeIsTheClientsRegulated,
    businessPurposeWhatIsTheBusinessActivity,
  } = useContextBusinessRiskAssessment();

  const disableNext = useMemo((): boolean => {
    return (
      !businessPurposeIsTheClientsRegulated ||
      (businessPurposeIsTheClientsRegulated === 'Yes' &&
        !businessPurposeIfYesWhoItRegulatedBy) ||
      !businessPurposeWhatIsTheBusinessActivity
    );
  }, [
    businessPurposeIfYesWhoItRegulatedBy,
    businessPurposeIsTheClientsRegulated,
    businessPurposeWhatIsTheBusinessActivity,
  ]);

  return (
    <Column style={{ width: 808, gap: 16 }}>
      <Input
        label="What is the business activity /purpose of the company ?"
        value={businessPurposeWhatIsTheBusinessActivity}
        onChange={(v) =>
          onChangeData('businessPurposeWhatIsTheBusinessActivity', v)
        }
      />

      <Text
        style={{ fontSize: 12 }}
        variant="body_md_regular"
      >{`HIGH RISK BUSINESS ACTIVITY (see note below)`}</Text>

      <Text
        style={{ fontSize: 12 }}
        variant="body_md_regular"
      >{`Business Type: Need sufficient detail to determine that business does not involve any sensitive activity possibly subject to sanctions or greater potential of bribery and corruption. Must consider the reputational impact that might also arise from involvement in the activity.`}</Text>

      <Text
        color={theme.textColor.layout.secondary.value}
        style={{ fontSize: 12 }}
        variant="body_md_regular"
      >{`Examples of higher risk activity include Arms and military/ mining / oil/ gas / gambling / unlicenced pharmaceutical / unregulated charity / pornography or prostitution / contaminated waste / online mail order / overseas property development / time share / debt collection / unlicenced money lending / education services not recognised by an appropriate authority / government contracts.`}</Text>

      <RadioGroup
        label="Is the clients activity regulated?"
        options={yesNoOptions}
        value={businessPurposeIsTheClientsRegulated}
        onChangeData={(v) =>
          onChangeData('businessPurposeIsTheClientsRegulated', v as YES_NO)
        }
      />

      <Input
        disabled={
          !businessPurposeIsTheClientsRegulated ||
          businessPurposeIsTheClientsRegulated === 'No'
        }
        label="If Yes, who is it regulated by?"
        value={businessPurposeIfYesWhoItRegulatedBy}
        onChange={(v) =>
          onChangeData('businessPurposeIfYesWhoItRegulatedBy', v)
        }
        helper="e.g. CSP/TSP/Consumer Credit/ Brokers/Money Lending/Handling Client Funds/Investment"
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
            onChangeData('currentStep', EStepRiskAssessment.VALUES_AND_VOLUME)
          }
          text="Next"
          roundness="rounded"
        />
      </Row>
    </Column>
  );
}
