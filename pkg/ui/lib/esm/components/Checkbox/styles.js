import styled from 'styled-components';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import Icon from '../Icon';
const Container = styled.div `
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0;
  padding: 0;
  gap: ${({ theme }) => theme.gap.xxs.value};
  cursor: pointer;

  p {
    margin: 0;
  }
`;
const CheckboxContainer = styled(RadixCheckbox.Root) `
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;

  width: ${({ theme }) => theme.width.sm.value};
  height: ${({ theme }) => theme.height.sm.value};
  border-radius: ${({ theme }) => theme.borderRadius['radius-sm'].value};
  border-style: solid;
  background-color: ${({ checked, theme }) => checked ? theme.backgroundColor.interactive['primary-default'].value : 'transparent'};
  border-width: ${({ theme, checked }) => checked ? theme.borderWidth['width-zero'].value : theme.borderWidth['width-sm'].value};
  border-color: ${({ theme }) => theme.borderColor.interactive.default.value};
  box-sizing: border-box;
  justify-content: center;
  align-items: center;

  &[data-state='checked'] {
    &:hover {
      background-color: ${({ theme }) => theme.backgroundColor.interactive['primary-hover'].value};
    }
    &:disabled {
      background-color: ${({ theme }) => theme.backgroundColor.interactive['primary-disabled'].value};
    }
  }

  &[data-state='unchecked'] {
    &:hover {
      border-color: ${({ theme }) => theme.borderColor.interactive['hover'].value};
    }
    &:disabled {
      border-color: ${({ theme }) => theme.borderColor.interactive['disabled'].value};
    }
  }

  &${Icon.prototype} {
    padding: 0;
    font-family: var(--ds-icons);
  }
`;
export default {
    Container,
    CheckboxContainer,
};
//# sourceMappingURL=styles.js.map