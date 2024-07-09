import { ITransactionDetails } from '@/models/payment';

import { formatCurrency, formatDateAndTime } from '@/utils/lib';
import { getBadgeStatusValues } from '@/utils/valueMaps';

import {
  Column,
  Icon,
  Row,
  Text,
  useTheme,
} from '@cdaxfx/ui';

import { Badge } from '../Badge';
import { DetailsCardTemplate } from '../DetailsCardTemplate';

interface IConversionCardProps {
  data: ITransactionDetails;
}
export const ConversionCard = ({ data }: IConversionCardProps) => {
  const { theme } = useTheme();
  const textSecondary = theme.textColor.layout.secondary.value;

  const StatusBadge = () => {
    if (!data) return null;
    return (
      <Badge
        variant={getBadgeStatusValues[data?.status]?.variant}
        label={getBadgeStatusValues[data?.status]?.label}
        icon={getBadgeStatusValues[data?.status]?.icon}
      />
    );
  };

  return (
    <DetailsCardTemplate.Container>
      <DetailsCardTemplate.CardHeader>
        <Row width="100%" justify="space-between">
          <Column gap="xxxs">
            <Row gap="xxs">
              <Text variant="headline_regular">
                {formatCurrency(Number(data.out?.amount))}
              </Text>
              <Text variant="headline_bold">{data.out?.currency}</Text>
            </Row>
            <Text variant="caption_regular" color={textSecondary}>
              Sold
            </Text>
          </Column>
          <Icon variant="arrow-right" size="lg" />
          <Column align="flex-end" gap="xxxs">
            <Row gap="xxs">
              <Text variant="headline_regular">
                {formatCurrency(Number(data.in?.amount))}
              </Text>
              <Text variant="headline_bold">{data.in?.currency}</Text>
            </Row>
            <Text variant="caption_regular" color={textSecondary}>
              Bought
            </Text>
          </Column>
        </Row>
      </DetailsCardTemplate.CardHeader>
      <DetailsCardTemplate.CardBody>
        <Column>
          <Text variant="caption_regular" color={textSecondary}>
            Status
          </Text>
          <StatusBadge />
        </Column>
        <Row style={{ marginTop: '24px' }}>
          <Text variant="body_md_bold" style={{ width: '100%' }}>
            Conversion details
          </Text>
        </Row>
        <DetailsCardTemplate.CardSection style={{ borderBottom: 'none' }}>
          <Column gap="sm">
            <Column>
              <Text variant="caption_regular" color={textSecondary}>
                Exchange rate
              </Text>
              <Text variant="body_md_regular">
                {data.conversion?.conversionRate || '-'}
              </Text>
            </Column>

            <Column>
              <Text variant="caption_regular" color={textSecondary}>
                Exchange rate Date
              </Text>
              <Text variant="body_md_regular">
                {data.conversion?.exchangeRateDate
                  ? `${formatDateAndTime(data.conversion?.exchangeRateDate)
                      ?.date} - ${formatDateAndTime(
                      data.conversion?.exchangeRateDate
                    )?.time}`
                  : '-'}
              </Text>
            </Column>

            <Column>
              <Text variant="caption_regular" color={textSecondary}>
                Transaction ID
              </Text>
              <Text variant="body_md_regular">
                {data.payment?.cdaxId || '-'}
              </Text>
            </Column>
          </Column>

          <Column gap="sm">
            <Column>
              <Text variant="caption_regular" color={textSecondary}>
                Created Date
              </Text>
              <Text variant="body_md_regular">
                {data.createDate
                  ? `${formatDateAndTime(data.createDate)
                      ?.date} - ${formatDateAndTime(data.createDate)?.time}`
                  : '-'}
              </Text>
            </Column>

            <Column>
              <Text variant="caption_regular" color={textSecondary}>
                Settlement Date
              </Text>
              <Text variant="body_md_regular">
                {data.settlementDate
                  ? `${formatDateAndTime(data.settlementDate)
                      ?.date} - ${formatDateAndTime(data.settlementDate)?.time}`
                  : '-'}
              </Text>
            </Column>

            <Column>
              <Text variant="caption_regular" color={textSecondary}>
                Conversion Date
              </Text>
              <Text variant="body_md_regular">
                {data.conversion?.conversionDate
                  ? `${formatDateAndTime(data.conversion?.conversionDate)
                      ?.date} - ${formatDateAndTime(
                      data.conversion?.conversionDate
                    )?.time}`
                  : '-'}
              </Text>
            </Column>
          </Column>
        </DetailsCardTemplate.CardSection>
      </DetailsCardTemplate.CardBody>
    </DetailsCardTemplate.Container>
  );
};
