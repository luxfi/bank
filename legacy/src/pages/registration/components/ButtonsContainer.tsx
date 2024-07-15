import styled from "styled-components";
import { device } from "../../../utils/media-query-helpers";

export const ButtonsContainer = styled.div`
@media ${device.sm} {
    flex-direction: row;
    justify-content: center;
}

display: flex;
flex-direction: column-reverse;
box-sizing: border-box;
justify-content: stretch;
padding: 10px 20px;
align-items: center;
`;
