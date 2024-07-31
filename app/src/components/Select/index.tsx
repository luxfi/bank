'use client';

import {
  CSSProperties,
  JSXElementConstructor,
  ReactElement,
  useCallback,
  useMemo,
} from 'react';

import { Column, Text, useTheme } from '@cdaxfx/ui';
import { Spin } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

import { Container, Label, StyledSelect } from './styles';
import { SelectProps } from 'antd/lib';

interface IProps {
  label: string | JSX.Element;
  containerStyle?: CSSProperties;
  defaultValue?: string;
  placeholder?: string;
  error?: string;
  value?: string;
  disabled?: boolean;
  mode?: 'multiple' | 'tags';
  options?: Array<DefaultOptionType>;
  onChange(value: string): void;
  password?: boolean;
  helper?: string;
  warning?: string;
  isLoading?: boolean;
  showSearch?: boolean;
  onSearch?: (value: string) => void;
}

export default function Select({
  label,
  containerStyle,
  defaultValue,
  placeholder,
  error,
  disabled,
  onChange,
  options,
  value,
  helper,
  warning,
  mode,
  isLoading,
  showSearch,
  onSearch,
}: IProps) {
  const { theme } = useTheme();
  const handleChange: SelectProps['onChange'] = useCallback(
    (value: string | Array<string>) => {
      if (mode === 'multiple' && Array.isArray(value)) {
        if (value.length === 0) return onChange('');

        return onChange(value?.[0]);
      }

      onChange(value as string);
    },
    [onChange, mode]
  );

  const getValue = useMemo((): string | Array<string> | undefined => {
    if (mode === 'multiple' && value) {
      return [value];
    }

    if (!value) {
      return undefined;
    }

    return value;
  }, [value, mode]);

  const getOptions = useCallback(
    (menu: ReactElement<any, string | JSXElementConstructor<any>>) => {
      if (isLoading)
        return (
          <Column width="100%" height="200px" align="center" justify="center">
            <Spin />
          </Column>
        );
      return menu;
    },
    [isLoading]
  );

  const getSearchField = useMemo(() => {
    if (options) {
      const hasSearchBy = options.find((o) => o.searchBy);
      if (hasSearchBy) return 'searchBy';
      return 'label';
    }
  }, [options]);

  return (
    <Container style={{ ...containerStyle, opacity: disabled ? 0.6 : 1 }}>
      <Label>{label}</Label>

      <StyledSelect
        defaultValue={defaultValue}
        loading={isLoading}
        popupClassName="select-popup"
        mode={mode}
        maxTagCount={1}
        disabled={disabled}
        status={error ? 'error' : warning ? 'warning' : undefined}
        optionFilterProp={getSearchField}
        onChange={handleChange}
        placeholder={placeholder}
        value={getValue}
        size="large"
        showSearch={showSearch}
        onSearch={onSearch}
        options={options}
        dropdownRender={getOptions}
        optionRender={(option) => {
          return (
            <Column gap="xxxs">
              <Text variant="body_sm_regular">{option.data.label}</Text>
              <Text variant="caption_regular" color={'#002C52A3'}>
                {option.data.subLabel}
              </Text>
            </Column>
          );
        }}
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
}
