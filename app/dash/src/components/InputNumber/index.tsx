'use client';

import React, { useRef, CSSProperties } from 'react';
import { Select, SelectProps } from 'antd';
import type { RefSelectProps } from 'antd/lib/select'; // This is usually the correct type import for 'antd' Select refs

type SelectValue = string | number | Array<string | number>;

interface IProps extends SelectProps<SelectValue> {
  label: string;
  containerStyle?: CSSProperties;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  onChange: (value: SelectValue, option: any) => void;
}

const SelectComponent: React.FC<IProps> = ({
  label,
  onChange,
  value,
  disabled,
  containerStyle,
  placeholder,
  error,
  mode, // Ensure mode is part of the props
  ...rest
}) => {
  const selectRef = useRef<RefSelectProps>(null); // Corrected to use RefSelectProps for proper type support

  const handleChange = (value: SelectValue, option: any) => {
    onChange(value, option);
  };

  return (
    <div style={containerStyle}>
      <label>{label}</label>
      <Select
        ref={selectRef} // Using the correct ref type
        mode={mode} // Use mode prop to allow 'multiple' or 'tags' if needed
        {...rest}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={handleChange}
        status={error ? 'error' : undefined}
      />
      {error && <div>{error}</div>}
    </div>
  );
};

export default SelectComponent;
