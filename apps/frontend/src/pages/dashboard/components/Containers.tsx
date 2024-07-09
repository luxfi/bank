import styled from "styled-components";
import { device } from "../../../utils/media-query-helpers";
export const TopLeftContainer = styled.section`
width: 100%;
display: flex;
justify-content: flex-start;
margin-bottom: 20px;
`;

export const RowGroup = styled.div`
    @media ${device.lg} {
        display: flex;
    }
`;
// Container for edit button in profile Card
export const ButtonContainer = styled.div`
    position: absolute;
    right: 5px;
    top: -2px;
`;
