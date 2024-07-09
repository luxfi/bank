import styled from 'styled-components';

import type { IColumnProps } from './types';

const Container = styled.div<Transient<IColumnProps>>`
  display: flex;
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
  justify-content: ${({ $justify }) => $justify};
  align-items: ${({ $align }) => $align};
  flex-direction: column;
  flex-wrap: ${({ $wrap }) => $wrap};
  gap: ${({ $gap, theme }) => ($gap ? theme.gap[$gap]?.value : undefined)};
  padding: ${({ $padding, theme }) => ($padding ? theme.padding[$padding]?.value : undefined)};
  margin: ${({ $margin, theme }) => ($margin ? theme.margin[$margin]?.value : undefined)};
`;

export default {
  Container,
};
