import styled from "styled-components";
import { device } from "../../../utils/media-query-helpers";

export const PageTitle = styled.h2`
@media ${device.xs} {
    font-size: 1.6em;
    margin-left: 20px;
}

color: ${(props) => props.theme.colors.primary};
font-size: 1.2em;
margin-block-start: 0em;
margin-block-end: 0.83em;
margin-left: 10px;
`;
