import React, { useEffect, useState } from 'react';
import { Form } from 'formik';
import { PropsWithChildren } from 'react';
import styled from 'styled-components';
import * as RegistrationApi from '../../../features/registration/RegistrationApi';
import { device } from '../../../utils/media-query-helpers';
import { selectRegistrationMobileCode, selectRegistrationMobileNumber, setMobileBasisData, setMobileData, setMobileNumberData } from '../../../features/registration/RegistrationSlice';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setActiveState } from '../../../features/auth/ViewCarouselSlice';
import { openErrorNotification, openNotification } from '../../../components/Notifications';
import { Progress } from '../../../components/Spinner';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
const Container = styled.div`
    @media(max-width: 768px){
        background-color: ${props => props.theme.colors.primary};
        border-radius: 10px;
    }
    padding: 10px 10px 0 10px;
    background-color: ${(props) => props.theme.colors.bg};
    border-radius: 10px;
`;
const WhiteContainer = styled.div`
    @media(max-width: 768px){
        border-radius: 10px;
    }
    padding: 10px 10px 0 10px;
    background-color: ${(props) => props.theme.colors.bg};
    border-radius: 10px;
`
const OtherContainer = styled.div`
    @media(max-width: 768px){
        background-color: ${props => props.theme.colors.bg};
        border-radius: 20px;
    }
    padding: 10px 10px 0 10px;
    background-color: ${(props) => props.theme.colors.bg};
`;

const HeaderContainer = styled.div`
    @media(max-width: 768px){
        padding-top: 70px;
        border-top-left-radius:20px;
        border-top-right-radius:20px;
    }
    background-color: ${(props) => props.theme.colors.bg};
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

const PageTitle = styled.h1`
    @media ${device.sm} {
        font-size: 1.4em;
    }

    font-size: 1.1em;
    color: ${(props) => props.theme.colors.fg};
    margin-left: 20px;
    margin-right: 20px;
`;

const PageIcon = styled.img`
    width: 100px !important;
`;

const NoPaddingFormContainer = styled.div`
    @media(max-width: 768px){
        border-bottom-left-radius: inherit;
        border-bottom-right-radius: inherit;
        background-color: ${(props) => props.theme.colors.primary}; 
        padding-top: 0;
    }
    @media(max-width: 962px){
        border-bottom-left-radius: inherit;
        border-bottom-right-radius: inherit;
    }
    background-color: ${(props) => props.theme.colors.bg};
    /* max-width: 800px; */
    padding-top: 20px;
    padding-bottom: 20px;
`;
const PaddingTopContainer = styled.div`
    @media(max-width: 768px){
        border-bottom-left-radius: inherit;
        border-bottom-right-radius: inherit;
        background-color: ${(props) => props.theme.colors.primary}; 
        // padding-top: 0;
    }
    background-color: ${(props) => props.theme.colors.bg};
    /* max-width: 800px; */
    padding-top: 20px;
    padding-bottom: 20px;
`;
const FormContainer = styled.div`
    @media(max-width: 768px){
        border-bottom-left-radius: 20px !important;
        border-bottom-right-radius: 20px !important;
        margin-top: -1px;
        // background-color: ${(props) => props.theme.colors.primary}; 
    }
    @media(max-width: 962px){
        border-bottom-left-radius: inherit;
        border-bottom-right-radius: inherit;
    }
    background-color: ${(props) => props.theme.colors.bg};
    /* max-width: 800px; */
    padding-top: 20px;
    padding-bottom: 20px;
`;
const OtherFormContainer = styled.div`
    @media(max-width: 768px){
        border-bottom-left-radius: inherit;
        border-bottom-right-radius: inherit;
        background-color: ${(props) => props.theme.colors.bg}; 
    }
    
    background-color: ${(props) => props.theme.colors.bg};
    /* max-width: 800px; */
    padding-top: 20px;
    padding-bottom: 20px;
`;
const PayBodyContainer = styled.div`
    @media(max-width: 768px){
        background-color: ${(props) => props.theme.colors.bg}; 
        border-bottom-left-radius: inherit;
        border-bottom-right-radius: inherit;
        width: 70vw;
    }

    /* display: flex;
    justify-content: flex-start;
    align-items: flex-start; */
    /* border-radius: 10px; */
    background-color: ${(props) => props.theme.colors.bg};
    /* max-width: 800px; */
    padding-top: 20px;
    padding-bottom: 20px;
    width: 45vw;
    margin-bottom: 20px;
`
export const StyledForm = styled(Form)`
    @media(max-width: 768px){
        /* margin: 0 auto; */
        margin-top: -21px;
        /* background-color: ${(props) => props.theme.colors.primary};  */

    }
    
`;

export default function BaseSlide({ verifyCode, title, sort, children }: PropsWithChildren<{ verifyCode?: any, title?: string, sort?: string }>) {
    const dispatch = useAppDispatch();
    const lentitle = Number(title?.length);
    const last = title?.slice(lentitle - 5, lentitle);
    const mobileNumber = useAppSelector(selectRegistrationMobileNumber);
    const [sent, setSent] = useState(false);
    const [showRetry, setShowRetry] = useState(false);
    const [sending, setSendingState] = useState(false);
    const [toggleRetry, setToggleRetry] = useState(false);
    const mobileCode = useAppSelector(selectRegistrationMobileCode);
    useEffect(() => {
        setShowRetry(false);
        const timeout = setTimeout(() => {
            if (sent) {
                setShowRetry(true);
            }
        }, 60000);

        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, [toggleRetry, sent])
    const verify = async () => {
        setSendingState(true);
        const verified = await RegistrationApi.verifyMobile({
            mobileNumber: mobileNumber
        });
        setSendingState(false);
        if (!verified) {
            openErrorNotification('Mobile Number', 'Could not send the verification code. Please try again after 10 minutes.');
            return;
        }
        openNotification('Resend Code', 'The new code has been sent to ' + mobileNumber);
        if (!mobileCode) {
            dispatch(setMobileBasisData({
                mobileNumber: mobileNumber,
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
        dispatch(setMobileNumberData({
            mobileNumber: mobileNumber
        }));
        dispatch(setActiveState({ activeState: 0 }))
    }
    const PageHeader = () => (<HeaderContainer>
        {title ?
            title.includes('end') || title == 'empty' ? null :
                (last === "code?"
                    ? <PageTitle>{title}
                        { sending ? 
                            <a className='sendCode'> Resending <Progress icon={faSpinner} style = {{verticalAlign: 'middle', fontSize: 'inherit', padding: '0'}}/></a>
                        :
                            <a className='sendCode' onClick={verify} style={{ color: '#F49C0E' }}> Resend Code</a>
                        }
                        <p style={{fontSize: '12px', fontStyle: 'italic'}}>You may resend the code up to 4 times.</p>
                        </PageTitle>
                    : <PageTitle>{title} </PageTitle>
                )
            :
            (<PageTitle>Register for your CDAX Forex Account</PageTitle>)
        }
    </HeaderContainer>);
    return (
        <>
            {
                sort === 'entity' ?
                    <OtherContainer>
                        <PageHeader />
                        <OtherFormContainer>
                            {children}
                        </OtherFormContainer>

                    </OtherContainer>
                    : sort === 'payment' ?
                        <WhiteContainer>
                            <PayBodyContainer>
                                {children}
                            </PayBodyContainer>
                        </WhiteContainer>
                        :
                        <Container>
                            <PageHeader />
                            {
                                sort === 'verify' || sort === 'upload' || sort === 'empty' ?
                                    <NoPaddingFormContainer>
                                        {children}
                                    </NoPaddingFormContainer>
                                    : sort === 'padding-top' ?
                                    <PaddingTopContainer>
                                        {children}
                                    </PaddingTopContainer> :
                                    <FormContainer>
                                        {children}
                                    </FormContainer>
                            }
                        </Container>
            }
        </>
    );
}


