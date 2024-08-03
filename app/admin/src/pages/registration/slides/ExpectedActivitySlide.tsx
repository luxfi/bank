import React, { useState }  from "react";
import { Formik } from "formik";
import InputField from "../../../components/InputField";
import BaseSlide, { StyledForm } from "./BaseSlide";
import { SlideProps } from "../helpers/slide-types";
import styled from "styled-components";
import RadioButtonChoiceField from "../../../components/RadioButtonChoiceField";
import { expectedVolumeInitialValues } from "../../../features/registration/model/expectedVolumeInitialValues";
import { expectedVolumeSchema } from "../../../features/registration/model/expectedVolumeSchema";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
    selectRegistrationError,
    selectRegistrationStatus,
    setExpectedVolumeMetadata,
    submitUserMetadata,
} from "../../../features/registration/RegistrationSlice";
import { Spinner } from "../../../components/Spinner";
import { ButtonsContainer } from "../components/ButtonsContainer";
import { SlideButton } from "../components/SlideButton";
import { device } from "../../../utils/media-query-helpers";
import BankInformationSlide from "./BankInformationSlide";
import Tooltip from "../../../components/Tooltip";
import { HalfWidth } from "../../dashboard/components/HalfWidth";
import { setActiveState } from "../../../features/auth/ViewCarouselSlice";
import DocumentsDialogSlide from "./DocumentsDialogSlide";
const expectedVolumes = new Map([
    ["0-25", "0-25"],
    ["26-50", "26-50"],
    ["51+", "51+"],
]);
const expectedValues = new Map([
    ["< £10k", "< £10k"],
    ["£10k - £50k", "£10k - £50k"],
    ["£50k - £100k", "£50k - £100k"],
    ["> £100k", "> £100k"],
]);

export default function ExpectedActivitySlide({ goToSlide }: SlideProps) {
    const dispatch = useAppDispatch();
    const status = useAppSelector(selectRegistrationStatus);
    const errorMessage = useAppSelector(selectRegistrationError);
    return (
        <>
            <IndividualButton>
                <CircleRegion>
                    <button
                        onClick={() => {
                            dispatch(setActiveState({ activeState: 1 }));
                            goToSlide(BankInformationSlide);
                        }}
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

            <BaseSlide title="Expected Activity" sort="expected">
                <Formik
                    initialValues={expectedVolumeInitialValues}
                    validationSchema={expectedVolumeSchema}
                    onSubmit={async (values) => {
                        await dispatch(
                            setExpectedVolumeMetadata({
                                expectedValueOfTurnover:
                                    values.expectedValueOfTurnover,
                                expectedVolumeOfTransactions:
                                    values.expectedVolumeOfTransactions,
                                expectedValueOfTurnoverSelect:
                                    values.expectedValueOfTurnoverSelect
                            })
                        );
                        await dispatch(setActiveState({ activeState: 3 }));
                        await dispatch(submitUserMetadata()).unwrap();
                        goToSlide(DocumentsDialogSlide);
                    }}
                >
                    {({ values, setFieldValue }) => (
                        <StyledForm>
                            <>
                                <NextButton>
                                    <Label>
                                        Let us know what your expected
                                        transactions will be
                                    </Label>
                                </NextButton>
                                <NextButton>
                                    <RadioButtonChoiceField
                                        options={expectedVolumes}
                                        name="expectedVolumeOfTransactions"
                                        labeltext="Approximate volume of transactions (Per Month)"
                                    />
                                    <Tooltip text="description" />
                                </NextButton>
                                <NextButton>
                                    <RadioButtonChoiceField
                                        options={expectedValues}
                                        name="expectedValueOfTurnoverSelect"
                                        labeltext="Approximate value of transactions (expected monthly figure)"
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                            setFieldValue(
                                                "expectedValueOfTurnoverSelect",
                                                e.target.value
                                            );
                                            setFieldValue(
                                                "expectedValueOfTurnover",
                                                e.target.value
                                            );
                                        }}
                                    />
                                    <Tooltip text="Expected Value of Your Turnover" />
                                </NextButton>
                                <HalfWidth>
                                    {values.expectedValueOfTurnoverSelect ===
                                    "> £100k" ? (
                                        <>
                                            <InputField
                                                name="expectedValueOfTurnover"
                                                placeholder=">£100K"
                                                labeltext="Approximate figure if >£100K"
                                            />
                                        </>
                                    ) : null}

                                    {status === "error" ? (
                                        <ErrorText>
                                            {errorMessage}
                                        </ErrorText>
                                    ) : null}
                                </HalfWidth>
                            </>
                            {status === "loading" ? (
                                <Spinner />
                            ) : (
                                <ButtonsContainer>
                                    <SlideButton secondary type="submit">
                                        Next
                                    </SlideButton>
                                </ButtonsContainer>
                            )}
                        </StyledForm>
                    )}
                </Formik>
            </BaseSlide>
        </>
    );
}

const Description = styled.p`
    font-size: 1em;
    font-weight: lighter;
    text-align: left;
    padding: 0px;
    margin: 0px;
    padding-bottom: 40px;
`;

const ErrorText = styled(Description)`
    color: ${(props) => props.theme.colors.danger};
`;

const IndividualButton = styled.div`
    @media ${device.sm} {
        flex-direction: row;
        justify-content: flex-start;
    }
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    border-radius: 100%;
`;
const CircleRegion = styled.div`
    @media (max-width: 768px) {
        display: flex;
        transform: translate(50px, 70px);
        justify-content: flex-start;
    }
    width: 30px;
    height: 30px;
    border-radius: 100%;
    background-color: ${(props) => props.theme.colors.bgrey};
`;
const NextButton = styled.div`
    @media ${device.sm} {
        flex-direction: row;
        justify-content: center;
    }
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    border-radius: 100%;
`;
const Label = styled.label`
    color: ${(props) => props.theme.colors.label};
    display: flex;
    flex-direction: row;
    padding: 3px 10px;
    font-size: 0.8em;
    opacity: 0.5;
    width: 60%;
    justify-content: center;
    margin-top: -30px;
`;
