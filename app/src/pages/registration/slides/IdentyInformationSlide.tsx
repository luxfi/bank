import React from 'react';
import { Formik } from 'formik';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { submitUserMetadata, unSetBankInfo } from '../../../features/registration/RegistrationSlice';
import InputField from '../../../components/InputField';
import BaseSlide, { StyledForm } from './BaseSlide';
import { identificationTypes } from '../../../features/registration/model/identificationTypes';
import { SlideProps } from '../helpers/slide-types';
import { ButtonsContainer } from '../components/ButtonsContainer';
import { SlideButton } from '../components/SlideButton';
import styled from 'styled-components';
import { device } from "../../../utils/media-query-helpers";
import { setFormInfo } from '../../../features/registration/RegistrationSlice';
import AddressInformationSlide from './AddressInformationSlide';
import BankInformationSlide from './BankInformationSlide';
import { setActiveState } from '../../../features/auth/ViewCarouselSlice';
import { formMetadataInitialValues } from '../../../features/registration/model/formMetadataInitialValue';
import { formInformationMetadataSchema } from '../../../features/registration/model/formInformationMetadataSchema';
import SelectInputField from '../../../components/SelectInputField';
import { genders } from '../../../features/registration/model/genders';
import { selectCurrentUser } from '../../../features/auth/AuthSlice';
import DocumentsDialogSlide from './DocumentsDialogSlide';
import { countries, countriesToSelect } from '../../../features/registration/model/countries';
export default function IdentyInformationSlide({ goToSlide }: SlideProps) {
    const dispatch = useAppDispatch();
    const data = useAppSelector(selectCurrentUser);
    const invitationFlag = data?.invitedBy ? true : false;
     
    return (
        <>
        <IndividualButton>
            <CircleRegion>
            <button onClick={() => goToSlide(AddressInformationSlide)} style={{border:'none', borderRadius:'50%', cursor:'pointer', position:"relative", paddingTop:'9px'}}>
                <img src={`${process.env.PUBLIC_URL}/images/larrow.svg`} alt="Prev" />   
            </button>
            </CircleRegion>
        </IndividualButton>
        <BaseSlide key='information-slide' title='Tell us about yourself'>
            <Formik
                initialValues={formMetadataInitialValues}
                validationSchema={formInformationMetadataSchema}
                onSubmit={async (values, formik) => {
                    dispatch(setFormInfo(values));
                    dispatch(setActiveState({activeState: 1}))
                    if(invitationFlag) {
                        dispatch(unSetBankInfo());
                        await dispatch(setActiveState({activeState: 3}));
                        await dispatch(submitUserMetadata()).unwrap();
                        goToSlide(DocumentsDialogSlide);
                    }
                    else
                        goToSlide(BankInformationSlide)
                }}>

                <StyledForm>
                    <>
                        <IndividualButton>
                            <SelectInputField name='gender' labeltext='Gender' options={genders} containerStyle = {{marginRight: '10px', width: '100%'}}/>
                            <SelectInputField 
                                containerStyle={{ width: "100%" }}
                                name='identificationType' 
                                labeltext='Identification type' 
                                options={identificationTypes}
                                 />
                        </IndividualButton>
                        <IndividualButton>
                            <SelectInputField 
                                containerStyle={{ width: "100%" }}
                                name='nationality' 
                                labeltext='Nationality' 
                                placeholder='Select a country'
                                options={countriesToSelect}
                            />
                        </IndividualButton>
                        <IndividualButton>
                            <InputField
                                type="text"
                                name="identifyNumber"
                                labeltext='Identification Number' 
                                placeholder='000000'
                                helpText='Please enter your Identification Number'/>
                            <InputField
                                type="text"
                                name="occupation"
                                labeltext='Occupation'
                                helpText='Please enter your Occupation' />
                        </IndividualButton>
                        <IndividualButton>
                            <InputField
                                type="text"
                                name="employerName"
                                labeltext='Employer Name'
                                helpText='Please enter your Employer Name'
                            />
                            <InputField
                                type="text"
                                name="employerAddress1"
                                labeltext='Employer Address'
                                helpText='Please enter your Employer Address' 
                            />
                        </IndividualButton>
                    </>
                    <ButtonsContainer>
                        <SlideButton secondary type='submit'>Next</SlideButton>
                    </ButtonsContainer>
                </StyledForm>
            </Formik>
        </BaseSlide>
        </>
    );
}

const IndividualButton =styled.div`
    @media ${device.sm} {
        flex-direction: row;
        justify-content: space-between;
    }
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 100%;
`;
const CircleRegion = styled.div`
@media (max-width: 768px){
        display: flex;
        transform: translate(50px, 70px);
        justify-content: flex-start;    
    }
    width: 30px;
    height: 30px;
    border-radius: 100%;
    background-color: ${props=>props.theme.colors.bgrey}
`
