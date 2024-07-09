import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { Badge } from '@/components/Badge';
import { Divider } from '@/components/Divider';
import { LabelAndValue } from '@/components/LabelAndValue';

import { useClients } from '@/store/useClient';
import { Button, Column, Icon, Row, useTheme } from '@cdaxfx/ui';
import dayjs from 'dayjs';

export const HeaderClientsDetails = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { clientSelected } = useClients();

  const accountType = useMemo(
    () => (clientSelected?.individualMetadata ? 'Individual' : 'Business'),
    [clientSelected]
  );

  const account = useMemo(() => {
    return accountType === 'Individual'
      ? `${clientSelected?.individualMetadata?.firstname} ${clientSelected?.individualMetadata?.lastname}`
      : `${clientSelected?.businessMetadata?.companyName}`;
  }, [accountType, clientSelected]);

  const client = useMemo(() => {
    return accountType === 'Individual'
      ? clientSelected?.individualMetadata
      : clientSelected?.businessMetadata;
  }, [accountType, clientSelected]);

  const getBannerColor = useMemo(() => {
    const today = new Date();
    const completionDate = clientSelected?.riskAssessment?.completionDate
      ? dayjs(clientSelected?.riskAssessment?.completionDate)
      : null;

    const nextRaDate = clientSelected?.riskAssessment?.nextRiskAssessment
      ? dayjs(clientSelected?.riskAssessment?.nextRiskAssessment)
      : null;

    const lastTenOrLessDays = nextRaDate
      ? nextRaDate.diff(today, 'days') <= 10
      : false;

    if (!completionDate) {
      return theme.backgroundColor.feedback.negative.value;
    } else if (nextRaDate && lastTenOrLessDays) {
      return theme.backgroundColor.feedback.warning.value;
    } else {
      return theme.backgroundColor.layout['container-L1'].value;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientSelected?.riskAssessment]);

  return (
    <>
      <Column style={{ paddingTop: 24, paddingInline: 24 }}>
        <Row gap="sm" style={{ height: 46 }}>
          <LabelAndValue
            label="Account"
            value={account || '--'}
            valueStyle={{ fontSize: 20, fontWeight: 600 }}
          />
          <Divider orientation="vertical" />

          <LabelAndValue
            label="Type"
            value={
              accountType.charAt(0).toLocaleUpperCase() +
              accountType.slice(1).toLocaleLowerCase()
            }
            valueStyle={{ fontSize: 20, fontWeight: 400 }}
          />

          <Divider orientation="vertical" />

          <LabelAndValue
            label="Country"
            value={
              accountType === 'Individual'
                ? (client as any).country || '--'
                : (client as any).countryOfRegistration || '--'
            }
            valueStyle={{ fontSize: 20, fontWeight: 400 }}
          />
        </Row>
      </Column>

      <Row
        align="center"
        justify="space-between"
        margin="sm"
        padding="sm"
        style={{
          backgroundColor: getBannerColor,
        }}
      >
        <Row align="center" style={{ gap: 4 }}>
          {!clientSelected?.riskAssessment && (
            <Icon
              variant="danger-triangle"
              color={theme.textColor.feedback['icon-negative'].value}
            />
          )}
          <LabelAndValue
            label="Risk Assessment"
            value={
              <Badge
                label={
                  !clientSelected?.riskAssessment
                    ? 'Pending'
                    : clientSelected?.riskAssessment?.riskRating
                }
                variant={!clientSelected?.riskAssessment ? 'info' : 'warning'}
                type="dot"
              />
            }
          />
        </Row>

        <Row gap="md">
          <Button
            variant={clientSelected?.riskAssessment ? 'secondary' : 'primary'}
            roundness="rounded"
            text={clientSelected?.riskAssessment ? 'Revise' : 'Form'}
            leftIcon={'checklist-minimalistic'}
            onClick={() => router.push(`risk-assessment/form`)}
          />

          <LabelAndValue
            label="Review Date"
            value={
              clientSelected?.riskAssessment?.completionDate
                ? dayjs(clientSelected?.riskAssessment?.completionDate).format(
                    'DD MMM YYYY'
                  )
                : '-'
            }
          />
          <LabelAndValue
            label="Next Review Due"
            value={
              clientSelected?.riskAssessment?.nextRiskAssessment
                ? dayjs(
                    clientSelected?.riskAssessment?.nextRiskAssessment
                  ).format('YYYY-MM-DD')
                : '-'
            }
          />
        </Row>
      </Row>
    </>
  );
};
