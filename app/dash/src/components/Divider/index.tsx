import styled from 'styled-components';

interface IDividerProps {
  orientation?: 'horizontal' | 'vertical';
  styles?: React.CSSProperties;
}
export const Divider = ({
  orientation = 'horizontal',
  styles,
}: IDividerProps) => {
  return (
    <>
      <StyledDivider $orientation={orientation} style={styles} />
    </>
  );
};

const StyledDivider = styled.div<{
  $orientation: 'horizontal' | 'vertical';
}>`
  display: flex;
  height: ${(props) => (props.$orientation === 'horizontal' ? '1px' : '100%')};
  width: ${(props) => (props.$orientation === 'horizontal' ? '100%' : '1px')};
  background-color: ${(props) =>
    props.theme.borderColor.layout['divider-subtle'].value};
`;
