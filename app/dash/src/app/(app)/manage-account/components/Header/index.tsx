import { useEffect, useMemo } from 'react';

import { Badge } from '@/components/Badge';
import { Divider } from '@/components/Divider';
import { LabelAndValue } from '@/components/LabelAndValue';

import { getRiskAssesmentStatusBadgeValues } from '@/utils/valueMaps';

import { useAuth } from '@/store/useAuth';
import { Column, Row, Text } from '@luxbank/ui';
import dayjs from 'dayjs';

export const HeaderDetails = () => {
  const { currentUser, currentClientInfo, getCurrentClientInfo } = useAuth();
  const accountType = useMemo(
    () => currentUser?.currentClient.account.entityType ?? '',
    [currentUser?.currentClient]
  );

  const getCurrentClient = async () => {
    if (currentClientInfo.client) return;
    await getCurrentClientInfo();
  };

  useEffect(() => {
    getCurrentClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Column style={{ paddingTop: 24, paddingInline: 24 }}>
        <Row gap="sm" style={{ height: 46 }}>
          <LabelAndValue
            label="Account"
            value={currentClientInfo?.client?.name || '--'}
            valueStyle={{ fontSize: 20, fontWeight: 600 }}
          />

          <Divider orientation="vertical" />

          <LabelAndValue
            label="Type"
            value={
              accountType.charAt(0).toLocaleUpperCase() +
                accountType.slice(1).toLocaleLowerCase() || '--'
            }
            valueStyle={{ fontSize: 20, fontWeight: 400 }}
          />
        </Row>
      </Column>

      <Row
        justify="space-between"
        style={{ width: '100%', marginTop: 24, paddingInline: 24 }}
      >
        <Column>
          <Text variant="caption_regular">Risk Assessment</Text>
          <Badge
            variant={
              getRiskAssesmentStatusBadgeValues[
                currentClientInfo?.user?.riskAssessment?.riskRating?.toLowerCase()
              ]?.variant || 'neutral'
            }
            label={
              getRiskAssesmentStatusBadgeValues[
                currentClientInfo?.user?.riskAssessment?.riskRating?.toLowerCase()
              ]?.label || '--'
            }
            type="dot"
          />
        </Column>

        <Row gap="sm">
          <LabelAndValue
            label="Review Date"
            value={
              dayjs(
                currentClientInfo?.user?.riskAssessment?.completionDate
              ).format('YYYY-MM-DD') || '--'
            }
          />
          <LabelAndValue
            label="Next Review Due"
            value={
              dayjs(
                currentClientInfo?.user?.riskAssessment?.nextRiskAssessment
              ).format('YYYY-MM-DD') || '--'
            }
          />
        </Row>
      </Row>
    </>
  );
};
