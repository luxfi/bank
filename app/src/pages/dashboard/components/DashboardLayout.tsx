import { PropsWithChildren } from "react";
import styled from "styled-components";
import Layout, { LayoutProps } from "../../../components/Layout";
import { device } from "../../../utils/media-query-helpers";
import Sidebar from "./Sidebar";
import Button from "../../../components/Button";
import { logout } from "../../../features/auth/AuthSlice";
import { useAppDispatch } from "../../../app/hooks";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export default function DashboardLayout({
    children,
    navigationButtons,
}: PropsWithChildren<LayoutProps>) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const defaultButtons = (
        <ButtonContainer>
            <Button
                secondary
                size="long"
                margin="10px"
                onClick={() => navigate("/dashboard/profile/reset-password")}
            >
                Reset Password
            </Button>
            <Button
                secondary
                size="long"
                margin="10px"
                onClick={() => dispatch(logout())}
            >
                Log out
            </Button>
        </ButtonContainer>
    );
    // const navButtons = navigationButtons ? navigationButtons : defaultButtons;
    const navButtons = navigationButtons ? navigationButtons : "";
    return (
        <Layout navigationButtons={navButtons}>
            <Header/>
            <Container>
                <LeftContainer>
                    <Sidebar />
                </LeftContainer>
                <RightContainer>{children}</RightContainer>
            </Container>
            <Footer/>
        </Layout>
    );
}
const ButtonContainer = styled.div`
    @media ${device.sm} {
        display: flex;
        flex-direction: row;
    }
    flex-direction: column;
    display: flex;
`;

const Container = styled.section`
    display: flex;
    flex-direction: column;
    @media ${device.sm} {
        flex-direction: row;
        margin: 20px auto;
        min-height: 80vh;
        padding-inline: 15px;
    }
`;

const LeftContainer = styled.section`
    flex: 1;
    max-width: 250px;
`;

const RightContainer = styled.section`
    @media ${device.xs} {
        padding: 20px;
        border-bottom-left-radius: 15px;
        border-top-right-radius: 0px;
    }
    overflow: auto;
    z-index: 1;
    flex: 3;
    background-color: ${(props) => props.theme.colors.bg};
    box-sizing: border-box;
    padding: 50px;
    margin-bottom: 0px;
    border-top-right-radius: 15px;
    border-bottom-right-radius: 15px;
    border-bottom-left-radius: 0px;
`;
