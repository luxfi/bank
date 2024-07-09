"use client"

import { Form, Formik } from "formik";
import { useCallback, useState } from "react";
import { Link, useNavigate, useRouter } from "react-router-dom";
import styled from "styled-components";
import * as yup from "yup";
import { useAppDispatch } from "@admin/app/hooks";
import Button from "@admin/components/Button";
import InputField from "@admin/components/InputField";
import Layout from "@admin/components/Layout";
import { submitRegistrationRequest } from "@admin/features/requestRegistration/RequestRegistrationSlice";

export interface IRequestRegistrationForm {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
}

export default function RequestRegistration() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const [requestError, setRequestError] = useState("");

    const initialValues: IRequestRegistrationForm = {
        firstName: "",
        lastName: "",
        email: "",
        mobileNumber: "",
    };

    const formSchema = yup.object({
        firstName: yup.string().required("Please enter your first name"),
        lastName: yup.string().required("Please enter your last name"),
        email: yup
            .string()
            .email("Please enter a valid email address")
            .required("Email is required"),
        mobileNumber: yup
            .string()
            .required("Please enter your Phone Number")
            .matches(
                /^(\+|\d)[0-9]{7,15}$/,
                "Please enter a valid phone number"
            ),
    });

    const onSubmit = useCallback(async (values: IRequestRegistrationForm) => {
        setRequestError("");
        setLoading(true);
        await dispatch(
            submitRegistrationRequest({
                firstname: values.firstName,
                lastname: values.lastName,
                email: values.email,
                mobileNumber: values.mobileNumber,
            })
        )
            .unwrap()
            .then((res: any) => {
                setLoading(false);
                if (res.error) {
                    setRequestError(
                        "Error sending information, please try again later"
                    );
                    return;
                }
                navigate("/registration/success");
            });
    }, []);

    const formik = useFormik<IFormParams>({
        initialValues: {
            address: data?.address || '',
            postCode: data?.postCode || '',
            addressLine2: data?.addressLine2 || '',
            firstName: data?.firstName || '',
            lastName: data?.lastName || '',
            companyName: data?.companyName || '',
            bankAccountCountry: data?.bankAccountCountry || '',
            city: data?.city || '',
            state: data?.state || '',
            country: data?.country || '',
            currency: data?.currency || '',
            entityType: data?.entityType || '',
            accountNumber: data?.accountNumber || '',
            bicSwift: data?.bicSwift || '',
            sortCode: data?.sortCode || '',
            iban: data?.iban || '',
        },
        onSubmit: (v) => {
            handleSubmit(v);
        },
        validationSchema: validationForm,
        validateOnChange: true,
    });

    // Wrap formik.handleSubmit to handle mouse events correctly
    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        formik.handleSubmit();  // Call formik's handleSubmit
    };

    return (
        <Layout>
            <Container>
                <FormContainer>
                    <Formik
                        onSubmit={onSubmit}
                        initialValues={initialValues}
                        validationSchema={formSchema}
                    >
                        {({ values, setFieldValue }) => (
                            <Form style={{ minWidth: "33.3%" }}>
                                <img
                                    className="logo"
                                    src="/images/cdax-logo2.svg"
                                    alt="CDAX"
                                    width="190px"
                                />
                                <TitleContainer>
                                    <h1>Request Registration</h1>
                                    <h4>Fill out the form to request access</h4>
                                </TitleContainer>
                                <InputField
                                    name="firstName"
                                    labeltext="First Name*"
                                    onChange={(v: any) => {
                                        setFieldValue(
                                            "firstName",
                                            String(v.target.value).trim()
                                        );
                                    }}
                                />
                                <InputField
                                    name="lastName"
                                    labeltext="Last Name*"
                                    onChange={(v: any) => {
                                        setFieldValue(
                                            "lastName",
                                            String(v.target.value).trim()
                                        );
                                    }}
                                />
                                <InputField
                                    name="email"
                                    labeltext="Email*"
                                    onChange={(v: any) => {
                                        setFieldValue(
                                            "email",
                                            String(v.target.value).trim()
                                        );
                                    }}
                                />
                                <InputField
                                    name="mobileNumber"
                                    labeltext="Mobile Number*"
                                    variant="phone"
                                    onChange={(v: any) => {
                                        setFieldValue("mobileNumber", v, true);
                                    }}
                                />

                                {requestError ? (
                                    <ErrorText>{requestError}</ErrorText>
                                ) : null}

                                <ButtonContainer>
                                    <Button
                                        primary
                                        style={{ width: "100%" }}
                                        type="submit"
                                        onClick={handleButtonClick}
                                    >
                                        Send
                                    </Button>
                                </ButtonContainer>
                                <SignInContainer>
                                    <span>Already using CDAX?</span>
                                    <Link to="/">Sign in</Link>
                                </SignInContainer>
                                <Row
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <span
                                        style={{
                                            color: "red",
                                            fontWeight: 600,
                                            marginTop: "1rem",
                                        }}
                                    >
                                        {requestError}
                                    </span>
                                </Row>
                            </Form>
                        )}
                    </Formik>
                </FormContainer>
            </Container>
        </Layout>
    );
}

const Container = styled.section`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100vh;
    background-image: url("/images/blue_background.jpeg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    @media (max-width: 768px) {
        overflow-y: hidden;
    }
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
`;

const ErrorText = styled.div`
    color: ${(props) => props.theme.colors.danger};
    font-size: 0.8em;
    margin-bottom: 20px;
`;

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    text-align: center;
    color: ${(props) => props.theme.colors.fg};
    background-color: ${(props) => props.theme.colors.bg};
    padding: 2rem;
    padding-top: 96px;
    width: 720px;

    form {
        width: 350px;
    }

    .logo {
        margin-bottom: 64px;
        @media (max-width: 768px) {
            width: 60vw;
        }
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;

    button {
        border-radius: 8px;
    }

    @media (max-width: 768px) {
        display: block;
    }
`;

const TitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: center;

    h1 {
        color: #1e3456;
        margin: 0;
        padding: 0;
        font-size: 32px;
        font-weight: 700;
    }

    h4 {
        color: #516686;
        margin-bottom: 2rem;
    }
`;
const SignInContainer = styled.div`
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    margin-top: 1rem;
    color: #1e3456;
`;
