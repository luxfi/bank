import { PropsWithChildren } from "react";
import styled from "styled-components";
import Layout, { LayoutProps } from "../../../components/Layout";
import { device } from "../../../utils/media-query-helpers";
import Sidebar from "./Sidebar";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export default function AdminDashboardLayout({
    children,
    navigationButtons,
}: PropsWithChildren<LayoutProps>) {
    return (
        <>
            <Header />
            <Layout navigationButtons={navigationButtons}>
                <Container>
                    <LeftContainer>
                        <Sidebar />
                    </LeftContainer>
                    <RightContainer>{children}</RightContainer>
                </Container>
            </Layout>
            <Footer/>
        </>
    );
}

const Container = styled.section`
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    margin-bottom: 20px;
    border-radius: 10px;
    padding-inline: 15px;

    @media ${device.sm} {
        flex-direction: row;
    }
`;

const LeftContainer = styled.section`
    flex: 1;
    max-width: 250px;
`;

const RightContainer = styled.section`
    flex: 3;
    background-color: ${(props) => props.theme.colors.bg};
    box-sizing: border-box;
    padding: 10px 50px;
    overflow: auto;
    border-radius: 0 10px 10px 0;
    @media (max-width: 480px) {
        padding: 10px 10px;
    }
`;
