import React from 'react';
import { Formik } from 'formik';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import InputField from '../../../components/InputField';
import { setCompanyInfo, submitUserMetadata, unSetBankInfo } from '../../../features/registration/RegistrationSlice';
import { ButtonsContainer } from '../components/ButtonsContainer';
import { SlideButton } from '../components/SlideButton';
import { SlideProps } from '../helpers/slide-types';
import BaseSlide, { StyledForm } from './BaseSlide';
import 'react-phone-number-input/style.css'
import { device } from "../../../utils/media-query-helpers";
import BankInformationSlide from './BankInformationSlide';
import RadioButtonChoiceField from '../../../components/RadioButtonChoiceField';
import { companyInformationMetadataSchema } from '../../../features/registration/model/companyInformationMetadataSchema';
import { setActiveState } from '../../../features/auth/ViewCarouselSlice';
import { companyInformationMetadataInitialValues } from '../../../features/registration/model/companyInformationMetadataInitialValue';
import { selectCurrentUser } from '../../../features/auth/AuthSlice';
import DocumentsDialogSlide from './DocumentsDialogSlide';
import PasswordSlide from './PasswordSlide';

export default function CompanyInformationSlide({ goToSlide }: SlideProps) {
    const dispatch = useAppDispatch();
    const vatValue = new Map([
        ['Yes', 'Yes'],
        ['No', 'No'],
    ]);
    const tradValue = new Map([
        ['Yes', 'Yes'],
        ['No', 'No'],
    ]);
    const reguValue = new Map([
        ['Yes', 'Yes'],
        ['No', 'No'],
    ]);

    const currentUser = useAppSelector(selectCurrentUser);
    const invitationFlag = currentUser?.invitedBy ? true : false;
    return (
        <>
            <BaseSlide key='business-slide' title='Let us know about your company'>
                <Formik
                    initialValues={companyInformationMetadataInitialValues}
                    validationSchema={companyInformationMetadataSchema}
                    onSubmit={async (values, formik) => {
                        
                        try {
                            dispatch(setCompanyInfo(values));
                            if(invitationFlag) {
                                await dispatch(setActiveState({activeState: 3}));
                                dispatch(unSetBankInfo());
                                await dispatch(submitUserMetadata()).unwrap();
                                goToSlide(DocumentsDialogSlide);
                            }
                            else
                                goToSlide(BankInformationSlide);
                        } catch (err) {
                            console.error(err);
                            formik.setFieldError('account', 'Registration failed, please try again.');
                        }
                    }}>
                    {
                        ({ values, setFieldValue }) => (
                            <StyledForm>
                                {
                                    <Container>
                                    <IndividualButton>
                                        <InputField
                                            type="text"
                                            name="company_name"
                                            labeltext='Company name'
                                            helpText='Company Name' />
                                        <InputField
                                            type="text"
                                            name="trading_name"
                                            labeltext='Trading name'
                                            helpText='Trading Name' />
                                    </IndividualButton>
                                    <IndividualButton>
                                        <InputField
                                            type="text"
                                            name="website_url"
                                            labeltext='Website URL'
                                            helpText='Website URL' />
                                        <InputField
                                            type="text"
                                            name="nature_of_business"
                                            labeltext='Nature of business'
                                            helpText='Nature of Business' />
                                    </IndividualButton>
                                    <IndividualButton>
                                        <InputField
                                            type="text"
                                            name="company_registration_number"
                                            labeltext='Company registration no'
                                            helpText='Company Registration No'
                                        />
                                    </IndividualButton>
                                    <IndividualButton>
                                        <InputField
                                            type="text"
                                            name="address1"
                                            labeltext='Address Line 1'
                                            helpText='Address Line 1' />
                                        <InputField
                                            type="text"
                                            name="address2"
                                            labeltext='Address Line 2'
                                            helpText='Address Line 2' />
                                    </IndividualButton>
                                    <IndividualButton>
                                        <InputField
                                            type="text"
                                            name="city"
                                            labeltext='City'
                                            helpText='City' />
                                    </IndividualButton>
                                    <IndividualButton>
                                        <InputField
                                            type="text"
                                            name="postcode"
                                            labeltext='Zip Code/Post Code'
                                            helpText='Zip Code/Post Code' />
                                        <InputField
                                            type="text"
                                            name="state"
                                            labeltext='State / County'
                                            helpText='State / County' />
                                    </IndividualButton>
                                    <IndividualButton>
                                        <RadioButtonChoiceField
                                            options={vatValue}
                                            name='is_vat_registered'
                                            labeltext='Are you VAT registered?*'
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setFieldValue('is_vat_registered', e.target.value);
                                                // setFieldValue('expectedValueOfTurnover', e.target.value);
                                            }}
                                        />
                                    </IndividualButton>
                                    {
                                        values.is_vat_registered === "Yes" && <IndividualButton>
                                            <InputField
                                                type="text"
                                                name="vat_number"
                                                labeltext='VAT number'
                                                helpText='VAT number'
                                            />
                                        </IndividualButton>
                                    }
                                    
                                    <IndividualButton>
                                        <RadioButtonChoiceField
                                            options={tradValue}
                                            name='is_public_trading'
                                            labeltext='Is your company publicly trading'
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setFieldValue('is_public_trading', e.target.value);
                                                // setFieldValue('expectedValueOfTurnover', e.target.value);
                                            }}
                                        />
                                    </IndividualButton>
                                    {
                                        values.is_public_trading === "Yes" && <IndividualButton>
                                        <InputField
                                            type="text"
                                            name="stock_market_location"
                                            labeltext='Where is it listed?'
                                        />
                                        <InputField
                                            type="text"
                                            name="stock_market"
                                            labeltext='Which stock exchange market'
                                            helpText='Which stock exchange market' />
                                    </IndividualButton>
                                    }
                                    
                                    <IndividualButton>
                                        <RadioButtonChoiceField
                                            options={reguValue}
                                            name='is_regulated'
                                            labeltext='Is your company regulated'
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setFieldValue('is_regulated', e.target.value);
                                                // setFieldValue('expectedValueOfTurnover', e.target.value);
                                            }}
                                        />
                                    </IndividualButton>
                                    {
                                        values.is_regulated ==="Yes" && <IndividualButton>
                                        <InputField
                                            type="text"
                                            name="regulator_name"
                                            labeltext='Name of regulator'
                                            helpText='Name of Regualtor'
                                        />
                                    </IndividualButton>
                                    }
                                    </Container>
                                }
                                <ButtonsContainer>
                                    <SlideButton secondary type='submit'>Next</SlideButton>
                                </ButtonsContainer>
                            </StyledForm>
                        )
                    }
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
