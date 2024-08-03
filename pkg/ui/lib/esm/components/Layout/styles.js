import styled from 'styled-components';
const Container = styled.div `
  display: flex;
  flex: ${({ $fillContent }) => $fillContent && '1 1 auto'};
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
  justify-content: ${({ $justify }) => $justify};
  align-items: ${({ $align }) => $align};
  flex-direction: ${({ $direction }) => $direction};
  flex-wrap: ${({ $wrap }) => $wrap};
  gap: ${({ $gap, theme }) => ($gap ? theme.gap[$gap]?.value : undefined)};
  row-gap: ${({ $gap, theme }) => ($gap ? theme.gap[$gap]?.value : undefined)};
  column-gap: ${({ $gap, theme }) => ($gap ? theme.gap[$gap]?.value : undefined)};
  grid-row-gap: ${({ $gap, theme }) => ($gap ? theme.gap[$gap]?.value : undefined)};
  grid-column-gap: ${({ $gap, theme }) => ($gap ? theme.gap[$gap]?.value : undefined)};
  padding: ${({ $padding, theme }) => ($padding ? theme.padding[$padding]?.value : undefined)};
  margin: ${({ $margin, theme }) => ($margin ? theme.margin[$margin]?.value : undefined)};
  background-color: ${({ $backgroundColor }) => $backgroundColor};
`;
export default {
    Container,
};
//# sourceMappingURL=styles.js.map