import styled from 'styled-components';
const Container = styled.div `
  display: flex;
  flex-direction: ${({ $direction }) => $direction || 'column'};
  align-items: ${({ $align }) => $align || 'flex-start'};
  justify-content: ${({ $justify }) => $justify || 'flex-start'};
  flex-wrap: ${({ $wrap }) => $wrap || 'nowrap'};
  gap: ${({ theme, $gap }) => ($gap ? theme.gap[$gap].value : undefined)};
  padding: ${({ theme, $padding }) => ($padding ? theme.padding[$padding].value : theme.padding['sm'].value)};
  margin: ${({ theme, $margin }) => ($margin ? theme.margin[$margin].value : undefined)};
  width: ${({ $width }) => $width || 'fit-content'};
  height: ${({ $height }) => $height || 'fit-content'};
  min-height: ${({ $minHeight }) => $minHeight};
  max-height: ${({ $maxHeight }) => $maxHeight};
  min-width: ${({ $minWidth }) => $minWidth};
  max-width: ${({ $maxWidth }) => $maxWidth};
  border-radius: ${({ theme, $borderRadius }) => $borderRadius ? theme.borderRadius[$borderRadius].value : theme.borderRadius['radius-md'].value};
  border-width: ${({ theme, $borderWidth }) => $borderWidth ? theme.borderWidth[$borderWidth].value : theme.borderWidth['width-zero'].value};
  border-color: ${({ $borderColor }) => $borderColor || undefined};
  border-style: solid;
  overflow: ${({ $overflow }) => $overflow || 'visible'};
  box-sizing: border-box;
  background-color: ${({ theme, $backgroundColor }) => $backgroundColor || theme.backgroundColor.layout['container-L1'].value};
  box-shadow: ${({ theme, $shadow }) => {
    if ($shadow) {
        const { x, y, blur, spread, color } = theme.boxShadow[$shadow].value;
        return `${x}px ${y}px ${blur}px ${spread}px ${color}`;
    }
    return undefined;
}};
`;
export default {
    Container,
};
//# sourceMappingURL=styles.js.map