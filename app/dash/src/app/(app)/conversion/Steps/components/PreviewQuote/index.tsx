import { Badge } from '@/components/Badge';

import { Icon, useTheme } from '@luxbank/ui';

import {
  Container,
  ContainerLabels,
  Content,
  Header,
  Label,
  LabelValue,
} from './styles';

interface IProps {
  selling: string;
  buying: string;
  rate: string;
  rateDate: string;
  settlementDate: string;
  createDate?: string;
  status?: string;
  transactionId?: string;
  conversionDate: string;
}

export const PreviewQuote: React.FC<IProps> = ({
  buying,
  conversionDate,
  rate,
  rateDate,
  selling,
  createDate,
  status,
  settlementDate,
  transactionId,
}) => {
  const { theme } = useTheme();

  return (
    <Container>
      <Header>
        <ContainerLabels>
          <LabelValue style={{ fontSize: 20 }}>{selling}</LabelValue>
          <Label>Selling</Label>
        </ContainerLabels>

        <Icon
          variant="arrow-right"
          size={'md'}
          color={theme.textColor.layout.primary.value}
        />

        <ContainerLabels>
          <LabelValue style={{ fontSize: 20 }}>{buying}</LabelValue>
          <Label>Buying</Label>
        </ContainerLabels>
      </Header>
      <Content>
        {status && (
          <ContainerLabels style={{ marginBottom: 24 }}>
            <Label>Status</Label>
            <Badge
              type="tag"
              label={status}
              variant={status === 'Pending' ? 'negative' : 'positive'}
            />
          </ContainerLabels>
        )}

        <LabelValue>{`Payment details`}</LabelValue>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 8,
            marginTop: 16,
          }}
        >
          <ContainerLabels>
            <Label>Exchange rate</Label>
            <LabelValue>{rate}</LabelValue>
          </ContainerLabels>
          {createDate && (
            <ContainerLabels>
              <Label>Create Date</Label>
              <LabelValue>{createDate}</LabelValue>
            </ContainerLabels>
          )}
          <ContainerLabels>
            <Label>Settlement Date</Label>
            <LabelValue>{settlementDate}</LabelValue>
          </ContainerLabels>
          <ContainerLabels>
            <Label>Exchange rate Date</Label>
            <LabelValue>{rateDate}</LabelValue>
          </ContainerLabels>
          {transactionId && (
            <ContainerLabels>
              <Label>Transaction ID</Label>
              <LabelValue>{transactionId}</LabelValue>
            </ContainerLabels>
          )}
          <ContainerLabels>
            <Label>Conversion Date</Label>
            <LabelValue>{conversionDate}</LabelValue>
          </ContainerLabels>
        </div>
      </Content>
    </Container>
  );
};
