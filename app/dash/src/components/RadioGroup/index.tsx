import { Column, Text, useTheme } from '@luxbank/ui';
import { Radio, RadioChangeEvent } from 'antd';

import { Label } from './styles';

interface IItemsOPT {
  value: string;
  label: string;
}

interface IProps {
  label: string;
  subLabel?: string;
  value?: string;
  disabled?: boolean;
  options: Array<IItemsOPT>;
  onChangeData(value: string): void;
}

export const RadioGroup: React.FC<IProps> = ({
  onChangeData,
  options,
  label,
  value,
  subLabel,
  disabled,
}) => {
  const { theme } = useTheme();

  const onChange = (e: RadioChangeEvent) => {
    onChangeData(e.target.value);
  };

  return (
    <Column>
      <Label>{label}</Label>
      <Text
        color={theme.textColor.layout.secondary.value}
        style={{ fontSize: 11, marginTop: -4 }}
        variant="body_md_regular"
      >
        {subLabel}
      </Text>

      <Radio.Group disabled={disabled} onChange={onChange} value={value}>
        {options?.map(({ label, value }) => (
          <Radio key={label} value={value}>
            {label}
          </Radio>
        ))}
      </Radio.Group>
    </Column>
  );
};
