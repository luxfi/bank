'use client';

import { useCallback, useState } from 'react';
import Flag from 'react-world-flags';

import { countriesPhoneCodeArray } from '@/models/countries';

import { Space, Input, Select } from 'antd';

import { Container, Label, LabelError } from './styles';

const options = Object.entries(countriesPhoneCodeArray).map(
  (data: [string, string]) => ({
    label: data[1],
    value: data[0],
  })
);

interface IProps {
  label: string;
  value?: string;
  error?: string;
  disabled?: boolean;
  onChange?(value: string): void;
}

export default function InputPhoneNumber({
  label,
  onChange,
  value,
  disabled,
  error,
}: IProps) {
  const [areaCode, setAreaCode] = useState<string>('');

  const handleChange = useCallback(
    (value: string) => {
      return onChange && onChange(value);
    },
    [onChange]
  );

  const handleChangeAreCode = useCallback(
    (value: Array<string>) => {
      if (value.length === 0) return;

      const data = value.filter((v) => v);

      const area = value.filter((v) => v)?.[data.length - 1] ?? '';

      const code = options.filter((opt) => opt.value === area)?.[0]?.label;

      setAreaCode(area);

      return onChange && onChange(code);
    },
    [onChange]
  );

  return (
    <Container>
      <Label>{label}</Label>
      <Space.Compact>
        <Select
          disabled={disabled}
          style={{ width: 148 }}
          size="large"
          value={areaCode}
          onChange={(value) => {
            handleChangeAreCode(value as unknown as Array<string>);
          }}
          options={options}
          tagRender={(opt) => {
            return (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginLeft: 8,
                }}
              >
                <Flag
                  height={24}
                  width={24}
                  code={opt.value?.toString() ?? ''}
                />
                <span>{opt.value}</span>
              </div>
            );
          }}
          optionRender={(opt) => {
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Flag
                  height={24}
                  width={24}
                  code={opt.value?.toString() ?? ''}
                />
                <span>{opt.label}</span>
              </div>
            );
          }}
        />
        <Input
          size="large"
          value={value}
          disabled={disabled}
          onChange={(e) => handleChange(e.target.value)}
        />
      </Space.Compact>
      {error && <LabelError>{error}</LabelError>}
    </Container>
  );
}
