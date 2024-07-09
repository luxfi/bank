import styled, { RuleSet, css } from 'styled-components';

import type { IIconProps, TIconSizes } from './types';

const sizes: { [key in TIconSizes]: RuleSet } = {
  xxs: css`
    font-size: ${({ theme }) => theme.height.xs.value};
    line-height: ${({ theme }) => theme.height.xs.value};
  `,
  xs: css`
    font-size: ${({ theme }) => theme.height.sm.value};
    line-height: ${({ theme }) => theme.height.sm.value};
  `,
  sm: css`
    font-size: ${({ theme }) => theme.height.md.value};
    line-height: ${({ theme }) => theme.height.md.value};
  `,
  md: css`
    font-size: ${({ theme }) => theme.height.lg.value};
    line-height: ${({ theme }) => theme.height.lg.value};
  `,
  lg: css`
    font-size: ${({ theme }) => theme.height.xxl.value};
    line-height: ${({ theme }) => theme.height.xxl.value};
  `,
  xl: css`
    font-size: ${({ theme }) => theme.height.xxxl.value};
    line-height: ${({ theme }) => theme.height.xxxl.value};
  `,
  xxl: css`
    font-size: ${({ theme }) => theme.height['24x'].value};
    line-height: ${({ theme }) => theme.height['24x'].value};
  `,
  xxxl: css`
    font-size: ${({ theme }) => theme.height['30x'].value};
    line-height: ${({ theme }) => theme.height['30x'].value};
  `,
};

const Container = styled.span<Transient<IIconProps, 'variant'>>`
  width: fit-content;
  font-family: var(--ds-icons);
  font-weight: 100;
  color: ${(props) => props.$color || props.theme.textColor.layout.primary.value};
  ${(props) => sizes[props.$size || 'md']};
`;

export default {
  Container,
};
