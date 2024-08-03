import { Checkbox as CheckboxAntd } from 'antd';

import { Container, LabelError } from './styles';

interface IProps {
  label: string;
  checked?: boolean;
  onChange?(value: boolean): void;
  containerStyle?: React.CSSProperties;
  hasError?: string;
}

export default function Checkbox({
  label,
  checked,
  onChange,
  containerStyle,
  hasError,
}: IProps) {
  return (
    <Container style={containerStyle}>
      <CheckboxAntd
        onChange={(e) => onChange && onChange(e.target.checked)}
        checked={checked}
      >
        {label}
      </CheckboxAntd>
      {hasError && <LabelError>{hasError}</LabelError>}
    </Container>
  );
}
