import { createRef, useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import styled from "styled-components";

interface IRecaptchaProps {
  captchaToken: (value: string) => void;
  error?: string;
}

export const Recaptcha = ({ captchaToken, error }: IRecaptchaProps) => {
  const recaptchaRef = createRef<any>();

  const [captcha, setCaptcha] = useState<string | null>(null);
  const [captchaErrorMessage, setCaptchaErrorMessage] = useState<
    string | null
  >();

  useEffect(() => {
    if (error) {
      setCaptchaErrorMessage(error);
    } else {
      setCaptchaErrorMessage(null);
    }

    return () => {
      setCaptchaErrorMessage(null);
    };
  }, [error]);

  useEffect(() => {
    if (!captcha) return;
    captchaToken(captcha);
  }, [captcha]);

  return (
    <CaptchaContainer hasError={!!captchaErrorMessage}>
      <div>
        <ReCAPTCHA
          hl="en"
          ref={recaptchaRef}
          onChange={(e) => setCaptcha(e)}
          sitekey={String(process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY)}
        />
      </div>
      {captchaErrorMessage && !captcha && (
        <span style={{ fontSize: "1.4rem" }}>{captchaErrorMessage}</span>
      )}
    </CaptchaContainer>
  );
};

const CaptchaContainer = styled.div<{ hasError: boolean }>`
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
