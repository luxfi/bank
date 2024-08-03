import styled, { css } from 'styled-components';
import Icon from '../Icon';
import type { RuleSet } from 'styled-components';
import type { IMultiSelectProps, TMultiSelectRoundness } from './types';

const roundness: { [key in TMultiSelectRoundness]: RuleSet<object> } = {
  none: css`
    border-radius: ${({ theme }) => theme.borderRadius['radius-zero'].value};
  `,
  rounded: css`
    border-radius: ${({ theme }) => theme.borderRadius['radius-md'].value};
  `,
  pill: css`
    border-radius: ${({ theme }) => theme.borderRadius['radius-full'].value};
  `,
};

const roundnessContent: { [key in TMultiSelectRoundness]: RuleSet<object> } = {
  none: css`
    border-radius: ${({ theme }) => theme.borderRadius['radius-zero'].value};
  `,
  rounded: css`
    border-radius: ${({ theme }) => theme.borderRadius['radius-md'].value};
  `,
  pill: css`
    border-radius: ${({ theme }) => theme.borderRadius['radius-md'].value};
  `,
};

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.gap.xxxs.value};
  width: 100%;
`;

const ButtonSelect = styled.button<Transient<IMultiSelectProps>>`
  --button-color: ${({ theme }) => theme.textColor.interactive.enabled.value};
  --button-borderColor: ${({ theme, $errorText }) =>
    $errorText ? theme.borderColor.feedback.negative.value : theme.borderColor.interactive.default.value};
  --button-backgroundColor: transparent;

  display: grid;
  grid-template-columns: auto max-content;
  align-items: center;
  gap: ${({ theme }) => theme.gap.xxxs.value};
  width: 100%;

  border-radius: ${({ theme }) => theme.borderRadius['radius-zero'].value};
  padding: ${({ theme }) => `${theme.padding.xxs.value} ${theme.padding.xs.value}`};
  background-color: var(--button-backgroundColor);
  color: var(--button-color);
  border: solid ${({ theme }) => theme.borderWidth['width-sm'].value} var(--button-borderColor);
  width: 100%;
  cursor: pointer;
  outline: none;
  pointer-events: ${({ $disabled }) => $disabled && 'none'};

  ${({ $roundness }) => roundness[$roundness || 'none']};

  p {
    width: auto;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: var(--button-color);
  }

  span {
    color: var(--button-color);
  }

  &&${Icon.prototype} {
    font-family: var(--ds-icons);
  }

  &[disabled] {
    --button-color: ${({ theme }) => theme.textColor.interactive.disabled.value};
    --button-borderColor: ${({ theme }) => theme.borderColor.interactive.disabled.value};
    --button-backgroundColor: ${({ theme }) => theme.backgroundColor.interactive['surface-disabled'].value};
  }

  &:focus {
    --trigger-borderColor: ${({ theme }) => theme.borderColor.interactive['focus-default'].value};
  }
`;

const DropContainer = styled.div<Transient<IMultiSelectProps>>`
  background-color: ${({ theme }) => theme.backgroundColor.layout['container-L1'].value};
  border: solid
    ${({ theme }) => `${theme.borderWidth['width-sm'].value} ${theme.borderColor.interactive.default.value}`};
  box-shadow: ${({ theme }) => {
    const { x, y, blur, spread, color } = theme.boxShadow['level-1'].value;
    return `${x}px ${y}px ${blur}px ${spread}px ${color}`;
  }};
  z-index: 1000;

  ${({ $roundness }) => roundnessContent[$roundness || 'none']}
`;

const DropButtonsWrap = styled.div`
  position: absolute;
  bottom: 0;
  background-color: ${({ theme }) => theme.backgroundColor.layout['container-L1'].value};
  width: 100%;
  border-top: solid
    ${({ theme }) => `${theme.borderWidth['width-sm'].value} ${theme.borderColor.interactive.default.value}`};
`;

const DropButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.gap.xs.value};
  padding: ${({ theme }) => `${theme.padding.xxs.value} ${theme.padding.sm.value}`};
`;

const ListContainer = styled.ul`
  --limit-show-items-5: calc(${({ theme }) => theme.height['60x'].value} - ${({ theme }) => theme.height.sm.value});
  --limit-space-item: calc(${({ theme }) => theme.padding.xxxl.value} + 6px);

  max-height: var(--limit-show-items-5);
  padding: ${({ theme }) => `${theme.padding.zero.value}`};
  padding-bottom: var(--limit-space-item);
  margin: ${({ theme }) => theme.margin.zero.value};
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  list-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ListItem = styled.li`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: ${({ theme }) => theme.gap.sm.value};
  padding: ${({ theme }) => theme.padding.xs.value};
  cursor: pointer;

  p {
    width: auto;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  &:hover {
    color: ${({ theme }) => theme.textColor.layout.secondary.value};
    background-color: ${({ theme }) => theme.backgroundColor.interactive['surface-hover'].value};
  }
`;

const ErrorHelperContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  padding-left: ${({ theme }) => theme.padding.xs.value};
`;

export default {
  Container,
  ButtonSelect,
  DropButtonsWrap,
  DropButtonsContainer,
  DropContainer,
  ListContainer,
  ListItem,
  ErrorHelperContainer,
};
