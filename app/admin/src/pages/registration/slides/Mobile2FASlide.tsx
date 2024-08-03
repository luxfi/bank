import React, { useState, KeyboardEvent, useEffect } from 'react';
import { Formik, FormikHelpers } from 'formik';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import * as RegistrationApi from '../../../features/registration/RegistrationApi';
import { selectRegistrationCountry, selectRegistrationMobileCode, selectRegistrationMobileNumber,  setMobileBasisData, setMobileData, setMobileNumberData } from '../../../features/registration/RegistrationSlice';
import { SlideButton } from '../components/SlideButton';
import { SlideProps } from '../helpers/slide-types';
import BaseSlide, { StyledForm } from './BaseSlide';
import CountrySlide from './CountrySlide';
import PasswordSlide from './PasswordSlide';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import InputFieldsSharedStyles from '../../../components/styles/input-fields-shared-styles';
import { device } from "../../../utils/media-query-helpers";
import { setActiveState } from '../../../features/auth/ViewCarouselSlice';
import { NextButton } from '../../../components/Containers';
import { Spinner } from '../../../components/Spinner';
import { useNavigate } from 'react-router-dom';
import { login2FA } from '../../../features/auth/AuthSlice';

export default function Mobile2FASlide(props:any) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [sent, setSent] = useState(true);
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(false);
    const [toggleRetry, setToggleRetry] = useState(false);
    const country = useAppSelector(selectRegistrationCountry);
    const mobileNumber = useAppSelector(selectRegistrationMobileNumber);
    const mobileCode = useAppSelector(selectRegistrationMobileCode);
    
    let inputRef0 = React.useRef<HTMLInputElement>(null);
    const inputRef1 = React.useRef<HTMLInputElement>(null);
    const inputRef2 = React.useRef<HTMLInputElement>(null);
    const inputRef3 = React.useRef<HTMLInputElement>(null);
    const inputRef4 = React.useRef<HTMLInputElement>(null);
    const inputRef5 = React.useRef<HTMLInputElement>(null);
    const inputRef6 = React.useRef<HTMLButtonElement>(null);
    useEffect(() => {
        if(inputRef0.current) {
            inputRef0.current.focus();
        }
    }, [inputRef0]);
    const verify = React.useCallback(async (
        values: RegistrationApi.VerificationDto,
        formik: FormikHelpers<any>
    ) => {
        setLoading(true);
        const verified = await RegistrationApi.verifyMobile(values);
        setLoading(false);
        if (!verified) {
            formik.setFieldError('mobileNumber', 'Couldn\'t verify the mobile number, please try again.');
            return;
        }
        
        if(!mobileCode){
            dispatch(setMobileBasisData({
                mobileNumber: values.mobileNumber,
                code1: '',
                code2: '',
                code3: '',
                code4: '',
                code5: '',
                code6: ''
            }))
        }
        setSent(true);
        setToggleRetry(!toggleRetry);
        dispatch(setMobileNumberData(values));
        dispatch(setActiveState({activeState: 0}))
    }, [toggleRetry]);

    const checkVerification = async (
        values: RegistrationApi.CheckVerificationBasisDto,
        formik: FormikHelpers<any>
    ) => {
        setChecking(true);
        const code = String(inputRef0.current?.value?inputRef0.current?.value: 0) + String(inputRef1.current?.value?inputRef1.current?.value: 0) + String(inputRef2.current?.value?inputRef2.current?.value:0) + String(inputRef3.current?.value?inputRef3.current?.value:0) + String(inputRef4.current?.value?inputRef4.current?.value: 0) + String(inputRef5.current?.value?inputRef5.current?.value:0);
        const verified = await dispatch(login2FA({
            verificationCode: code
        })).unwrap();
        setChecking(false);
        if (typeof verified == 'string') {
            formik.setValues({
                code1: '',
                code2: '',
                code3: '',
                code4: '',
                code5: '',
                code6: '',
            }, false);
            formik.setTouched({ mobileNumber: true }, false);
            formik.setErrors({
                mobileNumber: verified,
            });
            return;
        }
        props.onSuccess();
        return;
    };

    const handleKeyPress1 = (e:KeyboardEvent<HTMLInputElement>)=>{
        if (e.key === 'Backspace') return;
        inputRef1.current?.focus();
    }
    const handleKeyPress2 = (e:KeyboardEvent<HTMLInputElement>)=>{
        if (e.key === 'Backspace') {
            inputRef0.current?.focus();
            return;
        }
        inputRef2.current?.focus();
    }
    const handleKeyPress3 = (e:KeyboardEvent<HTMLInputElement>)=>{
        if (e.key === 'Backspace') {
            inputRef1.current?.focus();
            return;
        }
        inputRef3.current?.focus();
    }
    const handleKeyPress4 = (e:KeyboardEvent<HTMLInputElement>)=>{
        if (e.key === 'Backspace') {
            inputRef2.current?.focus();
            return;
        }
        inputRef4.current?.focus();
    }
    const handleKeyPress5 = (e:KeyboardEvent<HTMLInputElement>)=>{
        if (e.key === 'Backspace') {
            inputRef3.current?.focus();
            return;
        }
        inputRef5.current?.focus();
    }
    const handleKeyPress6 = (e:KeyboardEvent<HTMLInputElement>)=>{
        if (e.key === 'Backspace') {
            inputRef4.current?.focus();
            return;
        }
        inputRef6.current?.focus();
    }
    return (
        <>
               {
                sent ?
                    <Formik
                    key="check"
                    initialValues={
                        {
                            mobileNumber:'', 
                            // code: '', 
                            code1: '', 
                            code2: '', 
                            code3: '', 
                            code4: '', 
                            code5: '', 
                            code6: '' 
                        }
                    }
                    // validationSchema={RegistrationApi.checkVerificationBasisSchema}
                    onSubmit={checkVerification}>
                        {({ values, setFieldValue, errors, touched }) => (
                    <StyledForm>
                        <Container style={{fontSize: 12, margin: 10}}>
                            For security we have sent an SMS code to sign-in, please enter the code below and click Verify:
                        </Container>
                        <Container>
                            <div className='row'>
                                <div className='col-sm-3'>
                                    <Boxstyle className="form-group">
                                        <input autoComplete='off' className='form-control' style={{ width: '40px', height: '40px', margin: '1%', fontSize: '30px', textAlign: 'center' }} name='code1' maxLength={1} onKeyUp={handleKeyPress1} autoFocus ref={inputRef0} />
                                        <input autoComplete='off' className='form-control' style={{ width: '40px', height: '40px', margin: '1%', fontSize: '30px', textAlign: 'center' }} name='code2' maxLength={1} onKeyUp={handleKeyPress2} ref={inputRef1} />
                                        <input autoComplete='off' className='form-control' style={{ width: '40px', height: '40px', margin: '1%', fontSize: '30px', textAlign: 'center' }} name='code3' maxLength={1} onKeyUp={handleKeyPress3} ref={inputRef2} />
                                        <input autoComplete='off' className='form-control' style={{ width: '40px', height: '40px', margin: '1%', fontSize: '30px', textAlign: 'center' }} name='code4' maxLength={1} onKeyUp={handleKeyPress4} ref={inputRef3} />
                                        <input autoComplete='off' className='form-control' style={{ width: '40px', height: '40px', margin: '1%', fontSize: '30px', textAlign: 'center' }} name='code5' maxLength={1} onKeyUp={handleKeyPress5} ref={inputRef4} />
                                        <input autoComplete='off' className='form-control' style={{ width: '40px', height: '40px', margin: '1%', fontSize: '30px', textAlign: 'center' }} name='code6' maxLength={1} onKeyUp={handleKeyPress6} ref={inputRef5} />
                                    </Boxstyle>
                                </div>
                            </div>
                        </Container>
                        {
                            errors.mobileNumber
                                ? <ErrorText>{errors.mobileNumber}</ErrorText>
                                : null
                        }
                        <NextButton>
                            {
                                !checking ?
                                    <SlideButton secondary type='submit' ref={inputRef6} >Verify</SlideButton>
                                :
                                    <Spinner />
                            }
                        </NextButton>
                    </StyledForm>)}
                </Formik>
            :
                    <Formik
                        key="verify"
                        initialValues={{ mobileNumber: '' }}
                        validationSchema={RegistrationApi.verificationSchema}
                        onSubmit={verify}>
                        {({ values, setFieldValue, errors, touched }) => (
                            <StyledForm>
                                 <Container>
                                    <PhoneNumberInput
                                        international
                                        defaultCountry={country}
                                        name="mobileNumber"
                                        value={values.mobileNumber}
                                        onChange={(value: string) => {
                                            dispatch(setMobileNumberData({mobileNumber: value}));
                                            setFieldValue('mobileNumber', value, true);
                                        }}
                                        labeltext='Your phone number'
                                        placeholder='+44797577766' />
                                    {
                                        touched.mobileNumber && errors.mobileNumber

                                            ? <ErrorText>{errors.mobileNumber}</ErrorText>
                                            : null
                                    }
                                </Container>
                                <NextButton>
                                    {
                                        !loading ?
                                            <SlideButton secondary type='submit'>Get Code</SlideButton>
                                        :
                                            <Spinner />
                                    }
                                </NextButton>
                                <p style={{fontSize: '12px', fontStyle: 'italic', marginTop: '5px' }}>The code is valid for the next 10 minutes.</p>
                            </StyledForm>
                        )}
                    </Formik>
               }
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
const PhoneNumberInput = styled(PhoneInput)`
.PhoneInputInput {
    ${InputFieldsSharedStyles}
}
`;
const ErrorText = styled.span`
color: ${props => props.theme.colors.danger};
padding: 3px 10px;
font-size: 0.8em;
`;
const IndividualButton = styled.div`
    @media ${device.sm} {
        flex-direction: row;
        justify-content: flex-start;
    }
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
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
    background-color: ${props => props.theme.colors.bgrey};
`
const Boxstyle = styled.div`
    display: flex;
    justify-content: center;
    @media (max-width: 420px){
        column-count: 3;
        gap:10px;
        display: grid;
        grid-template-columns: auto auto auto;
        padding: 10px;
        justify-content: center;
    }`
   