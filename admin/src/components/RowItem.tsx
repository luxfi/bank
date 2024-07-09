import { PropsWithChildren } from "react";
import styled from "styled-components";
import { device } from "../utils/media-query-helpers";
interface Props {
    odd?: string;
}
const StyledContainer = styled.div<Props>`
    @media ${device.xs} {
        display: block !important;
    }
    @media ${device.lg}, ${device.sm} {
        display: flex;
        align-items: center;
    }
    padding: 2px 15px;
    background-color: ${(props) =>
        props.odd === "even" ? "#F0F0F0" : "white"};
`;
const Label = styled.div`
    font-weight: bold;
    width: 30%;
    padding: 3px;
    min-width: 200px;
    @media ${device.xs} {
        width: 100%;
    }
`;
const Text = styled.div`
    padding: 3px;
    font-weight: normal;
    @media ${device.xs} {
        width: 100%;
    }
`;
export const Extra = styled.div`
    font-weight: normal;
    padding: 3px;
    margin-left: auto;
    ${device.xs}, ${device.sm} {
        width: 100%;
    }
`
interface ItemProps {
    label?: string;
    text?: string;
    odd?: string;
    hide?: boolean;
}
export const RowItem = ({
    children,
    label,
    text,
    odd,
    hide,
}: PropsWithChildren<ItemProps>) => (
    <StyledContainer odd={odd} style={{ display: hide ? "none" : "flex" }}>
        <Label>{label}</Label>
        <Text>{text}</Text>
        {children}
    </StyledContainer>
);
