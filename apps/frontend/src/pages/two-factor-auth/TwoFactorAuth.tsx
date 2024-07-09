import { Spin } from "antd";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Button from "../../components/Button";
import Layout from "../../components/Layout";
import AuthCode from "./CodeInput";

import { useLocation, useNavigate } from "react-router-dom";
import { User } from "../../features/auth/AuthApi";
import {
    cancel2FAScreen,
    login2FA,
    resendCode,
    selectuserTempData,
} from "../../features/auth/AuthSlice";
import { AdminRoles } from "../../features/auth/user-role.enum";
import { censorPhoneNumber, formatPhoneNumber } from "./helpers";

export default function TwoFactorAuth(props: any) {
    const location = useLocation();
    const from = (location.state as any)?.from?.pathname || "/dashboard";

    const userTempData = useAppSelector(selectuserTempData);

    const [errorMessage, setErrorMessage] = useState("");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    const [sendSuccessMessage, setSendSuccessMessage] = useState(
        "We send a code to your email"
    );

    const [provider, setProvider] = useState<"sms" | "email">("email");
    const [timer, setTimer] = useState<number>(60);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const storagedTime = localStorage.getItem("2fa_timer");
        if (storagedTime) setTimer(Number(storagedTime));
        dispatch(cancel2FAScreen());

        return () => {
            localStorage.removeItem("_grecaptcha");
            localStorage.removeItem("2fa_timer");
        };
    }, []);

    useEffect(() => {
        let intervalId: any;
        if (timer > 0) {
            intervalId = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }

        localStorage.setItem("2fa_timer", String(timer));
        return () => {
            clearInterval(intervalId);
        };
    }, [timer]);

    const handleResendCode = async (
        provider: "sms" | "email"
    ): Promise<void> => {
        setProvider(provider);

        if (provider === "sms") {
            const mobileNumber = formatPhoneNumber(
                (userTempData as any)?.contact?.mobileNumber
            );
            const censoredPhoneNumber = mobileNumber
                ? censorPhoneNumber(mobileNumber)
                : null;
            setSendSuccessMessage(`We send a code to ${censoredPhoneNumber}`);
        } else if (provider === "email") {
            setSendSuccessMessage;
        }

        const resend = await dispatch(resendCode(provider)).unwrap();
        if (typeof resend === "string") {
            setErrorMessage(resend);
            return;
        }
        setTimer(60);
    };

    const handleSubmit = async () => {
        if (!code || code.length < 6) {
            setErrorMessage("Please provide a valid 6 digit code");
            return;
        }
        setLoading(true);

        const verified = await dispatch(
            login2FA({
                verificationCode: code,
                provider: provider,
            })
        ).unwrap();

        if (typeof verified === "string") {
            setErrorMessage(verified);
            setLoading(false);
            return;
        }
        if (typeof verified === "object") {
            localStorage.setItem(
                "_currentClient_notify",
                JSON.stringify({
                    account: verified.name || verified.currentClient?.name,
                    user: `${verified.firstname} ${verified.lastname}`,
                })
            );
        }

        setLoading(false);
        conditionalNavigation(verified as User);
    };

    useEffect(() => {
        if (code.length >= 6) {
            setErrorMessage("");
        }
    }, [code]);

    const conditionalNavigation = (user: User) => {
        if (!user) return;
        if (AdminRoles.includes(user.role)) {
            return navigate("/admin/");
        } else if (
            !AdminRoles.includes(user.role) &&
            from.indexOf("/admin") !== -1
        ) {
            return navigate("/dashboard");
        }
        return navigate(from);
    };

    return (
        <Layout>
            <Container>
                <Card>
                    <h1 className="title">Enter the 6 digit code</h1>
                    <h2>{sendSuccessMessage}</h2>
                    <StyledForm>
                        <InputsContainer>
                            <AuthCode
                                onChange={setCode}
                                allowedCharacters="numeric"
                                autoFocus
                                errorMsg={errorMessage}
                            />
                        </InputsContainer>
                        {loading ? (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "52px",
                                }}
                            >
                                <Spin />
                            </div>
                        ) : (
                            <Button
                                onClick={() => handleSubmit()}
                                disabled={false}
                                primary
                                style={{
                                    borderRadius: "5px",
                                    paddingInline: "3rem",
                                }}
                            >
                                Verify
                            </Button>
                        )}
                    </StyledForm>
                    {timer ? (
                        <h3 className="timer">{`Send again ${timer}`}</h3>
                    ) : (
                        <LinkBtn onClick={() => handleResendCode(provider)}>
                            Send again
                        </LinkBtn>
                    )}
                    {(userTempData as any)?.contact?.mobileNumber && (
                        <LinkBtn
                            disabled={!!timer}
                            onClick={() => {
                                handleResendCode(
                                    provider === "email" ? "sms" : "email"
                                );
                            }}
                        >
                            {`Receive by ${
                                provider === "email" ? "SMS" : "Mail"
                            }`}
                        </LinkBtn>
                    )}
                </Card>
            </Container>
        </Layout>
    );
}

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-image: url("/images/blue_background.jpeg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    @media (max-width: 768px) {
        overflow-y: hidden;
    }
`;

const Card = styled.div`
    display: flex;
    flex-direction: column;
    gap: 26px;
    align-items: center;

    width: 475px;
    background-color: #fff;
    border-radius: 8px;
    padding: 32px 48px;

    h1 {
        color: #1e3456;
        margin: 0;
        padding: 0;
        font-size: 32px;
        font-weight: 700;
    }
    h2 {
        font-size: 14px;
    }
    .timer {
        font-size: 16px;
        color: rgba(99, 64, 6, 0.16);
    }
`;
const InputsContainer = styled.div`
    display: flex;
    gap: 12px;
`;
const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 26px;
`;
const LinkBtn = styled.button`
    display: flex;
    background: none;
    border: none;
    color: #000;
    text-decoration: underline;
    font-size: 16px;
    transition: all 0.3s ease-in-out;
    cursor: pointer;

    &:disabled {
        color: rgba(99, 64, 6, 0.16);
        cursor: not-allowed;
    }

    &:hover:not(:disabled) {
        color: #6b6b6b;
    }
`;
