import styled from 'styled-components';

import { variants } from './constants';

import type { ITextProps } from './types';

const Text = styled.p<Transient<ITextProps, 'children' | 'href' | 'target'>>`
  width: fit-content;
  margin: 0;
  padding: 0;
  ${({ $variant }) => variants[$variant!]};
  color: ${({ theme, $color }) => $color || theme.textColor.layout.primary.value};
  text-align: ${({ $textAlign }) => $textAlign || 'left'};
`;

const TextLink = styled.a<Transient<ITextProps, 'children' | 'href' | 'target'>>`
  width: fit-content;
  margin: 0;
  padding: 0;
  ${({ $variant }) => variants[$variant!]};
  color: ${({ theme, $color }) => $color || theme.textColor.layout.primary.value};
  text-align: ${({ $textAlign }) => $textAlign || 'left'};
`;

export default {
  Text,
  TextLink,
};
