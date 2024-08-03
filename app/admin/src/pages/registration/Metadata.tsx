import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { fadeAnimationHandler } from "./helpers/animation-helpers";
import Layout from "../../components/Layout";
import { Slide } from "./helpers/slide-types";
import ExpectedActivitySlide from "./slides/ExpectedActivitySlide";
import { RegistrationStepper } from "./components/RegistrationStepper";
import { useGoToSlide } from "./helpers/use-go-to-slide";
import AdvancedInformationSlide from "./slides/AdvancedInformationSlide";
import AddressInformationSlide from "./slides/AddressInformationSlide";
import IdentyInformationSlide from "./slides/IdentyInformationSlide";
import BankInformationSlide from "./slides/BankInformationSlide";
import DocumentsDialogSlide from "./slides/DocumentsDialogSlide";
import { EntityType } from "../../features/registration/RegistrationSlice";
import DocumentsUploadSlide from "./slides/DocumentsUploadSlide";
import DocumentsEnd from "./slides/DocumentsEnd";
import { getActiveState } from "../../features/auth/ViewCarouselSlice";
import { useAppSelector } from "../../app/hooks";
import CompanyInformationSlide from "./slides/CompanyInformationSlide";
import { selectCurrentUser } from "../../features/auth/AuthSlice";
import { BasicFormContainer, Container } from "../../components/Containers";

let slides: Slide[] = [];
export default function Metadata() {
    const currentUser = useAppSelector(selectCurrentUser);
    currentUser?.currentClient?.account?.entityType === EntityType.Business
        ? (slides = [
              CompanyInformationSlide,
              BankInformationSlide,
              ExpectedActivitySlide,
              DocumentsDialogSlide,
              DocumentsUploadSlide,
              DocumentsEnd,
          ])
        : (slides = [
              AdvancedInformationSlide,
              AddressInformationSlide,
              IdentyInformationSlide,
              BankInformationSlide,
              ExpectedActivitySlide,
              DocumentsDialogSlide,
              DocumentsUploadSlide,
              DocumentsEnd,
          ]);
    const [selectedSlide, goToSlide] = useGoToSlide(slides);
    const activeState = useAppSelector(getActiveState);
    return (
        <Layout
            navigationButtons={<RegistrationStepper activeStep={activeState} />}
        >
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
                        {slides.map((slide) =>
                            slide({ goToSlide, selectedSlide })
                        )}
                    </Carousel>
                </BasicFormContainer>
            </Container>
        </Layout>
    );
}
