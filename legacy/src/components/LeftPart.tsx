import { device } from "../utils/media-query-helpers";
import styled from "styled-components";

export const LeftPart = styled.div`
    @media ${device.lg} {
        width: 48%;
        float: left;
    }
`;
export const RightPart = styled.div`
    @media ${device.lg} {
        width: 48%;
        float: right;
    }
`;
export const Comment = styled.div`
    border: 1px solid lightgray;
    margin: 0px 15px 15px;
    border-radius: 5px;
    padding: 10px;
    min-height: 175px;
`;

export const ButtonContainer = styled.div`
    position: absolute;
    right: 5px;
    top: -2px;
`;