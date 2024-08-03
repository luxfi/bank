import styled from "styled-components";
import Modal from "react-modal";
import * as yup from 'yup';
import { Form, Formik } from "formik";
import React from "react";
import Button from "../../../components/Button";
import { Spinner } from "../../../components/Spinner";
import { device } from "../../../utils/media-query-helpers";
import { FlexibleForm, FlexibleFormField } from "../../dashboard/components/FlexibleForm";
import { FormRow } from "../../dashboard/components/FormRow";
import { HalfWidth } from "../../dashboard/components/HalfWidth";
import InputField from "../../../components/InputField";
import { linkClient } from "../../../features/admin-clients/AdminClientsApi";
import { ErrorText } from "../../dashboard/components/ErrorText";

export default function ApproveModal(props: Props) {
    const [error, setError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const initialValues = {
        passwordUrl: '',
        contactId: '',
        accountId: '',
    };

    const validationSchema = yup.object({
        passwordUrl: yup.string().required(),
        contactId: yup.string().uuid().required(),
        accountId: yup.string().uuid().required(),
    });

    return (
        <Modal isOpen={props.isOpen}
            style={{ overlay: { zIndex: 99999999 } }}
            ariaHideApp={false}>
            <Formik
                validationSchema={validationSchema}
                initialValues={initialValues}
                onSubmit={async (values) => {
                    setIsLoading(true);
                    setError('');
                    try {
                        await linkClient(props.uuid, values);
                        props.onSubmit();
                    } catch (err) {
                        if ((err as Error).message) {
                            setError((err as Error).message);
                        } else {
                            setError('Linking failed.');
                        }
                    }

                    setIsLoading(false);
                }}
            >
                <Container>
                    <FlexibleForm>
                        <FlexibleFormField
                            name="passwordUrl"
                            labeltext="Password URL"
                            placeholder="https://example.com"
                        />

                        <FlexibleFormField
                            name="contactId"
                            labeltext="Contact ID"
                            placeholder="00000000-0000-0000-0000-000000000000"
                        />

                        <FlexibleFormField
                            name="accountId"
                            labeltext="Account ID"
                            placeholder="00000000-0000-0000-0000-000000000000"
                        />
                    </FlexibleForm>
                    {
                        error
                            ? <ErrorText>{error} </ErrorText>
                            : null
                    }

                    {
                        isLoading
                            ? <Spinner />
                            : <ButtonsContainer>
                                <Button primary type="submit">Submit</Button>
                                <Button type="button" onClick={() => props.onSubmit()}>Cancel</Button>
                            </ButtonsContainer>
                    }
                </Container>
            </Formik>
        </Modal>
    );
}

type OnSubmit = () => void;
interface Props {
    uuid: string;
    isOpen: boolean;
    onSubmit: OnSubmit;
};

const Container = styled(Form)`
display: flex;
width: 100%;
padding: 50px;
flex-direction: column;
justify-content: center;
align-items: center;
box-sizing: border-box;
`;

const ButtonsContainer = styled.div`
@media ${device.sm} {
    flex-direction: row;
    align-items: flex-end;
    justify-content: flex-end;
}

display: flex;
flex-direction: column;
width: 80%;
margin-top: 30px;
justify-content: space-around;
`;

