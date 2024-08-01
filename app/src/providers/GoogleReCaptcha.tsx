'use client';

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

const GoogleReCaptchaProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={String(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY)}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
};

export default GoogleReCaptchaProviders;
