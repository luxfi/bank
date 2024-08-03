'use client';
import { useRouter } from 'next/navigation';

import {
  DollarOutlined,
  FundProjectionScreenOutlined,
  SyncOutlined,
  UserAddOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { CardContainer, Text } from './styles';

type TClient =
  | 'CLIENTS'
  | 'NEW_CLIENT'
  | 'VIEW_ACCOUNTS'
  | 'ADD_BENEFICIARY'
  | 'CREATE_PAYMENT'
  | 'MAKE_CONVERSION';

interface IProps {
  text: string;
  type: TClient;
}

interface ICardObjValue {
  icon: React.ReactNode;
  route: string;
}

const baseStyleIcon: React.CSSProperties = {
  fontSize: 32,
};

export default function CardClient({ text, type }: IProps) {
  const router = useRouter();

  const typeMap: Record<TClient, ICardObjValue> = {
    CLIENTS: {
      icon: <UserOutlined style={baseStyleIcon} />,
      route: '/clients',
    },
    NEW_CLIENT: {
      icon: <UserAddOutlined style={baseStyleIcon} />,
      route: '/clients/new',
    },
    ADD_BENEFICIARY: {
      icon: <UserOutlined style={baseStyleIcon} />,
      route: '/beneficiaries/new',
    },
    CREATE_PAYMENT: {
      icon: <DollarOutlined style={baseStyleIcon} />,
      route: '/create-payment',
    },
    MAKE_CONVERSION: {
      icon: <SyncOutlined style={baseStyleIcon} />,
      route: '/convert',
    },
    VIEW_ACCOUNTS: {
      icon: <FundProjectionScreenOutlined style={baseStyleIcon} />,
      route: '/balances',
    },
  };

  return (
    <CardContainer onClick={() => router.push(typeMap[type].route)}>
      {typeMap[type].icon}

      <Text>{text}</Text>
    </CardContainer>
  );
}
