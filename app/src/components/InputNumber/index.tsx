'use client';

import { CSSProperties } from 'react';

import { Container, Label, LabelError, StyledInput } from './styles';

interface IProps {
  label: string;
  containerStyle?: CSSProperties;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  error?: string;
  onChange: (value: string | null) => void;
  parser?: ((displayValue: string | undefined) => string) | undefined;
}

export default function InputNumber({
  label,
  onChange,
  value,
  disabled,
  containerStyle,
  placeholder,
  error,
  parser,
}: IProps) {
  return (
    <Container style={containerStyle}>
      <Label>{label}</Label>
      <StyledInput
        placeholder={placeholder}
        parser={parser}
        disabled={disabled}
        onKeyDown={(e) => {
          if (e.code.includes('Key')) {
            e.preventDefault();
          }
        }}
        size="large"
        min={'0'}
        value={value}
        onChange={onChange}
      />

      {error && <LabelError>{error}</LabelError>}
    </Container>
  );
}
