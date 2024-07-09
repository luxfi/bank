import styled, { css } from 'styled-components';
const variants = {
    primary: css `
    border: none;
    background-color: ${({ theme }) => theme.backgroundColor.interactive['primary-default'].value};
    &:hover {
      background-color: ${({ theme }) => theme.backgroundColor.interactive['primary-hover'].value};
    }
    &:active {
      background-color: ${({ theme }) => theme.backgroundColor.interactive['primary-press'].value};
    }
    &:disabled {
      background-color: ${({ theme }) => theme.backgroundColor.interactive['primary-disabled'].value};
    }
  `,
    secondary: css `
    border-color: ${({ theme }) => theme.borderColor.interactive.primary.value};
    border-style: solid;
    border-width: ${({ theme }) => theme.borderWidth['width-sm'].value};
    background-color: ${({ theme }) => theme.backgroundColor.interactive.transparent.value};
    &:hover {
      background-color: ${({ theme }) => theme.backgroundColor.interactive['secondary-hover'].value};
    }
    &:active {
      background-color: ${({ theme }) => theme.backgroundColor.interactive['secondary-press'].value};
    }
    &:disabled {
      border: none;
      background-color: ${({ theme }) => theme.backgroundColor.interactive['secondary-disabled'].value};
    }
  `,
    tertiary: css `
    border: none;
    background-color: ${({ theme }) => theme.backgroundColor.interactive.transparent.value};
    &:hover {
      background-color: ${({ theme }) => theme.backgroundColor.interactive['tertiary-hover'].value};
    }
    &:disabled {
      background-color: ${({ theme }) => theme.backgroundColor.interactive['tertiary-disabled'].value};
    }
  `,
};
const sizes = {
    default: css `
    padding-top: ${({ theme }) => theme.padding.xs.value};
    padding-bottom: ${({ theme }) => theme.padding.xs.value};
    padding-left: ${({ theme }) => theme.padding.xs.value};
    padding-right: ${({ theme }) => theme.padding.xs.value};
  `,
    small: css `
    padding-top: ${({ theme }) => theme.padding.xxxs.value};
    padding-bottom: ${({ theme }) => theme.padding.xxxs.value};
    padding-left: ${({ theme }) => theme.padding.xxxs.value};
    padding-right: ${({ theme }) => theme.padding.xxxs.value};
  `,
};
const roundness = {
    none: css `
    border-radius: ${({ theme }) => theme.borderRadius['radius-zero'].value};
  `,
    rounded: css `
    border-radius: ${({ theme }) => theme.borderRadius['radius-md'].value};
  `,
    pill: css `
    border-radius: ${({ theme }) => theme.borderRadius['radius-full'].value};
  `,
};
const Container = styled.button `
  all: unset;

  cursor: pointer;

  width: fit-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: background-color 0.3s ease;
  gap: ${({ theme }) => theme.gap.xxs.value};

  ${(props) => variants[props.$variant || 'primary']};
  ${(props) => sizes[props.$size || 'default']};
  ${(props) => roundness[props.$roundness || 'none']};

  p {
    margin: 0px;
  }
`;
export default {
    Container,
};
//# sourceMappingURL=styles.js.map