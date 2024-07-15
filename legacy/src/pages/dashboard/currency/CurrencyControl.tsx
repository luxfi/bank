import CurrencyComplete from "./slides/CurrencyComplete";
import CurrencyConvert from "./slides/CurrencyConvert";
import CurrencyDate from "./slides/CurrencyDate";
import CurrencyQuote from "./slides/CurrencyQuote";

import { Slide } from "../../registration/helpers/slide-types";
import { useGoToSlide } from "../../registration/helpers/use-go-to-slide";
import Layout from "../../../components/Layout";
import { CurrencyStepper } from "./CurrencyStepper";
import styled from "styled-components";
import { Carousel } from "react-responsive-carousel";
import { fadeAnimationHandler } from "../../registration/helpers/animation-helpers";
import DashboardLayout from "../components/DashboardLayout";
import RequireAuth from "../../../features/auth/RequireAuth";
import { UserPaymentRoles } from "../../../features/auth/user-role.enum";
import NavBar, { InverseNavBar } from "../../../components/NavBar";
import { BottomRoundContainer } from "../../../components/Containers";
import { useEffect } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { resetPayment } from "../../../features/accountview/ViewPaymentSlice";
import { setActiveState } from "../../../features/auth/ViewCarouselSlice";


export default function CurrencyControl() {
    const gateway = window.localStorage.getItem('gateway')
    const allowsDateChange = gateway !== 'openpayd';

    const dispatch = useAppDispatch();


    const slides: Slide[] = allowsDateChange ? [
        CurrencyConvert,
        CurrencyDate,
        CurrencyQuote,
        CurrencyComplete,
    ] : [
        CurrencyConvert,
        CurrencyQuote,
        CurrencyComplete,
    ];
    useEffect(() => { 
        return () => {
            dispatch(resetPayment({}));
            dispatch(setActiveState({ activeState: 0 }));
        };
    },[])

    const [selectedSlide, goToSlide] = useGoToSlide(slides);
    return (
        <RequireAuth roles={UserPaymentRoles}>
            <DashboardLayout>
                <InverseNavBar children = {<CurrencyStepper activeStep={selectedSlide} />} />
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
        </RequireAuth>
    );
}
