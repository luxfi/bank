import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { fadeAnimationHandler } from "./helpers/animation-helpers";
import Layout from "../../components/Layout";
import { Slide } from "./helpers/slide-types";
import DocumentsDialogSlide from "./slides/DocumentsDialogSlide";
import DocumentsUploadSlide from "./slides/DocumentsUploadSlide";
import { RegistrationStepper } from "./components/RegistrationStepper";
import { useGoToSlide } from "./helpers/use-go-to-slide";
import { BasicFormContainer, Container } from "../../components/Containers";

const slides: Slide[] = [
    DocumentsDialogSlide,   
    DocumentsUploadSlide,
];

export default function Documents() {
    const [selectedSlide, goToSlide] = useGoToSlide(slides);

    return (
        <Layout navigationButtons={<RegistrationStepper activeStep={3} />}>
            <Container>
                <BasicFormContainer>
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
                        {slides.map(slide => slide({ goToSlide, selectedSlide }))}
                    </Carousel>
                </BasicFormContainer>
            </Container>
        </Layout>
    );
}
