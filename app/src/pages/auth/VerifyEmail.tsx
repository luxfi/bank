import { Form, Formik } from "formik";
import styled from 'styled-components';
import Button from "../../components/Button";
import { verifyEmail, VerifyEmailDto, verifyEmailDtoSchema } from "../../features/auth/AuthApi";
import InputField from "../../components/InputField";
import React from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import { useQuery } from "../../utils/use-query";


export default function VerifyEmail() {
    const [error, setError] = React.useState('');
    const [verified, setVerified] = React.useState(false);
    const query = useQuery();
    const initialValues: VerifyEmailDto = {
        email: String(query.get('email') || ''),
        code: String(query.get('code') || ''),
    };

    return (
        <Layout>
            <Container>
                <Title>User verification</Title>
                {
                    verified
                        ? <>
                            <h1>Thank you</h1>
                            <p>Your email has been verified, you can now <Link to='/login'>Log in</Link></p>
                        </>
                        : <Formik
                            onSubmit={async (values) => {
                                try {
                                    const verified = await verifyEmail(values);
                                    if (!verified) {
                                        throw new Error('Email was not verified.');
                                    }
                                } catch (err) {
                                    console.error(err);
                                    setError((err as Error)?.message || 'Verification failed, please try again.');
                                    return;
                                }

                                setVerified(true);
                            }}
                            initialValues={initialValues}
                            validationSchema={verifyEmailDtoSchema}>
                            <Form style={{ minWidth: '33.3%' }}>
                                <InputField name="email" labeltext="Email" placeholder="test@example.com" />
                                <InputField name="code" labeltext="Verification Code" placeholder="Verification Code" />
                                {
                                    error
                                        ? <ErrorText>{error}</ErrorText>
                                        : null
                                }
                                <Button primary>Verify</Button>
                            </Form>
                        </Formik>
                }
            </Container>
        </Layout>
    );
}


const Container = styled.div`
    margin: 70px auto;
    text-align: center;
    @media(max-width: 768px){
        width: 90vw;
        // background-color:${(props) => props.theme.colors.primary};    
    }
    @media(min-width: 992px){
        width: 40vw;
    }
    width: 50vw;
    border-radius: 15px;
    text-align: center;
    color: ${(props) => props.theme.colors.fg};
    background-color: ${(props) => props.theme.colors.bg};
    padding:10px 30px;
    z-index:1;
`;

const Title = styled.h1`
padding: 0px;
margin: 20px 0px 40px;
font-size: 2em;
font-weight: bolder;
`;

const ErrorText = styled.div`
color: ${(props) => props.theme.colors.danger};
font-size: 0.8em;
margin-bottom: 20px;
`;
