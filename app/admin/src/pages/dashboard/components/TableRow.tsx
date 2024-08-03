import styled from "styled-components";
interface Props {
    index?: number;
    key?: any;
  }
export const TableRow = styled.tr<Props>`
    background-color: ${(props) =>
        props.index && props.index % 2 == 1 ? "#F0F0F0" : "white"};
`;
