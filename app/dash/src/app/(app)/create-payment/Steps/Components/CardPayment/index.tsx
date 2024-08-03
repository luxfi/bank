import { Badge } from '@/components/Badge';

import { ITransactionDetails } from '@/models/payment';

import { formatCurrency } from '@/utils/lib';
import { getBadgeStatusValues } from '@/utils/valueMaps';

import { Column, Icon, Row, Text, useTheme } from '@cdaxfx/ui';
import dayjs from 'dayjs';

import { CardBody, CardHeader, CardSection, Container } from './styles';

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

interface IPaymentCreatedProps {
  type: 'created' | 'review';
  transaction: DeepPartial<ITransactionDetails>;
}

export function PaymentCard({ type, transaction }: IPaymentCreatedProps) {
  const { theme } = useTheme();
  const textSecondary = theme.textColor.layout.secondary.value;

  const StatusBadge = () => {
    if (transaction.status) {
      return (
        <Badge
          variant={getBadgeStatusValues[transaction?.status].variant}
          label={getBadgeStatusValues[transaction?.status].label}
          icon={getBadgeStatusValues[transaction?.status].icon}
        />
      );
    }

    return null;
  };

  const PaymentDetailsReview = () => (
    <Column gap="sm" width="100%">
      <Text variant="body_md_semibold">Payment details</Text>

      <Column>
        <Text variant="caption_regular" color={textSecondary}>
          Payment date
        </Text>
        <Text variant="body_md_regular">
          {dayjs(transaction?.settlementDate, 'YYYY-MM-DD').format(
            'DD/MM/YYYY'
          )}
        </Text>
      </Column>

      <Column>
        <Text variant="caption_regular" color={textSecondary}>
          Payment reason
        </Text>
        <Text variant="body_md_regular">{transaction?.payment?.reason}</Text>
      </Column>

      <Column>
        <Text variant="caption_regular" color={textSecondary}>
          Payment reference
        </Text>
        <Text variant="body_md_regular">
          {transaction?.payment?.paymentReference}
        </Text>
      </Column>
    </Column>
  );

  const PaymentDetailsCreated = () => (
    <CardSection>
      <Column gap="sm" width="100%">
        <Text variant="body_md_semibold">Payment details</Text>

        <Column>
          <Text variant="caption_regular" color={textSecondary}>
            Transaction ID
          </Text>
          <Text variant="body_md_regular">{transaction?.payment?.cdaxId}</Text>
        </Column>
        <Column>
          <Text variant="caption_regular" color={textSecondary}>
            Payment date
          </Text>
          <Text variant="body_md_regular">
            {dayjs(transaction?.paymentDate, 'YYYY-MM-DD').format('YYYY-MM-DD')}
          </Text>
        </Column>
      </Column>
      <Column gap="sm" width="100%">
        <Column>
          <Text variant="caption_regular" color={textSecondary}>
            Payment reason
          </Text>
          <Text variant="body_md_regular">{transaction?.payment?.reason}</Text>
        </Column>

        <Column>
          <Text variant="caption_regular" color={textSecondary}>
            Payment reference
          </Text>
          <Text variant="body_md_regular">
            {transaction?.payment?.paymentReference}
          </Text>
        </Column>
      </Column>
    </CardSection>
  );

  const PayerDetails = () => (
    <Column gap="sm" width="100%">
      <Text variant="body_md_semibold">Payer</Text>

      <Column>
        <Text variant="caption_regular" color={textSecondary}>
          Name
        </Text>
        <Text variant="body_md_regular">
          {transaction?.payment?.payer?.name}
        </Text>
      </Column>
      <Column>
        <Text variant="caption_regular" color={textSecondary}>
          Country
        </Text>
        <Text variant="body_md_regular">
          {transaction?.payment?.payer?.country}
        </Text>
      </Column>
    </Column>
  );

  const BeneficiaryDetails = () => (
    <Column gap="sm" width="100%">
      <Text variant="body_md_semibold">Beneficiary details</Text>

      <Column>
        <Text variant="caption_regular" color={textSecondary}>
          Entity type
        </Text>
        <Text variant="body_md_regular">
          {transaction?.payment?.beneficiary?.entityType}
        </Text>
      </Column>

      <Column>
        <Text variant="caption_regular" color={textSecondary}>
          Beneficiary Address
        </Text>
        <Text variant="body_md_regular">
          {transaction?.payment?.beneficiary?.address}
        </Text>
      </Column>

      <Column>
        <Text variant="caption_regular" color={textSecondary}>
          City
        </Text>
        <Text variant="body_md_regular">
          {transaction?.payment?.beneficiary?.city}
        </Text>
      </Column>
    </Column>
  );

  const BeneficiaryBankDetails = () => (
    <Column gap="sm" width="100%">
      <Text variant="body_md_semibold">Beneficiary bank details</Text>

      <Column>
        <Text variant="caption_regular" color={textSecondary}>
          Bank country
        </Text>
        <Text variant="body_md_regular">
          {transaction?.payment?.beneficiaryBank?.country}
        </Text>
      </Column>

      <Column>
        <Text variant="caption_regular" color={textSecondary}>
          BIC/SWIFT Code
        </Text>
        <Text variant="body_md_regular">
          {
            transaction?.payment?.beneficiaryBank?.routingCodes?.find(
              (i) => i?.name === 'bic swift'
            )?.value
          }
        </Text>
      </Column>

      <Column>
        <Text variant="caption_regular" color={textSecondary}>
          IBAN
        </Text>
        <Text variant="body_md_regular">
          {
            transaction?.payment?.beneficiaryBank?.routingCodes?.find(
              (i) => i?.name === 'iban'
            )?.value
          }
        </Text>
      </Column>
    </Column>
  );

  const CreatorDetails = () => (
    <Column gap="sm" width="100%">
      <Text variant="body_md_semibold">Creator</Text>

      <Column>
        <Text variant="caption_regular" color={textSecondary}>
          Name
        </Text>
        <Text variant="body_md_regular">{transaction?.creator?.name}</Text>
      </Column>
      <Column>
        <Text variant="caption_regular" color={textSecondary}>
          Email
        </Text>
        <Text variant="body_md_regular">{transaction?.creator?.email}</Text>
      </Column>
    </Column>
  );

  return (
    <Container>
      <CardHeader>
        <Column>
          <Text variant="headline_semibold">
            {transaction?.payment?.beneficiary?.name}
          </Text>
          <Text variant="caption_regular" color={textSecondary}>
            {transaction?.payment?.beneficiary?.entityType === 'individual'
              ? 'Beneficiary'
              : 'Company'}
          </Text>
        </Column>
        <Column align="flex-end">
          <Row gap="xxs" align="center">
            <Text variant="headline_regular">
              {formatCurrency(Number(transaction?.out?.amount))}
            </Text>
            <Text variant="headline_semibold">
              {transaction?.out?.currency}
            </Text>
          </Row>
          <Row align="center">
            <Icon
              variant="exclamation-circle"
              size="sm"
              color={textSecondary}
            />
            <Text variant="caption_regular" color={textSecondary}>
              {transaction?.paymentType || transaction.type}
            </Text>
          </Row>
        </Column>
      </CardHeader>
      <CardBody>
        {type !== 'review' && (
          <Column>
            <Text variant="caption_regular" color={textSecondary}>
              Status
            </Text>
            <StatusBadge />
          </Column>
        )}
        {type === 'created' && <PaymentDetailsCreated />}
        {type === 'review' && (
          <CardSection>
            <PaymentDetailsReview />
          </CardSection>
        )}
        {type === 'created' && (
          <CardSection>
            <PayerDetails />
            <CreatorDetails />
          </CardSection>
        )}
        <CardSection style={{ borderBottom: 'none' }}>
          <BeneficiaryDetails />
          <BeneficiaryBankDetails />
        </CardSection>
      </CardBody>
    </Container>
  );
}
