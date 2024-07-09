import { faAddressBook } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { PropsWithoutRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import Button from "../../../../components/Button";
import { Spinner } from "../../../../components/Spinner";
import { submitBeneficiaryForm, selectBankDetails, selectBeneficiariesError, selectBeneficiariesStatus, selectBeneficiaryData } from "../../../../features/beneficiaries/BeneficiariesSlice";
import { getRoutingCodeNameByCountry, isIBAN, isInUk, isSwift } from "../../../../utils/country-check";
import { device } from "../../../../utils/media-query-helpers";
import { BeneficiaryFormStep } from "../BeneficiaryForm";
import BeneficiaryPending from "./BeneficiaryPending";
import { ButtonsRow } from "../../components/ButtonsRow";

export default function ReviewBeneficiary(
    { setActiveStep, uuid }: PropsWithoutRef<{
        setActiveStep: React.Dispatch<React.SetStateAction<BeneficiaryFormStep>>;
        uuid: string;
    }>
) {
    useEffect(() => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }, []);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [isSubmitted, setIsSubmitted] = React.useState(false);

    const status = useAppSelector(selectBeneficiariesStatus);
    const error = useAppSelector(selectBeneficiariesError);
    const beneficiaryData = useAppSelector(selectBeneficiaryData);
    const bankDetails = useAppSelector(selectBankDetails);
    const submitData = async () => {
        // console.log('submitBeneficiary')
        const beneficiary = await dispatch(submitBeneficiaryForm()).unwrap();

        if (beneficiary.isApproved) {
            navigate('/dashboard/beneficiaries');
        } else {
            setActiveStep(BeneficiaryFormStep.Complete);
            setIsSubmitted(true);
        }
    };

    const ReviewElement = <>
        <SubHeader>
            <FontAwesomeIcon icon={faAddressBook} style={{ marginRight: '10px' }} />
            Beneficiary Details
        </SubHeader>
        <dl>
            {
                beneficiaryData.entityType === 'individual'
                    ? <>
                        <Item term='First name' description={beneficiaryData.firstname} />
                        <Item term='Last name' description={beneficiaryData.lastname} />
                        <Item term='Address' description={beneficiaryData.address} />
                    </>
                    : null
            }
            <Item term='City' description={beneficiaryData.city} />
            <Item term='Country' description={beneficiaryData.country} />
            {/* <Item term='Company name' description={beneficiaryData.companyName} /> */}
        </dl>

        <SubHeader>
            <FontAwesomeIcon icon={faAddressBook} style={{ marginRight: '10px' }} />
            Beneficiary Bank Details
        </SubHeader>
        <dl>
            <Item term='Currency' description={beneficiaryData.currency} />
            <Item term='Beneficiary Type' description={beneficiaryData.entityType} />
            <Item term='Bank account country' description={beneficiaryData.bankCountry} />

            {!!beneficiaryData.accountNumber && <Item term='Account Number' description={beneficiaryData.accountNumber} />}
            {!!beneficiaryData.sortCode && <Item term={getRoutingCodeNameByCountry(beneficiaryData.bankCountry, beneficiaryData.currency)} description={beneficiaryData.sortCode} />}
            {!!beneficiaryData.bicSwift && <Item term='BIC SWIFT' description={beneficiaryData.bicSwift} />}
            {!!beneficiaryData.IBAN && <Item term='IBAN' description={beneficiaryData.IBAN} />}
            {
                bankDetails.name
                    ? <Item term='Bank Name' description={bankDetails.name} />
                    : null
            }

            {
                bankDetails.address
                    ? <Item term='Bank Address' description={bankDetails.address} />
                    : null
            }
        </dl>

        {status === 'error' ? <Error>{error}</Error> : null}

        <ButtonsRow>
            <Button type="button" primary onClick={() => setActiveStep(BeneficiaryFormStep.Form)}>Back</Button>
            <Button type="button" danger onClick={() => navigate('/dashboard')}>Cancel</Button>
            <Button type="button" secondary onClick={submitData}>
                {uuid && uuid === 'new' ? 'Create' : 'Update'} Beneficiary
            </Button>
        </ButtonsRow>
    </>;

    return (
        <>
            {
                isSubmitted
                    ? <BeneficiaryPending />
                    : status === 'loading' ? <Spinner /> : ReviewElement
            }
        </>
    );
}

const Item = React.memo(({ term, description }: { term: string, description: string | undefined }) => (
    <Row>
        <Term>{term}:</Term>
        <Description>{description}</Description>
    </Row>
));

const SubHeader = styled.h3`
color: ${(props) => props.theme.colors.primary};
display: block;
font-size: 1.17em;
margin-block-start: 1.4em;
margin-block-end: 1em;
margin-inline-start: 0px;
margin-inline-end: 0px;
font-weight: bold;
`;

const Term = styled.dt`
color: ${(props) => props.theme.colors.primary};
font-weight: bold;
flex: 1;
`;

const Description = styled.dd`
@media ${device.sm} {
    flex: 2;
}

color: ${(props) => props.theme.colors.primary};
flex: 1;
`;

const Row = styled.div`
@media ${device.sm} {
    flex-direction: row;
}

display: flex;
flex-direction: column;
`;

const Error = styled.div`
flex: 100%;
padding: 10px 0px;
color: ${props => props.theme.colors.danger};
`;
