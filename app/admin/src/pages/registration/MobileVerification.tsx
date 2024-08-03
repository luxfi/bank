import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import BasicInfoSlide from "./slides/BasicInfoSlide";
import EntityTypeSlide from "./slides/EntityTypeSlide";
import CountrySlide from "./slides/CountrySlide";
import PasswordSlide from "./slides/PasswordSlide";
import styled from "styled-components";
import { fadeAnimationHandler } from "./helpers/animation-helpers";
import MobileVerificationSlide from "./slides/MobileVerificationSlide";
import Layout from "../../components/Layout";
import { Slide } from "./helpers/slide-types";
import { RegistrationStepper } from "./components/RegistrationStepper";
import { useGoToSlide } from "./helpers/use-go-to-slide";
import Constants from "../../Constants";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getActiveState } from "../../features/auth/ViewCarouselSlice";
import Mobile2FASlide from "./slides/Mobile2FASlide";
const slides: Slide[] = [
    Mobile2FASlide
];

export default function MobileVerification() {
    const [selectedSlide, goToSlide] = useGoToSlide(slides);
    const activeState = useAppSelector(getActiveState);
    let FormContainerElement = PasswordFormContainer;
    return (
        <Layout
            navigationButtons={<></>}
        >
            <Container>
                <FormContainerElement>
                    <Carousel
                        selectedItem={selectedSlide}
                        showArrows={false}
                        showIndicators={false}
                        showStatus={false}
                        showThumbs={false}
                        animationHandler={fadeAnimationHandler}
                        transitionTime={500}
                        swipeable={false}
                        useKeyboardArrows={false}
                    >
                        {slides.map((slide, index) =>
                            slide({ goToSlide, selectedSlide })
                        )}
                    </Carousel>
                </FormContainerElement>
                <BottomContainer>
                    <div>
                        <h4 style={{ color: "#FFF" }}>Need help?</h4>
                        <a
                            href={Constants.REGISTRATION_HELP}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                                color: "#FFF",
                                textDecoration: "underline",
                            }}
                        >
                            For details on how to open an account , please refer
                            to our Help Centre here.
                        </a>
                    </div>
                </BottomContainer>
            </Container>
        </Layout>
    );
}
const FormContainer = styled.div`
    @media (max-width: 768px) {
        width: 90vw;
        background-color: ${(props) => props.theme.colors.primary};
        padding: 0px;
    }
    @media (min-width: 992px) {
        width: 30vw;
    }
    width: 58vw;
    border-radius: 15px;
    text-align: center;
    color: ${(props) => props.theme.colors.fg};
    background-color: ${(props) => props.theme.colors.bg};
    padding: 10px 30px;
    z-index: 1;
`;
const BrFormContainer = styled.div`
    @media (max-width: 768px) {
        width: 90vw;
        background-color: ${(props) => props.theme.colors.primary};
        padding: 0px;
    }
    @media (min-width: 992px) {
        width: 37.3vw;
    }
    width: 58vw;
    border-radius: 15px;
    text-align: center;
    color: ${(props) => props.theme.colors.fg};
    background-color: ${(props) => props.theme.colors.bg};
    padding: 10px 30px;
    z-index: 1;
`;

const BasicFormContainer = styled.div`
    @media (max-width: 768px) {
        width: 90vw;
        min-width: 90vw;
        background-color: ${(props) => props.theme.colors.primary};
        padding: 0px;
    }
    @media (min-width: 992px) {
        width: 40vw;
    }
    min-width: 780px;
    width: 50vw;
    border-radius: 15px;
    text-align: center;
    color: ${(props) => props.theme.colors.fg};
    background-color: ${(props) => props.theme.colors.bg};
    padding: 10px 30px;
    z-index: 1;
`;
const PasswordFormContainer = styled.div`
    @media (max-width: 768px) {
        width: 90vw;
        background-color: ${(props) => props.theme.colors.primary};
        padding: 0px;
    }
    @media (min-width: 992px) {
        width: 30vw;
    }
    width: 40%;
    border-radius: 15px;
    text-align: center;
    color: ${(props) => props.theme.colors.fg};
    background-color: ${(props) => props.theme.colors.bg};
    padding: 10px 30px;
    z-index: 1;
`;
const BottomContainer = styled.div`
    width: 50%;
    text-align: center;
    margin: 2% 0 6% 0;
    z-index: 1;
`;
const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 1;
`;
