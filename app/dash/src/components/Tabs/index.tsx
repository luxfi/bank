'use client';
import { Tabs as AntdTabs, TabsProps } from 'antd';

import { Container } from './styles';

interface IProps {
  items: TabsProps['items'];
  defaultActiveKeyTab: number;
  onChange?: (index: number) => void;
  containerStyle?: React.CSSProperties;
  activeTabKey?: string;
}

export default function Tabs({
  defaultActiveKeyTab = 1,
  items,
  onChange,
  containerStyle,
  activeTabKey,
}: IProps) {
  return (
    <Container style={containerStyle}>
      <AntdTabs
        onChange={(e) => onChange?.(Number(e))}
        defaultActiveKey={defaultActiveKeyTab.toString()}
        items={items}
        activeKey={activeTabKey}
      />
    </Container>
  );
}
