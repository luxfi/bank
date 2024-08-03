'use client';

import React, { useCallback } from 'react';

import RadioItem from './components/RadioItem';
import Styled from './styles';
import { IRadioGroupProps } from './types';

const RadioGroup: React.FC<IRadioGroupProps> = ({
  onChange,
  options,
  value,
  style,
}) => {
  const RenderOptions = useCallback(() => options.map(RadioItem), [options]);

  return (
    <Styled.Root value={value} onValueChange={onChange} style={style}>
      <RenderOptions />
    </Styled.Root>
  );
};

export default RadioGroup;
