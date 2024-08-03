import Flag from 'react-world-flags';

import { ITableProps } from '@/components/Table';

import { IWallet } from '@/store/useWallet/types';
import { Row } from '@luxbank/ui';

import { FlagContainer, TitleCurrency } from '../styles';

export const columns = (): ITableProps<IWallet>['columns'] => {
  return [
    {
      title: 'Currency',
      sorter: false,
      render: (data) => {
        return (
          <Row style={{ alignItems: 'center', gap: 8 }}>
            <FlagContainer>
              <Flag code={data?.currency.slice(0, 2)} height={40} width={128} />
            </FlagContainer>
            <TitleCurrency>{data.name}</TitleCurrency>
            <TitleCurrency style={{ fontWeight: 600 }}>
              {data.currency}
            </TitleCurrency>
          </Row>
        );
      },
    },
    {
      title: 'Actions',
      width: 230,
    },
  ];
};
