import { PropsWithChildren } from "react";
import styled from "styled-components";
import { device } from "../utils/media-query-helpers";

export default function NavBar({ children }: PropsWithChildren<{}>) {
    return (
        <Container>
            <ButtonsContainer>{children}</ButtonsContainer>
        </Container>
    );
}

export function InverseNavBar({ children }: PropsWithChildren<{}>) {
    return (
        <InnerContainer>
            <ButtonsContainer>{children}</ButtonsContainer>
        </InnerContainer>
    );
}

const InnerContainer = styled.section`
    @media ${device.sm} {
        flex-direction: row;
        justify-content: center;
        padding: 20px;
    }
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding-top: 20px;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    background-color: ${(props) => props.theme.colors.primary};
    z-index: 1px;
`;

const Container = styled.section`
    @media ${device.sm} {
        flex-direction: row;
        justify-content: center;
        padding: 20px;
    }
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding-top: 20px;
    color: ${(props) => props.theme.colors.bg};
    z-index: 1px;
`;

const ButtonsContainer = styled.section`
    @media ${device.sm} {
        margin: 0px;
    }
    margin: 30px auto;
    overflow: hidden;
    max-width: 100%;
    box-sizing: border-box;
    width: 60%;
`;
