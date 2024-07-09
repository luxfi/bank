import React, { useState } from 'react';
import { Formik } from 'formik';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import InputField from '../../../components/InputField';
import { selectRegistrationBasicInfo, selectRegistrationStatus, setBasicInfo, setPassword, submitRegistrationData } from '../../../features/registration/RegistrationSlice';
import BaseSlide, { StyledForm } from './BaseSlide';
import { passwordSchema } from '../../../features/registration/model/passwordSchema';
import { useNavigate } from 'react-router-dom';
import { SlideProps } from '../helpers/slide-types';
import { SlideButton } from '../components/SlideButton';
import styled from 'styled-components';
import { device } from "../../../utils/media-query-helpers";
import MobileVerificationSlide from './MobileVerificationSlide';
import { setActiveState } from '../../../features/auth/ViewCarouselSlice';
import { openErrorNotification } from '../../../components/Notifications';
import { login } from '../../../features/auth/AuthSlice';
import { NextButton } from '../../../components/Containers';
import { Spinner } from '../../../components/Spinner';
export default function PasswordSlide({ goToSlide }: SlideProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const regData = useAppSelector(selectRegistrationBasicInfo);
    const loading = useAppSelector(selectRegistrationStatus) == 'loading';
    return (
        <>
        <IndividualButton>
            <CircleRegion>
                <button onClick={() => {
                        dispatch(setActiveState({activeState: 0}))
                        goToSlide(MobileVerificationSlide)
                    }} style={{border:'none', borderRadius:'50%', cursor:'pointer', position:"relative", paddingTop:'9px'}}>
                    <img src={`${process.env.PUBLIC_URL}/images/larrow.svg`} alt="Prev" />   
                </button>
            </CircleRegion>
        </IndividualButton>
        <BaseSlide key='password-slide' title='Please create a secure password' sort='padding-top'>
            <Formik
                initialValues={{ password: '', confirmPassword: '' }}
                validationSchema={passwordSchema}
                onSubmit={async (values, formik) => {
                    dispatch(setPassword(values.password));
                    dispatch(setActiveState({activeState: 1}))
                    try {
                        const user = await dispatch(submitRegistrationData()).unwrap();
                        await dispatch(setBasicInfo({
                            firstname: '',
                            lastname: '',
                            email: '',
                        }));
                        navigate('/registration/metadata');
                        // goToSlide(AccountInformationSlide)
                    } catch (err: any) {
                        openErrorNotification('Registration Failed', err.message);
                        formik.setFieldError('country', 'Registration failed, please try again.');
                    }
                    // goToSlide(AccountInformationSlide)
                }}>

                <StyledForm>
                    <Container>
                        <InputField
                            type="password"
                            name="password"
                            labeltext='Your Password' />

                        <InputField
                            type="password"
                            name="confirmPassword"
                            labeltext='Confirm your Password' />
                    </Container>
                    <NextButton>
                        {
                            loading ?
                                <Spinner />
                            :
                                <SlideButton secondary type='submit'>Next</SlideButton>
                        }
                    </NextButton>
                </StyledForm>
            </Formik>
        </BaseSlide>
        </>
    );
}

const Container = styled.div`
    @media(max-width:768px){
        display: flex;
        flex-direction: column;
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
        background-color: ${props=>props.theme.colors.bg};
        padding:0 30px 20px 30px;
    }
    
`
const IndividualButton =styled.div`
    @media ${device.sm} {
        flex-direction: row;
        justify-content: flex-start;
    }
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-top:10px;
    border-radius: 100%;
`

const CircleRegion = styled.div`
 @media (max-width: 768px){
        display: flex;
        transform: translate(50px, 70px);
        justify-content: flex-start;    
    }
    width: 30px;
    height: 30px;
    border-radius: 100%;
    background-color: ${props=>props.theme.colors.bgrey};
`