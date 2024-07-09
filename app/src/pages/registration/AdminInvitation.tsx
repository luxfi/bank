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
import BaseSlide, { StyledForm } from "./slides/BaseSlide";
import { Formik } from "formik";
import { passwordSchema } from "../../features/registration/model/passwordSchema";
import InputField from "../../components/InputField";
import { NextButton, NextButtonWhite } from "../../components/Containers";
import { Spinner } from "../../components/Spinner";
import { SlideButton } from "./components/SlideButton";
import { submitInvitationFromAdmin } from "../../features/registration/RegistrationSlice";
import { useQuery } from "../../utils/use-query";
import { useState } from "react";
import { openErrorNotification } from "../../components/Notifications";
import { login } from "../../features/auth/AuthSlice";
import { useNavigate } from "react-router-dom";

export default function AdminInvitation() {
    const FormContainerElement = PasswordFormContainer;
    const [loading, setLoading] = useState(false);
    const query = useQuery();
    const invitation = query.get("invitation") || '';
    const code = query.get("code") || '';
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    return (
        <Layout>
            <Container>
                <FormContainerElement>
                    <BaseSlide key='password-slide' title='Please create a secure password' sort='entity'>
                        <Formik
                            initialValues={{ password: '', confirmPassword: '' }}
                            validationSchema={passwordSchema}
                            onSubmit={async (values, formik) => {
                                // console.log(values);
                                // navigate('/registration/metadata');
                                setLoading(true);
                                dispatch(submitInvitationFromAdmin({
                                    password: values.password,
                                    confirmPassword: values.confirmPassword,
                                    invitation,
                                    code
                                })).unwrap().then((user) => {
                                    setLoading(false);
                                    // console.log(user);
                                    dispatch(login({username: user.username, password: values.password})).unwrap().then((user) => {
                                        // console.log(user);
                                        navigate('/dashboard');
                                    }).catch((error) => {
                                        openErrorNotification('Login Failed', 'Something went wrong while log in.')
                                    });

                                }).catch((error) => {
                                    setLoading(false);
                                    openErrorNotification('Admin Invitation', error.message)
                                    // console.log(error);
                                });
                            }}>
                            <StyledForm>
                                <Container>
                                    <InputField
                                        type="password"
                                        name="password"
                                        labeltext='Your Password'
                                        containerStyle={{width: '100%'}}
                                    />

                                    <InputField
                                        type="password"
                                        name="confirmPassword"
                                        labeltext='Confirm your Password' 
                                        containerStyle={{width: '100%'}}
                                    />
                                </Container>
                                <NextButtonWhite>
                                    {
                                        loading ?
                                            <Spinner />
                                        :
                                            <SlideButton secondary type='submit'>Next</SlideButton>
                                    }
                                </NextButtonWhite>
                            </StyledForm>
                        </Formik>
                    </BaseSlide>
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
    margin-top: 50px;
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
