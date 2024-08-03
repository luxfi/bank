'use client';

import { CSSProperties } from 'react';

import { Text, useTheme } from '@luxbank/ui';
import { Input as InputStyled } from 'antd';

import {
  Container,
  Label,
  StyledPhoneInput,
  StyledCurrencyInput,
} from './styles';

type TVariant = 'default' | 'phoneNumber' | 'textArea' | 'currency';

interface IProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'size'
  > {
  label: string;
  containerStyle?: CSSProperties;
  placeholder?: string;
  error?: string;
  value?: string;
  onChange: (value: string) => void;
  helper?: string;
  password?: boolean;
  variant?: TVariant;
  warning?: string;
}

export default function Input({
  label,
  containerStyle,
  placeholder,
  error,
  disabled,
  onChange,
  password,
  value,
  variant = 'default',
  helper,
  warning,
  ...props
}: IProps) {
  const InputComponent = password ? InputStyled.Password : InputStyled;
  const { TextArea } = InputStyled;
  const { theme } = useTheme();

  const Inputs: Record<TVariant, React.ReactNode> = {
    default: (
      <InputComponent
        disabled={disabled}
        status={error ? 'error' : warning ? 'warning' : undefined}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        size="large"
        {...props}
      />
    ),
    phoneNumber: (
      <StyledPhoneInput
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        international
        defaultCountry={'IM'}
        error={error && 'error'}
        className={error && 'hasError'}
        addInternationalOption={false}
      />
    ),
    textArea: (
      <TextArea
        rows={4}
        disabled={disabled}
        status={error ? 'error' : warning ? 'warning' : undefined}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        size="large"
      />
    ),
    currency: (
      <StyledCurrencyInput
        disabled={disabled}
        placeholder={placeholder}
        decimalsLimit={2}
        value={value}
        onValueChange={(value) => onChange(value as string)}
        className={error && 'hasError'}
        intlConfig={{ locale: 'en-US' }}
      />
    ),
  };

  return (
    <Container style={{ ...containerStyle, opacity: disabled ? 0.6 : 1 }}>
      <Label>{label}</Label>
      {Inputs[variant]}
      {(error || warning || helper) && (
        <Text
          style={{ marginTop: 4 }}
          variant="caption_regular"
          color={
            error
              ? theme.textColor.feedback['icon-negative'].value
              : warning
                ? theme.textColor.feedback['icon-warning'].value
                : theme.textColor.layout.secondary.value
          }
        >
          {error || warning || helper}
        </Text>
      )}
    </Container>
  );
}
