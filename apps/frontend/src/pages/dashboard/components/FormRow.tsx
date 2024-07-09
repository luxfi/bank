import styled from "styled-components";
import { device } from "../../../utils/media-query-helpers";

export const FormRow = styled.div`
    @media ${device.lg} {
        flex-direction: row;
        justify-content: flex-start;
    }

    display: flex;
    flex-direction: column;
    flex-basis: 100%;
    flex-wrap: wrap;
`;
