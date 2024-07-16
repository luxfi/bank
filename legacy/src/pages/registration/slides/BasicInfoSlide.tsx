import { Formik } from "formik";
import { useEffect } from "react";
import styled from "styled-components";
import { useAppDispatch } from "../../../app/hooks";
import InputField from "../../../components/InputField";
import { Spinner } from "../../../components/Spinner";
import { basicInfoSchema } from "../../../features/registration/model/basicInfoSchema";
import {
    setBasicInfo,
    setInvitationInfo,
} from "../../../features/registration/RegistrationSlice";
import { useQuery } from "../../../utils/use-query";
import { SlideButton } from "../components/SlideButton";
import { SlideProps } from "../helpers/slide-types";
import { useBasicInfo } from "../helpers/use-basic-info";
import BaseSlide, { StyledForm } from "./BaseSlide";
import CountrySlide from "./CountrySlide";
import EntityTypeSlide from "./EntityTypeSlide";
import CheckboxField from "../../../components/CheckboxField";
import { setActiveState } from "../../../features/auth/ViewCarouselSlice";
import { NextButton } from "../../../components/Containers";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
export default function BasicInfoSlide({ goToSlide }: SlideProps) {
    const dispatch = useAppDispatch();
    const query = useQuery();
    const invitationUuid = query.get("invitation");
    const invitationCode = query.get("code");
    const { error, loading, basicInfo } = useBasicInfo();
    const initialValues = { ...basicInfo, recaptcha: "" };
    const { executeRecaptcha } = useGoogleReCaptcha();
    useEffect(() => {
        if (invitationUuid && invitationCode) {
            dispatch(
                setInvitationInfo({
                    uuid: invitationUuid,
                    code: invitationCode,
                })
            );
        }
    }, [invitationCode, invitationUuid]);

    if (loading) {
        return (
            <BaseSlide key="email-slide">
                <Spinner size="large" />
            </BaseSlide>
        );
    }

    if (error) {
        return (
            <BaseSlide key="email-slide">
                <ErrorText>Invitation error: {error}</ErrorText>
            </BaseSlide>
        );
    }

    return (
        <BaseSlide key="email-slide" sort="padding-top">
            <Formik
                enableReinitialize={true}
                initialValues={initialValues}
                validationSchema={basicInfoSchema}
                validateOnChange={false}
                onSubmit={async (values) => {
                    if (executeRecaptcha) {
                        await executeRecaptcha();
                    }
                    dispatch(setBasicInfo(values));
                    dispatch(setActiveState({ activeState: 0 }));
                    if (invitationUuid) {
                        goToSlide(CountrySlide);
                    } else {
                        goToSlide(EntityTypeSlide);
                    }
                }}
            >
                    <StyledForm>
                        <Container>
                            <InputField
                                name="firstname"
                                labeltext="First name"
                                placeholder="John"
                            />
                            <InputField
                                name="lastname"
                                labeltext="Last name"
                                placeholder="Smith"
                            />
                            <InputField
                                name="email"
                                labeltext="Email Address"
                                placeholder="email@example.com"
                            />
                            <CheckContainer>
                                <CheckboxField
                                    name="recaptcha"
                                    labeltext="I am not a robot"
                                />
                            </CheckContainer>
                        </Container>
                        <NextButton>
                            <SlideButton secondary type="submit">
                                Next
                            </SlideButton>
                        </NextButton>
                </StyledForm>
            </Formik>
        </BaseSlide>
    );
}
const Container = styled.div`
    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
        background-color: ${(props) => props.theme.colors.bg};
        padding: 0 10px 20px 10px;
    }
`;
const CheckContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    padding: 10px auto;
    border: 1px solid ${(props) => props.theme.colors.bgrey};
`;
const ErrorText = styled.span`
    color: ${(props) => props.theme.colors.danger};
    padding: 3px 10px;
    font-size: 0.8em;
`;
