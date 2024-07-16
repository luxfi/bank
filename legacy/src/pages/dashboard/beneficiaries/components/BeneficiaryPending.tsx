import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../../../../components/Button";
import { ButtonsRow } from "../../components/ButtonsRow";

export default function BeneficiaryPending() {
    const navigate = useNavigate();
    useEffect(() => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }, []);
    return (
        <>
            <Title>Thank You</Title>
            <Text>
                We have received the beneficiary details and it's under review.
            </Text>
            <ButtonsRow>
                <Button type="button" primary onClick={() => navigate('/dashboard/beneficiaries')}>Back to Beneficiary List</Button>
            </ButtonsRow>
        </>
    )
}

const Title = styled.h1`
    color: ${(props) => props.theme.colors.primary};
    font-size: 2em;
`;

const Text = styled.p`
    color: ${(props) => props.theme.colors.primary};
`;
