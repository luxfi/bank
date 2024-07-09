import { ITransactionDetails, TRoutingCode } from '@/models/payment';

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

interface IPaymentReviewCardProps {
  payment?: Omit<ITransactionDetails, 'conversion'>;
  type: 'review' | 'created';
}

export function PaymentReviewCard({ type, payment }: IPaymentReviewCardProps) {
  const { theme } = useTheme();
  const textSecondary = theme.textColor.layout.secondary.value;

  const getCodes = (codes?: { name: TRoutingCode; value: string }[]) => {
    if (!codes) return { iban: '-', bicSwift: '-' };
    return {
      iban: codes.find((code) => code.name === 'iban')?.value || '-',
      bicSwift: codes.find((code) => code.name === 'bic swift')?.value || '-',
    };
  };

  const StatusBadge = () => {
    if (!payment) return null;
    return (
      <Badge
        variant={getBadgeStatusValues[payment?.status]?.variant}
        label={getBadgeStatusValues[payment?.status]?.label}
        icon={getBadgeStatusValues[payment?.status]?.icon}
      />
    );
  };

  const PaymentDetailsReview = () => (
    <Column gap="sm" width="100%">
      <Text variant="body_md_semibold">Payment details</Text>

      <Column>
        <Text variant="caption_regular" color={textSecondary}>
          Payment date
        </Text>
        <Text variant="body_md_regular">
          {formatDateAndTime(payment?.settlementDate)?.date || '-'}
        </Text>
      </Column>

      <Column>
        <Text variant="caption_regular" color={textSecondary}>
          Payment reason
        </Text>
        <Text variant="body_md_regular">{payment?.payment?.reason || '-'}</Text>
      </Column>

      <Column>
        <Text variant="caption_regular" color={textSecondary}>
          Payment reference
        </Text>
        <Text variant="body_md_regular">
          {payment?.payment?.paymentReference || '-'}
        </Text>
      </Column>
    </Column>
  );

  const PaymentDetailsCreated = () => (
    <DetailsCardTemplate.CardSection>
      <Column gap="sm" width="100%">
        <Text variant="body_md_semibold">Payment details</Text>

        <Column>
          <Text variant="caption_regular" color={textSecondary}>
            Transaction ID
          </Text>
          <Text variant="body_md_regular">
            {payment?.payment?.cdaxId || '-'}
          </Text>
        </Column>
        <Column>
          <Text variant="caption_regular" color={textSecondary}>
            Payment date
          </Text>
          <Text variant="body_md_regular">
            {formatDateAndTime(payment?.paymentDate)?.date || '-'}
          </Text>
        </Column>
      </Column>
      <Column gap="sm" width="100%">
        <Column>
          <Text variant="caption_regular" color={textSecondary}>
            Payment reason
          </Text>
          <Text variant="body_md_regular">
            {payment?.payment?.reason || '-'}
          </Text>
        </Column>

        <Column>
          <Text variant="caption_regular" color={textSecondary}>
            Payment reference
          </Text>
          <Text variant="body_md_regular">
            {payment?.payment?.paymentReference || '-'}
          </Text>
        </Column>
      </Column>
    </DetailsCardTemplate.CardSection>
  );

  const PayerDetails = () => (
    <Column gap="sm" width="100%">
      <Text variant="body_md_semibold">Payer</Text>

      <Column>
        <Text variant="caption_regular" color={textSecondary}>
          Name
        </Text>
        <Text variant="body_md_regular">
          {payment?.payment?.payer.name || '-'}
        </Text>
      </Column>
      <Column>
        <Text variant="caption_regular" color={textSecondary}>
          Country
        </Text>
        <Text variant="body_md_regular">
          {payment?.payment?.payer.country || '-'}
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
          {payment?.payment?.beneficiary.entityType || '-'}
        </Text>
      </Column>

      <Column>
        <Text variant="caption_regular" color={textSecondary}>
          Beneficiary Address
        </Text>
        <Text variant="body_md_regular">
          {payment?.payment?.beneficiary.address || '-'}
        </Text>
      </Column>

      <Column>
        <Text variant="caption_regular" color={textSecondary}>
          City
        </Text>
        <Text variant="body_md_regular">
          {payment?.payment?.beneficiary.city || '-'}
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
          {payment?.payment?.beneficiaryBank.country || '-'}
        </Text>
      </Column>

      <Column>
        <Text variant="caption_regular" color={textSecondary}>
          BIC/SWIFT Code
        </Text>
        <Text variant="body_md_regular">
          {getCodes(payment?.payment?.beneficiaryBank?.routingCodes).bicSwift}
        </Text>
      </Column>

      <Column>
        <Text variant="caption_regular" color={textSecondary}>
          IBAN
        </Text>
        <Text variant="body_md_regular">
          {getCodes(payment?.payment?.beneficiaryBank?.routingCodes).iban}
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
        <Text variant="body_md_regular">{payment?.creator?.name || '-'}</Text>
      </Column>
      <Column>
        <Text variant="caption_regular" color={textSecondary}>
          Email
        </Text>
        <Text variant="body_md_regular">{payment?.creator?.email || '-'}</Text>
      </Column>
    </Column>
  );

  return (
    <DetailsCardTemplate.Container>
      <DetailsCardTemplate.CardHeader>
        <Column>
          <Text variant="headline_semibold">
            {payment?.payment?.beneficiary?.name || '-'}
          </Text>
          <Text variant="caption_regular" color={textSecondary}>
            {payment?.payment?.beneficiary.entityType === 'individual'
              ? 'Beneficiary'
              : 'Company'}
          </Text>
        </Column>
        <Column align="flex-end">
          <Row gap="xxs" align="center">
            <Text variant="headline_regular">
              {formatCurrency(Number(payment?.out?.amount)) || '-'}
            </Text>
            <Text variant="headline_semibold">
              {payment?.out?.currency || '-'}
            </Text>
          </Row>
          <Row gap="xxs" align="center">
            <Icon
              variant="exclamation-circle"
              size="sm"
              color={textSecondary}
            />
            <Text variant="caption_regular" color={textSecondary}>
              {payment?.type || '-'}
            </Text>
          </Row>
        </Column>
      </DetailsCardTemplate.CardHeader>
      <DetailsCardTemplate.CardBody>
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
          <DetailsCardTemplate.CardSection>
            <PaymentDetailsReview />
          </DetailsCardTemplate.CardSection>
        )}
        {type === 'created' && (
          <DetailsCardTemplate.CardSection>
            <PayerDetails />
            <CreatorDetails />
          </DetailsCardTemplate.CardSection>
        )}
        <DetailsCardTemplate.CardSection style={{ borderBottom: 'none' }}>
          <BeneficiaryDetails />
          <BeneficiaryBankDetails />
        </DetailsCardTemplate.CardSection>
      </DetailsCardTemplate.CardBody>
    </DetailsCardTemplate.Container>
  );
}
