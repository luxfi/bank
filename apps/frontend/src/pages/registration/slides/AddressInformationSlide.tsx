import { Formik } from 'formik';
import { useAppDispatch } from '../../../app/hooks';
import InputField from '../../../components/InputField';
import BaseSlide, { StyledForm } from './BaseSlide';
import { SlideProps } from '../helpers/slide-types';
import { ButtonsContainer } from '../components/ButtonsContainer';
import { SlideButton } from '../components/SlideButton';
import styled from 'styled-components';
import { device } from "../../../utils/media-query-helpers";
// import { addressInformationSchema } from '../../../features/registration/model/addressInformationSchema';
import { countries, countriesToSelect } from '../../../features/registration/model/countries';
import SelectInputField from '../../../components/SelectInputField';
import { setAddressInfo } from '../../../features/registration/RegistrationSlice';
import AdvancedInformationSlide from './AdvancedInformationSlide';
import IdentyInformationSlide from './IdentyInformationSlide';
import { setActiveState } from '../../../features/auth/ViewCarouselSlice';
import { addressMetadataInitialValues } from '../../../features/registration/model/addressMetadataInitialValue';
import { addressInformationMetadataSchema } from '../../../features/registration/model/addressInformationMetadataSchema';
export default function AddressInformationSlide({ goToSlide }: SlideProps) {
    const dispatch = useAppDispatch();
    return (
        <>
        <IndividualButton>
            <CircleRegion>
                <button onClick={() => goToSlide(AdvancedInformationSlide)} style={{border:'none', borderRadius:'50%', cursor:'pointer', position:"relative", paddingTop:'9px'}}>
                    <img src={`${process.env.PUBLIC_URL}/images/larrow.svg`} alt="Prev" />   
                </button>
            </CircleRegion>
        </IndividualButton>
        <BaseSlide key='information-slide' title='Tell us about yourself'>
            <Formik
                initialValues={addressMetadataInitialValues}
                validationSchema={addressInformationMetadataSchema}
                onSubmit={async (values, formik) => {
                    dispatch(setAddressInfo(values));
                    dispatch(setActiveState({activeState: 1}));
                    goToSlide(IdentyInformationSlide)
                }}>

                <StyledForm>
                    <>
                         Your address
                         <IndividualButton>
                             <InputField
                                 type="text"
                                 name="line11"
                                 labeltext='Address line 1' 
                                 helpText='Please enter Address Line 1'/>
                             <InputField
                                 type="text"
                                 name="line12"
                                 labeltext='Address line 2' 
                                 helpText='Please enter Address line 2'/>
                         </IndividualButton>
                         <IndividualButton>
                             <InputField
                                 type="text"
                                 name="city1"
                                 labeltext='City' 
                                 helpText='Please enter your City'/>
                             <InputField
                                 type="text"
                                 name="codePost1"
                                 labeltext='Zip Code/Post Code'
                                 helpText='Please enter your Zip Code/Post Code' />
                         </IndividualButton>
                         <IndividualButton>
                            <SelectInputField
                                    name='country1'
                                    labeltext='Country: '
                                    placeholder='Select a country'
                                    options={countriesToSelect}
                                    containerStyle = {{marginRight: '10px', width: '100%'}}
                            />
                            <InputField
                                type="text"
                                name="state1"
                                labeltext='State/County'
                                helpText='Please enter your State/County' 
                            />
                         </IndividualButton>
                         Previous address
                         <IndividualButton>
                             <InputField
                                 type="text"
                                 name="line21"
                                 labeltext='Address Line 1' 
                                 />
                             <InputField
                                 type="text"
                                 name="line22"
                                 labeltext='Address Line 2' 
                                 />
                         </IndividualButton>
                         <IndividualButton>
                             <InputField
                                 type="text"
                                 name="city2"
                                 labeltext='City' 
                                 />
                             <InputField
                                 type="text"
                                 name="codePost2"
                                 labeltext='Zip Code/Post Code'
                                 />
                         </IndividualButton>
                         <IndividualButton>
                            <SelectInputField
                                    name='country2'
                                    labeltext='Country: '
                                    placeholder='Select a country'
                                    options={countriesToSelect}
                                    containerStyle = {{marginRight: '10px', width: '100%'}}
                                />
                            <InputField
                                type="text"
                                name="state2"
                                labeltext='State/County'
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
