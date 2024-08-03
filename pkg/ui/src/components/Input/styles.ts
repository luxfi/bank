import styled, { ExecutionContext, css } from 'styled-components';
import type { IInputProps } from './types';

const getPaddingLeft = ({ theme, $roundness, $leadingIcon }: ExecutionContext & Transient<IInputProps>) => {
  if ($leadingIcon) return `${theme.padding.xxxl.value}`;
  if ($roundness === 'pill') return `${theme.padding.sm.value}`;
  return `${theme.padding.xs.value}`;
};

const getPaddingRight = ({
  theme,
  $roundness,
  $inputMode,
  $trailingIcon,
}: ExecutionContext & Transient<IInputProps>) => {
  if ($trailingIcon) return `${$inputMode === 'search' ? '84px' : theme.padding.xxxl.value}`;
  if ($inputMode === 'search') return `${theme.padding.xxxl.value}`;
  if ($roundness === 'pill') return `${theme.padding.sm.value}`;
  return `${theme.padding.xs.value}`;
};

const roundness = ({ theme, $roundness }: ExecutionContext & Transient<IInputProps>) => {
  if ($roundness === 'pill') return theme.borderRadius['radius-full'].value;
  if ($roundness === 'rounded') return theme.borderRadius['radius-md'].value;
  return theme.borderRadius['radius-zero'].value;
};

const Input = styled.input<Transient<IInputProps>>`
  box-sizing: border-box;
  height: ${({ theme }) => theme.height.xl.value};
  width: 100%;
  font-family: ${({ theme }) => `var(--${theme.typography.body.md_regular.value.fontFamily})`};
  font-size: ${({ theme }) => theme.typography.body.md_regular.value.fontSize};
  color: ${({ theme }) => theme.textColor.interactive.enabled.value};
  border-style: solid;
  border-width: ${({ theme }) => theme.borderWidth['width-sm'].value};
  border-color: ${({ theme, $errorText }) =>
    $errorText ? theme.borderColor.feedback.negative.value : theme.borderColor.interactive.default.value};
  border-radius: ${roundness};
  padding-left: ${getPaddingLeft};
  padding-right: ${getPaddingRight};
  transition:
    outline-color 0.3s ease-in-out,
    border-color 0.1s ease-in-out;

  &::placeholder {
    color: ${({ theme }) => theme.textColor.interactive.placeholder.value};
  }

  &:disabled {
    cursor: not-allowed;
    color: ${({ theme }) => theme.textColor.interactive.disabled.value};
    &::placeholder {
      color: ${({ theme }) => theme.textColor.interactive.disabled.value};
    }
  }

  &:read-only {
    cursor: default;
    outline: none;
  }

  &&:focus {
    outline-style: solid;
    outline-width: ${({ theme }) => theme.borderWidth['width-sm'].value};
    outline-color: ${({ theme, $errorText }) =>
      theme.borderColor.interactive[$errorText ? 'focus-negative' : 'focus-default'].value};
    border-color: ${({ theme, $errorText }) =>
      theme.borderColor.interactive[$errorText ? 'focus-negative' : 'focus-default'].value};
  }

  &[type='search']::-webkit-search-cancel-button {
    -webkit-appearance: none;
    position: absolute;
    height: 20px;
    width: 20px;
    right: ${({ theme, $trailingIcon }) => ($trailingIcon ? theme.padding.xxxl.value : theme.padding.xs.value)};
    cursor: pointer;
    /* url background icon converted to base64 (https://www.base64encode.org/) */
    background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwcHgiIGhlaWdodD0iODAwcHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxjaXJjbGUgb3BhY2l0eT0iMC41IiBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIHN0cm9rZT0iIzBiMTkzNiIgc3Ryb2tlLXdpZHRoPSIxLjUiIC8+CiAgICA8cGF0aCBkPSJNMTQuNSA5LjUwMDAyTDkuNSAxNC41TTkuNDk5OTggOS41TDE0LjUgMTQuNSIgc3Ryb2tlPSIjMGIxOTM2IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiAvPgo8L3N2Zz4=');
    background-size: contain;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.gap.xxxs.value};
  width: 100%;
`;

const IconWrapper = styled.div<{ $leading?: boolean; $inputMode?: string }>`
  position: absolute;
  display: flex;
  align-items: center;
  bottom: ${({ theme }) => theme.padding.xxs.value};
  cursor: default;

  ${({ theme, $leading, $inputMode }) =>
    $leading
      ? css`
          left: ${theme.padding.xs.value};
        `
      : css`
          right: ${theme.padding.xs.value};
          cursor: ${$inputMode === 'password' ? 'pointer' : 'default'};
        `};
`;

const InputWrapper = styled.div`
  position: relative;
`;

export default { Input, Container, IconWrapper, InputWrapper };
