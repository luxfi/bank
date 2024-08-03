import styled from 'styled-components';
import { variants } from './constants';
const Text = styled.p `
  width: fit-content;
  margin: 0;
  padding: 0;
  ${({ $variant }) => variants[$variant]};
  color: ${({ theme, $color }) => $color || theme.textColor.layout.primary.value};
  text-align: ${({ $textAlign }) => $textAlign || 'left'};
`;
const TextLink = styled.a `
  width: fit-content;
  margin: 0;
  padding: 0;
  ${({ $variant }) => variants[$variant]};
  color: ${({ theme, $color }) => $color || theme.textColor.layout.primary.value};
  text-align: ${({ $textAlign }) => $textAlign || 'left'};
`;
export default {
    Text,
    TextLink,
};
//# sourceMappingURL=styles.js.map