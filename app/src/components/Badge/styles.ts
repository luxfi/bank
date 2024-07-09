import { ITheme } from '@cdaxfx/ui';
import styled from 'styled-components';

import { IBadge } from '.';

export const getColors = (variant: IBadge['variant'], theme: ITheme) => {
  const border = {
    positive: `1px solid ${theme.borderColor.feedback.positive.value}`,
    negative: `1px solid ${theme.borderColor.feedback.negative.value}`,
    warning: `1px solid ${theme.borderColor.feedback.warning.value}`,
    info: `1px solid ${theme.borderColor.feedback.info.value}`,
    neutral: `1px solid ${theme.borderColor.feedback.info.value}`,
  }[variant];

  const bg = {
    positive: `${theme.backgroundColor.feedback.positive.value}`,
    negative: `${theme.backgroundColor.feedback.negative.value}`,
    warning: `${theme.backgroundColor.feedback.warning.value}`,
    info: `${theme.backgroundColor.feedback.info.value}`,
    neutral: `1px solid ${theme.borderColor.feedback.info.value}`,
  }[variant];

  const font = {
    positive: `${theme.textColor.feedback['text-positive'].value}`,
    negative: `${theme.textColor.feedback['text-negative'].value}`,
    warning: `${theme.textColor.feedback['text-warning'].value}`,
    info: `${theme.textColor.feedback['text-info'].value}`,
    neutral: `1px solid ${theme.borderColor.feedback.info.value}`,
  }[variant];

  const dot = {
    positive: `${theme.backgroundColor.feedback.positiveAccent.value}`,
    negative: `${theme.backgroundColor.feedback.negativeAccent.value}`,
    warning: `${theme.backgroundColor.feedback.warningAccent.value}`,
    info: `${theme.backgroundColor.feedback.infoAccent.value}`,
    neutral: `1px solid ${theme.borderColor.feedback.info.value}`,
  }[variant];

  return {
    border,
    bg,
    font,
    dot,
  };
};

export const Container = styled.div<{
  $type?: IBadge['type'];
  $variant: IBadge['variant'];
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.padding.xxs.value};
  background-color: transparent;
  border: ${({ theme, $type, $variant }) =>
    $type === 'tag' && `${getColors($variant, theme).border}`};
  background-color: ${({ theme, $type, $variant }) =>
    $type === 'tag' && getColors($variant, theme).bg};
  width: fit-content;
  padding-inline: ${({ theme }) => theme.padding.xxs.value};
  padding-block: ${({ theme }) => theme.padding.xxxs.value};
  border-radius: ${({ theme }) => theme.borderRadius['radius-md'].value};

  .dot {
    height: 8px;
    width: 8px;
    border-radius: ${({ theme }) => theme.borderRadius['radius-full'].value};
    background-color: ${({ theme, $variant }) =>
      getColors($variant, theme).dot};
  }
`;
