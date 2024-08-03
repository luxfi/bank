import React from 'react';
import { TIconVariants } from '../Icon/types';
import { Control, FieldValues, Path } from 'react-hook-form';
import { FactoryArg } from 'imask/esm/index';

export type TInputRoundness = 'none' | 'rounded' | 'pill';
export type TType = 'text' | 'search' | 'password';

export interface IInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    | 'type'
    | 'inputMode'
    | 'onChange'
    | 'defaultChecked'
    | 'defaultValue'
    | 'radioGroup'
  > {
  label?: string;
  inputMode?: TType;
  leadingIcon?: TIconVariants;
  trailingIcon?: TIconVariants;
  errorText?: string;
  helperText?: string;
  roundness?: TInputRoundness;
  mask?: FactoryArg;
  defaultValue?: string;
  onChangeText?: (maskedValue: string) => void;
  rawValue?: (value: string) => void;
}

export interface IControlledProps extends IInputProps {
  control: Control<FieldValues>;
  name: Path<FieldValues>;
}
