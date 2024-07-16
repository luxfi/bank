import styled from "styled-components";
import { device } from "../../../utils/media-query-helpers";

export const HalfWidth = styled.div`
@media ${device.lg} {
    flex: 50%;
    flex-grow: 0;
}

flex: 100%;
padding: 5px 20px;
box-sizing: border-box;
`;
