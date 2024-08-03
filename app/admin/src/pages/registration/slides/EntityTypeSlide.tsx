import React from "react";
import { useAppDispatch } from "../../../app/hooks";
import {
    EntityType,
    setEntityType,
} from "../../../features/registration/RegistrationSlice";
import BaseSlide from "./BaseSlide";
import CountrySlide from "./CountrySlide";
import BasicInfoSlide from "./BasicInfoSlide";
import { SlideProps } from "../helpers/slide-types";
import Button from "../../../components/Button";
import { SlideButton } from "../components/SlideButton";
import styled from "styled-components";
import { device } from "../../../utils/media-query-helpers";
import { setActiveState } from "../../../features/auth/ViewCarouselSlice";
export default function EntityTypeSlide({ goToSlide }: SlideProps) {
    const dispatch = useAppDispatch();
    const [activeBackground, setActiveBackground] = React.useState(false);
    return (
        <>
        <IndividualButton>
            <CircleRegion>
                <button
                    onClick={() => goToSlide(BasicInfoSlide)}
                    style={{
                        border: "none",
                        borderRadius: "50%",
                        cursor: "pointer",
                        position: "relative",
                        paddingTop: "9px",
                    }}
                >
                    <img
                        src={`${process.env.PUBLIC_URL}/images/larrow.svg`}
                        alt="Prev"
                    />
                </button>
            </CircleRegion>
        </IndividualButton>
            <BaseSlide
                key="entity-type-slide"
                title="What type of account would you like to open?"
                sort="entity"
            >
                <RectangleRegion>
                    <CustomButton
                        primary={activeBackground === false}
                        bgrey={activeBackground !== false}
                        onClick={() => {
                            dispatch(
                                setEntityType(EntityType.Individual)
                            );
                            setActiveBackground(false);
                        }}
                    >
                        <UserButton />
                        Individual
                    </CustomButton>
                    <CustomButton
                        primary={activeBackground !== false}
                        bgrey={activeBackground === false}
                        onClick={() => {
                            dispatch(
                                setEntityType(EntityType.Business)
                            );
                            setActiveBackground(true);
                        }}
                    >
                        <BusinessButton />
                        Business
                    </CustomButton>
                </RectangleRegion>
            </BaseSlide>
            <NextButton>
                <SlideButton
                    secondary
                    onClick={() => {
                        dispatch(setActiveState({ activeState: 0 }));
                        dispatch(setEntityType(activeBackground === false ? EntityType.Individual : EntityType.Business));
                        goToSlide(CountrySlide);
                    }}
                >
                    Next
                </SlideButton>
            </NextButton>
        </>
    );
}
const IndividualButton = styled.div`
    @media (max-width: 768px) {
        padding: 0;
        height: 0;
    }
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 20px;
    background-color: ${(props) => props.theme.colors.bg};
`;

const CircleRegion = styled.div`
    @media (max-width: 768px) {
        display: flex;
        transform: translate(50px, 30px);
        justify-content: flex-start;
    }
    width: 30px;
    height: 30px;
    border-radius: 100%;
    background-color: ${(props) => props.theme.colors.bgrey};
`;
const RectangleRegion = styled.div`
    @media ${device.sm} {
        flex: none;
        padding: 0 20px;
    }
    display: flex;
    justify-content: center;
    cursor: pointer;
    height: 150px;
    flex-direction: row;
`;
const NextButton = styled.div`
    @media ${device.sm} {
        flex: none;
        padding: 0 50px 35px 50px;
    }
    @media ${device.lg} {
        /* padding: 0 70px; */
        /* flex: none; */
        display: flex;
        width: 30vw;
        margin: 50px auto 0 auto;
    }
    display: flex;
    justify-content: center;
    cursor: pointer;
    flex-direction: row;
    padding: 0px 25px 25px 20px;
`;
const CustomButton = styled(Button)`
    @media (max-width: 768px) {
        /* width: 150px; */
        border-radius: 20px;
        flex: none;
        width: auto;
    }
    flex: none;
`;
const UserButton = styled.div`
    @media (max-width: 768px) {
        width: 100%;
    }
    height: 60px;
    background: url(${process.env.PUBLIC_URL}/images/user.svg) no-repeat center !important;
    &:hover {
        background: url(${process.env.PUBLIC_URL}/images/userhover.svg)
            no-repeat center !important;
    }
    width: 6vw;
    height: 10vh;
`;
const BusinessButton = styled.div`
    @media (max-width: 768px) {
        width: 100%;
    }
    height: 60px;
    background: url(${process.env.PUBLIC_URL}/images/baghover.svg) no-repeat
        center !important;
    &:hover {
        background: url(${process.env.PUBLIC_URL}/images/bag.svg) no-repeat
            center !important;
    }
    width: 6vw;
    height: 10vh;
`;
