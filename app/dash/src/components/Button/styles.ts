'use client';

import styled, { css } from 'styled-components';

type TButtonSize = 'small' | 'default' | 'large';

type TType = 'primary' | 'secondary';

interface IProps {
  size?: TButtonSize;
  color?: string;
  $type?: TType;
}

const variant = {
  small: css`
    font-size: ${(props) => props.theme.size['20px']};
    height: ${(props) => props.theme.size['56px']};
    border-radius: ${(props) => props.theme.size['8px']};
  `,

  default: css`
    font-size: ${(props) => props.theme.size['24px']};
    height: ${(props) => props.theme.size['72px']};
    border-radius: ${(props) => props.theme.size['16px']};
  `,

  large: css`
    font-size: ${(props) => props.theme.size['32px']};
    height: ${(props) => props.theme.size['88px']};
    border-radius: ${(props) => props.theme.size['24px']};
  `,
};

export const Button = styled.button<IProps>`
  cursor: pointer;

  border: 1.5px solid ${(props) => props.color};
  min-width: ${(props) => props.theme.size['64px']};
  color: ${(props) =>
    props.$type === 'secondary'
      ? props.theme.colors.black
      : props.theme.colors.background};
  background: ${(props) =>
    props.$type === 'secondary' ? props.theme.colors.background : props.color};
  text-align: center;
  width: 100%;

  ${(props) => (props.size ? variant[props.size] : variant['default'])}

  transition: all 0.3s ease-in-out;

  &:hover,
  &:active {
    opacity: 0.8;
    box-shadow: 2px 2px 3px -2px rgba(0, 0, 0, 0.3);

    border-color: ${(props) => props.color};
    color: ${(props) =>
      props.$type === 'secondary'
        ? props.color
        : props.theme.colors.background};

    /* background: ${(props) =>
      props.$type === 'secondary'
        ? props.theme.colors.gray
        : props.theme.colors.background};

    color: ${(props) => props.color}; */
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;

    &:hover {
      background: ${(props) => props.color};
      color: ${(props) => props.theme.colors.background};
    }
  }
`;
