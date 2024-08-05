import { ArrowLeftOutlined } from "@ant-design/icons";
import { Modal, notification } from "antd";
import { Form, Formik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import Layout from "../../components/Layout";
import { Spinner } from "../../components/Spinner";
import {
    ForgotPasswordData,
    LoginDto,
    forgotPasswordDtoSchema,
    loginDtoSchema,
} from "../../features/auth/AuthApi";
import {
    cancel2FAScreen,
    forgotPassword,
    login,
    selectAuthError,
    selectCurrentUser,
    selectShouldOpen2FA,
} from "../../features/auth/AuthSlice";
import { AdminRoles } from "../../features/auth/user-role.enum";
import Mobile2FASlide from "../registration/slides/Mobile2FASlide";
const openNotification = () => {
    notification.success({
        message: "New Password",
        description:
            "A temporary password has been sent to your email address.",
        duration: 3,
    });
};

export default function Login() {
    const location = useLocation();
    const from = (location.state as any)?.from?.pathname || "/dashboard";
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const currentUser = useAppSelector(selectCurrentUser);
    const shouldOpen2FA = useAppSelector(selectShouldOpen2FA);
    const authError = useAppSelector(selectAuthError);
    //const loading = useAppSelector(selectAuthStatus) === 'loading';
    const [loading, setLoading] = useState(false);
    const initialValues: LoginDto = { username: "", password: "" };
    const initialForgotPasswordValues: ForgotPasswordData = { email: "" };

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [is2FAModalVisible, setIs2FAModalVisible] = useState(false);

    const [captcha, setCaptcha] = useState<string | null>(null);
    const [captchaErrorMessage, setCaptchaErrorMessage] = useState<
        string | null
    >();
    const recaptchaRef: any = React.createRef();

    useEffect(() => {
        if (shouldOpen2FA) navigate("/2fa");
        //setIs2FAModalVisible(shouldOpen2FA);
    }, [shouldOpen2FA]);
    useEffect(() => {
        console.log(authError);
        //setIs2FAModalVisible(shouldOpen2FA);
    }, [authError]);

    const onSubmit = useCallback(
        async (values: any) => {
            if (!captcha) {
                setCaptchaErrorMessage(
                    "Please complete the reCAPTCHA to proceed."
                );
                return;
            }

            setCaptchaErrorMessage(null);
            setLoading(true);

            const token = captcha;
            if (token) {
                dispatch(login({ ...values, r: token }));
            }
        },
        [captcha, captchaErrorMessage]
    );

    useEffect(() => {
        if (authError || captchaErrorMessage) {
            setLoading(false);
        }
    }, [authError, captchaErrorMessage]);

    const handle2FACancel = () => {
        dispatch(cancel2FAScreen());
    };

    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    if (currentUser) {
        if (AdminRoles.includes(currentUser.role)) {
            return <Navigate to="/admin/" replace />;
        } else if (
            !AdminRoles.includes(currentUser.role) &&
            from.indexOf("/admin") !== -1
        ) {
            return <Navigate to="/dashboard" replace />;
        }
        return <Navigate to={from} replace />;
    }

    return (
        <Layout>
            <Container>
                <FormContainer>
                    <BackButtonContainer>
                        <Link to={"https://cdax.forex/"}>
                            <ArrowLeftOutlined />
                        </Link>
                    </BackButtonContainer>
                    <Formik
                        onSubmit={onSubmit}
                        initialValues={initialValues}
                        validationSchema={loginDtoSchema}
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
                                    <h1>Sign In</h1>
                                    <h4>
                                        Welcome back! Please enter your details
                                    </h4>
                                </TitleContainer>
                                <InputField
                                    name="username"
                                    labeltext="Email"
                                    placeholder="email@example.com"
                                    onChange={(v: any) => {
                                        setFieldValue(
                                            "username",
                                            String(v.target.value).trim()
                                        );
                                    }}
                                />
                                <InputField
                                    type="password"
                                    name="password"
                                    labeltext="Password"
                                    placeholder="Password"
                                />
                                {authError ? (
                                    <ErrorText>{authError}</ErrorText>
                                ) : null}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        padding: "1rem",
                                    }}
                                >
                                    <CaptchaContainer
                                        hasError={!!captchaErrorMessage}
                                    >
                                        <div>
                                            <ReCAPTCHA
                                                hl="en"
                                                ref={recaptchaRef}
                                                onChange={(e) => setCaptcha(e)}
                                                sitekey={String(
                                                    process.env
                                                        .REACT_APP_RECAPTCHA_KEY
                                                )}
                                            />
                                        </div>
                                        {captchaErrorMessage && !captcha && (
                                            <span>{captchaErrorMessage}</span>
                                        )}
                                    </CaptchaContainer>
                                </div>
                                <ButtonContainer>
                                    {loading ? (
                                        <Spinner />
                                    ) : (
                                        <Button
                                            primary
                                            style={{ minWidth: "180px" }}
                                            type="submit"
                                        >
                                            Log In
                                        </Button>
                                    )}
                                </ButtonContainer>
                            </Form>
                        )}
                    </Formik>
                    <Link
                        to=""
                        style={{
                            textAlign: "center",
                            marginTop: "20px",
                            display: "block",
                            fontWeight: "bold",
                            color: "#1E3456",
                        }}
                        onClick={showModal}
                    >
                        Forgot Password?
                    </Link>
                    <RequestRegistrationContainer>
                        <span>Don't have an Account?</span>
                        <Link to="/registration">Request registration</Link>
                    </RequestRegistrationContainer>
                </FormContainer>
                <Modal
                    title="Forgot Password"
                    open={isModalVisible}
                    onCancel={handleCancel}
                    footer={[]}
                >
                    <Formik
                        onSubmit={async (values) => {
                            try {
                                await dispatch(forgotPassword(values)).unwrap();
                                openNotification();
                                handleCancel();
                            } catch (err: any) {
                                console.error(err);
                            }
                        }}
                        initialValues={initialForgotPasswordValues}
                        validationSchema={forgotPasswordDtoSchema}
                    >
                        <Form>
                            <InputField
                                name="email"
                                labeltext="Email"
                                placeholder="email@example.com"
                            />
                            {authError ? (
                                <ErrorText>{authError}</ErrorText>
                            ) : null}
                            {loading ? (
                                <Spinner />
                            ) : (
                                <Button primary style={{ width: "100%" }}>
                                    Send Request
                                </Button>
                            )}
                        </Form>
                    </Formik>
                </Modal>
                <Modal
                    title="Two Factor Authentication"
                    open={is2FAModalVisible}
                    onCancel={handle2FACancel}
                    footer={[]}
                >
                    <Mobile2FASlide />
                </Modal>
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

const Title = styled.h1`
    color: ${(props) => props.theme.colors.primary};
    padding: 0px;
    margin: 20px 0px 40px;
    font-size: 1.6em;
    font-weight: bolder;
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
    button {
        width: 100%;
        border-radius: 5px;
    }
    @media (max-width: 768px) {
        display: block;
    }
`;

interface ICaptchaContainer {
    hasError: boolean;
}
const CaptchaContainer = styled.div<ICaptchaContainer>`
    display: flex;
    flex-direction: column;
    height: fit-content;
    width: fit-content;

    div {
        border: ${(props) => (props.hasError ? props.theme.colors.danger : "")};
    }
    span {
        color: ${(props) => props.theme.colors.danger};
        padding: 1rem 0;
    }
`;
const TitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;

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
const RequestRegistrationContainer = styled.div`
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    margin-top: 1rem;
    color: #1e3456;
`;

const BackButtonContainer = styled.div`
    display: flex;
    width: 100%;
    align-items: flex-start;

    &:first-child {
        background: none;
        border: none;
        font-size: 1.2rem;
        opacity: 0.8;
        margin-bottom: 3rem;
        cursor: pointer;

        &:hover {
            opacity: 1;
        }
    }
`;
