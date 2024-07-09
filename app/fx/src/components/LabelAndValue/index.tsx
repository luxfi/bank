'use client';

import { CSSProperties } from 'react';

import { Container, Label, Value } from './styles';

interface IProps {
  label: string;
  value: string | number | React.ReactNode;
  containerStyle?: CSSProperties;
  labelStyle?: CSSProperties;
  valueStyle?: CSSProperties;
}

export const LabelAndValue: React.FC<IProps> = ({
  label,
  value,
  labelStyle,
  valueStyle,
  containerStyle,
}) => {
  return (
    <Container style={containerStyle}>
      <Label style={labelStyle}>{label}</Label>
      {['string', 'number'].includes(typeof value) || !value ? (
        <Value style={valueStyle}>{value || '-'}</Value>
      ) : (
        value
      )}
    </Container>
  );
};
