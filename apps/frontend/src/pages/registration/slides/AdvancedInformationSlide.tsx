import React from 'react';
import { Formik } from 'formik';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectCurrentUser } from '../../../features/auth/AuthSlice';
import InputField from '../../../components/InputField';
import BaseSlide, { StyledForm } from './BaseSlide';
import { SlideProps } from '../helpers/slide-types';
import { ButtonsContainer } from '../components/ButtonsContainer';
import { SlideButton } from '../components/SlideButton';
import styled from 'styled-components';
import { device } from "../../../utils/media-query-helpers";
import PasswordSlide from './PasswordSlide';
import { setAdvancedInfo } from '../../../features/registration/RegistrationSlice';
import AddressInformationSlide from './AddressInformationSlide';
import { setActiveState } from '../../../features/auth/ViewCarouselSlice';
import { advancedInformationMetadataSchema } from '../../../features/registration/model/advancedInformationMetadataSchema';
import { advancedMetadataInitialValues } from '../../../features/registration/model/advancedMetadataInitialValue';
import SelectInputField from '../../../components/SelectInputField';
import { personalTitles } from '../../../features/registration/model/personalTitles';
export default function AdvancedInformationSlide({ goToSlide }: SlideProps) {
    const dispatch = useAppDispatch();

    const currentUser = useAppSelector(selectCurrentUser);
    return (
        // <RequireAuth roles={UserRoles}>
        <>
        <BaseSlide key='information-slide' title='Tell us about yourself'>
            <Formik
                initialValues={advancedMetadataInitialValues(currentUser)}
                validationSchema={advancedInformationMetadataSchema}
                onSubmit={async (values, formik) => {
                    dispatch(setAdvancedInfo(values));
                    dispatch(setActiveState({activeState: 1}));
                    goToSlide(AddressInformationSlide)
                }}>

                <StyledForm>
                    <>
                        <IndividualButton>
                            <SelectInputField name='title' labeltext='Title' options={personalTitles} containerStyle = {{marginRight: '10px', width: '100%'}}/>
                            <InputField
                                type="text"
                                name="firstname"
                                labeltext='First name' 
                                placeholder='John'
                                helpText='Please enter your First Name'/>
                        </IndividualButton>
                        <IndividualButton>
                            <InputField
                                type="text"
                                name="lastname"
                                labeltext='Last name' 
                                placeholder='Smith'
                                helpText='Please enter Last Name'/>
                            <InputField
                                type="text"
                                name="formername"
                                labeltext='Please enter any former names'
                                />
                        </IndividualButton>
                        <IndividualButton>
                            <InputField
                                type="text"
                                name="otherName"
                                labeltext='Any other name used' 
                                />
                            <InputField
                                type="date"
                                name="birth"
                                labeltext='Date of birth' 
                                helpText='Please enter your date of birth'
                                />
                        </IndividualButton>
                        <IndividualButton>
                            <InputField
                                type="text"
                                name="place"
                                labeltext='Place of birth' 
                                helpText="Please enter your birthplace"/>
                            
                        </IndividualButton>
                    </>
                    <ButtonsContainer>
                        <SlideButton secondary type='submit'>Next</SlideButton>
                    </ButtonsContainer>
                </StyledForm>
            </Formik>
        </BaseSlide>
        {/* </RequireAuth> */}
        </>
    );
}
const IndividualButton =styled.div`
    @media ${device.sm} {
        flex-direction: row;
        justify-content:space-between;
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
