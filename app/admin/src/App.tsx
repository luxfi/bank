import { useLocation } from "react-router-dom";
import styled from "styled-components";
import AppRoutes from "./AppRoutes";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
    const currentLocation = useLocation();

    return (
        <AppContainer>
            <ScrollToTop />
            {/* <Header currentLocation={currentLocation.pathname} /> */}
            <Container>
                <AppRoutes />
            </Container>
            {/* <Footer /> */}
        </AppContainer>
    );
}

const AppContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${(props) => props.theme.colors.bg};
`;
const Container = styled.div`
    background-color: ${(props) => props.theme.colors.primary};
`;
