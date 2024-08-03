import { Formik } from 'formik';
import InputField from '../../../components/InputField';
import BaseSlide, { StyledForm } from './BaseSlide';
import { SlideProps } from '../helpers/slide-types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { SlideButton } from '../components/SlideButton';
import styled from 'styled-components';
import { device } from "../../../utils/media-query-helpers";
import { selectRegistrationStatus, setBankInfo, submitUserMetadata } from '../../../features/registration/RegistrationSlice';
import { EntityType, selectRegistrationType } from '../../../features/registration/RegistrationSlice';
import IdentyInformationSlide from './IdentyInformationSlide';
import { countries, countriesToSelect } from '../../../features/registration/model/countries';
import SelectInputField from '../../../components/SelectInputField';
import Tooltip from '../../../components/Tooltip';
import ExpectedActivitySlide from './ExpectedActivitySlide';
import { setActiveState } from '../../../features/auth/ViewCarouselSlice';
import { isInUk } from '../../../utils/country-check';
import { bankMetadataInitialValues } from '../../../features/registration/model/bankMetadataInitialValues';
import { bankMetadataSchema } from '../../../features/registration/model/bankMetadataSchema';
import { currencies, currenciesToSelect } from "../../../features/beneficiaries/model/currencies";
import CompanyInformationSlide from './CompanyInformationSlide';
import { openErrorNotification } from '../../../components/Notifications';
import { Spinner } from '../../../components/Spinner';

export default function BankInformationSlide({ goToSlide }: SlideProps) {
    const dispatch = useAppDispatch();
    const entityType = useAppSelector(selectRegistrationType);
    const isBusinessRegistration = entityType === EntityType.Business;
    const prevClick = () => goToSlide(isBusinessRegistration ? CompanyInformationSlide : IdentyInformationSlide);
    const status = useAppSelector(selectRegistrationStatus);
    return (
        <>
        <IndividualButton>
            <CircleRegion>
                <button onClick={prevClick} style={{border:'none', borderRadius:'50%', cursor:'pointer', position:"relative", paddingTop:'9px'}}>
                    <img src={`${process.env.PUBLIC_URL}/images/larrow.svg`} alt="Prev" />   
                </button>
            </CircleRegion>
        </IndividualButton>
        <BaseSlide key='information-slide' title='Tell us about your banking'>
            <Formik
                initialValues={bankMetadataInitialValues}
                validationSchema={bankMetadataSchema}
                onSubmit={async (values, formik) => {
                    await dispatch(setBankInfo({...values, sortCode: String(values.sort1)+String(values.sort2)+String(values.sort3) || ''}));
                    const errorData = await dispatch(submitUserMetadata()).unwrap();
                    const bankMetadata = errorData.bankMetadata;
                    if (bankMetadata?.bankCountry && bankMetadata?.bankCountry !== "") {
                        formik.setErrors({
                            IBAN: `Bank country does not match bank details (Bank country - ${bankMetadata.bankCountry})`,
                        });
                    } else if (bankMetadata?.bankName) {
                        formik.setErrors({
                            IBAN: `Bank mismatch (IBAN - ${bankMetadata.bankName} (BIC: ${bankMetadata.bicSwift}), SWIFT - ${bankMetadata.bankNameMismatch || 'unknown'} (BIC: ${values.bicSwift}))`,
                        });
                    } else if (bankMetadata?.bankNameMismatch) {
                        formik.setErrors({
                            IBAN: `IBAN bank doesn't match SWIFT details (SWIFT bank - ${bankMetadata.bankNameMismatch})`,
                        });
                    } else if (bankMetadata?.errors) {
                        if (bankMetadata?.errors.sortCode) {
                            formik.setErrors({
                                accountNumber: bankMetadata?.errors.sortCode,
                            });
                        }
                        if (bankMetadata?.errors.account_number) {
                            formik.setErrors({
                                accountNumber: bankMetadata?.errors.account_number,
                            });
                        }
                    } else if (errorData?.statusCode == 500) {
                        openErrorNotification("Server Error", "Please try again.");
                    } else {
                        dispatch(setActiveState({activeState: 2}));
                        goToSlide(ExpectedActivitySlide);
                    }
                }}>
                {({values, errors}) => (                
                <StyledForm>
                    <>
                    <NextButton>
                        <Label>
                            Bank account details from where funds will be received and paid away to
                        </Label>
                    </NextButton>
                    <IndividualButton>
                        <InputField
                            type="text"
                            name="bankName"
                            labeltext='Name of bank' 
                            helpText='Please enter the name of bank'/>
                        <InputField
                            type="text"
                            name="branch"
                            labeltext='Branch' 
                            helpText='Please enter the branch name'/>
                    </IndividualButton>
                    <IndividualButton>
                        <SelectInputField
                            name='bankCountry'
                            labeltext='Bank Country: '
                            placeholder='Select a country'
                            options={countriesToSelect}
                            containerStyle = {{marginRight: '10px', width: '100%'}}
                        />
                        
                        <InputField
                            type="text"
                            name="accountHolderName"
                            labeltext='Account holder name'
                            helpText='Please enter the account holder name' />
                    </IndividualButton>
                    {isInUk(values.bankCountry) && <IndividualButton>
                        <TwoRectangle>
                            <TwoLabel>
                                Sort Code
                                <Tooltip text="SortCode" />
                            </TwoLabel>
                            <RectanglePhone>
                                <InputField labeltext='' type="text"  style={{margin: '0 0px', textAlign:'center', width: '50px'}} name='sort1' maxLength={2} placeholder='12' />
                                <InputField labeltext='' type="text" style={{margin: '0 0px', textAlign:'center', width: '50px'}} name='sort2' maxLength={2} placeholder='34' />
                                <InputField labeltext='' type="text" style={{margin: '0 0px', textAlign:'center', width: '50px'}} name='sort3' maxLength={2} placeholder='56' />
                            </RectanglePhone>
                        </TwoRectangle>
                        <InputField
                            type="text"
                            name="accountNumber"
                            labeltext='Account number'
                            helpText='Please enter the account number'
                            placeholder='12345678'    
                        />
                    </IndividualButton>}
                    <IndividualButton>
                        <InputField
                            type="text"
                            name="IBAN"
                            labeltext='IBAN number'
                            placeholder='AA00000000000000000000000000'
                            />
                    </IndividualButton>
                    <IndividualButton>
                        <InputField
                            type="text"
                            name="bicSwift"
                            placeholder='AAAABBCC123'
                            labeltext='BIC/SWIFT' 
                        />
                    </IndividualButton>
                    <IndividualButton>
                        <SelectInputField
                            labeltext="Currency"
                            name="currency"
                            placeholder='Select a currency'
                            options={currenciesToSelect}
                        />
                    </IndividualButton>
                    </>
                    {status === "loading" ? (
                        <Spinner />
                    ) : (
                        <NextButton>
                            <IBANButton>
                                <SlideButton secondary type='submit'>Next</SlideButton>
                            </IBANButton>
                        </NextButton>
                    )}
                </StyledForm>
                )}
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
    padding: 10px 0;
`;
const NextButton =styled.div`
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
const IBANContainer =styled.div`
    @media ${device.sm} {
        flex-direction: row;
        justify-content: flex-start;
    }
    display: flex;
    flex-direction: row;
    justify-content: center;
    border-radius: 100%;
`;
const IBANButton =styled.div`
    @media ${device.sm} {
        flex-direction: row;
        justify-content: flex-start;
    }
    display: flex;
    flex-direction: row;
    justify-content: center;
    border-radius: 100%;
    width: 60%;
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
    background-color: ${props=>props.theme.colors.bgrey};
`;
const RectanglePhone = styled.div`
    @media ${device.sm}{
        display: flex;
        flex-direction:row;
        height:50px;
        justify-content:flex-start;
    }
    display: flex;
    flex-direction: row;
    height: 50px;
    justify-content: flex-start;
    
`
const TwoRectangle = styled.div`
    @media ${device.sm} {
        width: 50%;
        display: flex;
        flex-direction:column;
        justify-content:flex-start;
    }
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
`


const Label = styled.label`
    color: ${(props) => props.theme.colors.label};
    display: flex;
    flex-direction: row;
    padding: 3px 10px;
    font-size: 0.8em;
    opacity: 0.9;
    width:60%;
    justify-content: center;
`;

const TwoLabel = styled.label`
    @media ${device.sm}{
        color: ${(props) => props.theme.colors.label};
        padding: 3px 10px;
        margin-left:5px;
        font-size: 0.8em;
        font-weight: bold;
    }
    color: ${(props) => props.theme.colors.label};
    display: flex;
    flex-direction: row;
    padding: 3px 10px;
    font-size: 0.8em;
    width:100%;
    justify-content: flex-start;
`;
