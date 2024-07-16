import styled from "styled-components";
import { device } from "../../../utils/media-query-helpers";

export const ButtonsRow = styled.div`
@media ${device.sm} {
    flex-direction: row;
    justify-content: flex-start;
}

    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    flex-basis: 100%;
    flex-wrap: wrap;
    justify-content: stretch;
    border-top: 2px solid ${(props) => props.theme.colors.primary};
    margin: 40px 0px;
    padding: 20px 15px;
`;
