import styled from 'styled-components';
import * as RadixRadioGroup from '@radix-ui/react-radio-group';
const Root = styled(RadixRadioGroup.Root) `
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.gap.xxs.value};
`;
const ItemContainer = styled.div `
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.gap.xxs.value};
`;
const Indicator = styled.div `
  width: ${({ theme }) => theme.width.xxs.value};
  height: ${({ theme }) => theme.height.xxs.value};
  border-radius: ${({ theme }) => theme.borderRadius['radius-full'].value};
  border: none;
`;
const Item = styled(RadixRadioGroup.Item) `
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.padding.xxxs.value};
  border-radius: ${({ theme }) => theme.borderRadius['radius-full'].value};
  background: transparent;
  border-width: ${({ theme }) => theme.borderWidth['width-sm'].value};
  border-style: solid;
  cursor: pointer;

  &[data-state='checked'] {
    border-color: ${({ theme }) => theme.borderColor.interactive.primary.value};
    ${Indicator} {
      background-color: ${({ theme }) => theme.backgroundColor.interactive['primary-default'].value};
    }

    &:hover {
      border-color: ${({ theme }) => theme.borderColor.interactive.primary.value};
      ${Indicator} {
        background-color: ${({ theme }) => theme.backgroundColor.interactive['primary-hover'].value};
      }
    }

    &:disabled {
      border-color: ${({ theme }) => theme.borderColor.interactive.disabled.value};
      background-color: ${({ theme }) => theme.backgroundColor.interactive['primary-disabled'].value};
      ${Indicator} {
        background-color: ${({ theme }) => theme.backgroundColor.interactive['primary-disabled'].value};
      }
    }
  }

  &[data-state='unchecked'] {
    border-color: ${({ theme }) => theme.borderColor.interactive.default.value};

    &:hover {
      border-color: ${({ theme }) => theme.borderColor.interactive.hover.value};
    }

    &:disabled {
      border-color: ${({ theme }) => theme.borderColor.interactive.disabled.value};
    }
  }
`;
export default {
    Root,
    Item,
    ItemContainer,
    Indicator,
};
//# sourceMappingURL=styles.js.map