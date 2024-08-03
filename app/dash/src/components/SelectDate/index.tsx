import React from 'react';

import { Icon, Text, useTheme } from '@cdaxfx/ui';
import { DatePicker, DatePickerProps } from 'antd';
import days from 'dayjs';

import { Tooltip } from '../Tooltip';
import { Container, Label } from './styles';

interface IProps {
  label: string;
  value?: string;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  info?: string;
  containerStyle?: React.CSSProperties;
  onChange: (value: string) => void;
  format?: string;
  disabledDate?: (date: days.Dayjs) => boolean;
  helper?: string;
  warning?: string;
}

const SelectDate: React.FC<IProps> = ({
  label,
  value,
  onChange,
  error,
  disabled,
  info,
  placeholder,
  containerStyle,
  format = 'YYYY-MM-DD',
  disabledDate,
  helper,
  warning,
}) => {
  const { theme } = useTheme();

  const handleChangeDate: DatePickerProps['onChange'] = (date, dateString) => {
    if (dateString) {
      onChange(dateString as string);
    }
  };

  return (
    <Container style={containerStyle}>
      <div
        style={{
          display: 'fle',
          gap: 4,
          marginBottom: 4,
          alignItems: 'center',
        }}
      >
        <Tooltip width={'513px'} placement="bottom" title={info}>
          <Label>{label}</Label>
          {info && (
            <Icon
              style={{ cursor: 'pointer', marginTop: 4 }}
              size="xs"
              variant="info-circle"
            />
          )}
        </Tooltip>
      </div>
      <DatePicker
        disabled={disabled}
        value={value ? days(value, format) : undefined}
        size="large"
        format={format}
        disabledDate={disabledDate}
        status={error ? 'error' : warning ? 'warning' : undefined}
        onChange={handleChangeDate}
        placeholder={placeholder}
      />
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
};

export default SelectDate;
