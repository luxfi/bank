import { useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { BottomRoundContainer } from "../../../components/Containers";
import { InverseNavBar } from "../../../components/NavBar";
import { resetPayment } from "../../../features/accountview/ViewPaymentSlice";
import {
    getActiveState,
    setActiveState,
} from "../../../features/auth/ViewCarouselSlice";
import { loadCurrenciesList } from "../../../features/balances/BalancesListSlice";
import { fadeAnimationHandler } from "../../registration/helpers/animation-helpers";
import { Slide } from "../../registration/helpers/slide-types";
import { useGoToSlide } from "../../registration/helpers/use-go-to-slide";
import DashboardLayout from "../components/DashboardLayout";
import { PaymentStepper } from "./PaymentStepper";
import PaymentComplete from "./slides/PaymentComplete";
import PaymentPayer from "./slides/PaymentPayer";
import PaymentReview from "./slides/PaymentReview";
import SelectCurrency from "./slides/SelectCurrency";
const slides: Slide[] = [
    SelectCurrency,
    PaymentPayer,
    PaymentReview,
    PaymentComplete,
];

export default function PaymentControl() {
    const [selectedSlide, goToSlide] = useGoToSlide(slides);
    let activeState = useAppSelector(getActiveState);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(loadCurrenciesList());
        return () => {
            dispatch(resetPayment({}));
            dispatch(setActiveState({ activeState: 0 }));
        };
    }, []);
    return (
        <DashboardLayout>
            <InverseNavBar
                children={<PaymentStepper activeStep={activeState} />}
            />
            <BottomRoundContainer>
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
            </BottomRoundContainer>
        </DashboardLayout>
    );
}
