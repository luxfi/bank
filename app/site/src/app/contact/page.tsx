"use client";
import { useState } from "react";
import Link from "next/link";
import styled from "styled-components";

import { CustomButton } from "@/components/Button";
import { Recaptcha } from "@/components/Recaptcha";
import { LUX_BRAND } from "@luxbank/brand";
import { DeviceSize } from "@/styles/theme/default";

import { Spin } from "antd";
import { useFormik } from "formik";
import * as yup from "yup";

import { ContactSubmit } from "@/api/forms";

// Icons
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const formSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  company: yup.string(),
  message: yup.string().required("Message is required"),
  r: yup.string().required("Please complete the reCAPTCHA"),
});

export default function Contact() {
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS;
  const { jurisdiction } = LUX_BRAND;
  const { legalEntity } = jurisdiction;

  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    validationSchema: formSchema,
    validateOnChange: false,
    initialValues: {
      name: "",
      email: "",
      company: "",
      message: "",
      r: "",
    },
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      await ContactSubmit(values)
        .then(() => {
          setEmailSent(true);
          resetForm();
        })
        .catch((err) => {
          console.error(err);
          setEmailSent(false);
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  return (
    <PageContainer>
      {/* Hero */}
      <HeroSection>
        <HeroContent>
          <HeroBadge>Contact</HeroBadge>
          <HeroTitle>Let&apos;s build together</HeroTitle>
          <HeroSubtitle>
            Whether you&apos;re ready to integrate or just exploring options, our team is here to help.
          </HeroSubtitle>
        </HeroContent>
      </HeroSection>

      {/* Main Content */}
      <ContentSection>
        <ContentGrid>
          {/* Contact Form */}
          <FormCard>
            {loading ? (
              <LoadingState>
                <Spin size="large" />
                <LoadingText>Sending your message...</LoadingText>
              </LoadingState>
            ) : emailSent ? (
              <SuccessState>
                <SuccessIcon>
                  <CheckCircleIcon />
                </SuccessIcon>
                <SuccessTitle>Message sent</SuccessTitle>
                <SuccessText>
                  Thank you for reaching out. Our team will get back to you within 24 hours.
                </SuccessText>
                <CustomButton onClick={() => setEmailSent(false)}>
                  Send another message
                </CustomButton>
              </SuccessState>
            ) : (
              <>
                <FormHeader>
                  <FormTitle>Send us a message</FormTitle>
                  <FormSubtitle>
                    Tell us about your project and we&apos;ll get back to you within 24 hours.
                  </FormSubtitle>
                </FormHeader>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    formik.handleSubmit();
                  }}
                >
                  <FormRow>
                    <FormField>
                      <FormLabel>Full Name *</FormLabel>
                      <FormInput
                        type="text"
                        placeholder="John Smith"
                        onChange={(e) => formik.handleChange("name")(e)}
                        value={formik.values.name}
                        $hasError={!!formik.errors.name}
                      />
                      {formik.errors.name && (
                        <FormError>{formik.errors.name}</FormError>
                      )}
                    </FormField>
                    <FormField>
                      <FormLabel>Work Email *</FormLabel>
                      <FormInput
                        type="email"
                        placeholder="john@company.com"
                        onChange={(e) => formik.handleChange("email")(e)}
                        value={formik.values.email}
                        $hasError={!!formik.errors.email}
                      />
                      {formik.errors.email && (
                        <FormError>{formik.errors.email}</FormError>
                      )}
                    </FormField>
                  </FormRow>
                  <FormField>
                    <FormLabel>Company</FormLabel>
                    <FormInput
                      type="text"
                      placeholder="Your company name"
                      onChange={(e) => formik.handleChange("company")(e)}
                      value={formik.values.company}
                    />
                  </FormField>
                  <FormField>
                    <FormLabel>Message *</FormLabel>
                    <FormTextarea
                      placeholder="Tell us about your project, volume expectations, and timeline..."
                      onChange={(e) => formik.handleChange("message")(e.target.value)}
                      value={formik.values.message}
                      $hasError={!!formik.errors.message}
                    />
                    {formik.errors.message && (
                      <FormError>{formik.errors.message}</FormError>
                    )}
                  </FormField>
                  {formik.values.email &&
                    formik.values.name &&
                    formik.values.message && (
                      <RecaptchaContainer>
                        <Recaptcha
                          error={formik.errors.r}
                          captchaToken={formik.handleChange("r")}
                        />
                      </RecaptchaContainer>
                    )}
                  <SubmitButton type="submit">Send Message</SubmitButton>
                </Form>
              </>
            )}
          </FormCard>

          {/* Contact Info */}
          <InfoSection>
            <InfoCard>
              <InfoIconContainer>
                <MailIcon />
              </InfoIconContainer>
              <InfoContent>
                <InfoTitle>Email</InfoTitle>
                <InfoValue>hello@lux.financial</InfoValue>
                <InfoDescription>For general inquiries</InfoDescription>
              </InfoContent>
            </InfoCard>

            <InfoCard>
              <InfoIconContainer>
                <PhoneIcon />
              </InfoIconContainer>
              <InfoContent>
                <InfoTitle>Support</InfoTitle>
                <InfoValue>support@lux.financial</InfoValue>
                <InfoDescription>Technical assistance</InfoDescription>
              </InfoContent>
            </InfoCard>

            <InfoCard>
              <InfoIconContainer>
                <MapPinIcon />
              </InfoIconContainer>
              <InfoContent>
                <InfoTitle>Office</InfoTitle>
                <InfoValue>{legalEntity.registeredAddress.line1}</InfoValue>
                <InfoDescription>
                  {legalEntity.registeredAddress.city}, {legalEntity.registeredAddress.state} {legalEntity.registeredAddress.postalCode}
                </InfoDescription>
              </InfoContent>
            </InfoCard>

            <InfoCard>
              <InfoIconContainer>
                <ClockIcon />
              </InfoIconContainer>
              <InfoContent>
                <InfoTitle>Response Time</InfoTitle>
                <InfoValue>&lt; 24 hours</InfoValue>
                <InfoDescription>For business inquiries</InfoDescription>
              </InfoContent>
            </InfoCard>

            {/* Quick Links */}
            <QuickLinks>
              <QuickLinksTitle>Resources</QuickLinksTitle>
              <QuickLinksList>
                <QuickLink href="https://docs.lux.financial" target="_blank">
                  Documentation
                  <ArrowIcon>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </ArrowIcon>
                </QuickLink>
                <QuickLink href="https://github.com/luxfi" target="_blank">
                  GitHub
                  <ArrowIcon>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </ArrowIcon>
                </QuickLink>
                <QuickLink href="https://docs.lux.financial/api-reference" target="_blank">
                  API Reference
                  <ArrowIcon>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </ArrowIcon>
                </QuickLink>
                <QuickLink href="https://status.lux.financial" target="_blank">
                  System Status
                  <ArrowIcon>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </ArrowIcon>
                </QuickLink>
                <QuickLink href="https://app.lux.financial/registration" target="_blank">
                  Create Account
                  <ArrowIcon>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </ArrowIcon>
                </QuickLink>
              </QuickLinksList>
            </QuickLinks>
          </InfoSection>
        </ContentGrid>
      </ContentSection>

      {/* Map Section */}
      {mapsApiKey && (
        <MapSection>
          <MapContainer>
            <iframe
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              src={`https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(legalEntity.registeredAddress.line1 + ", " + legalEntity.registeredAddress.city + ", " + legalEntity.registeredAddress.state)}&key=${mapsApiKey}&language=en&zoom=15`}
            />
          </MapContainer>
        </MapSection>
      )}
    </PageContainer>
  );
}

// Styled Components
const PageContainer = styled.main`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 2rem;
  padding-top: 64px;

  @media ${DeviceSize.sm} {
    padding: 0 1rem;
    padding-top: 56px;
  }
`;

const HeroSection = styled.section`
  padding: 5rem 0 3rem;
  text-align: center;

  @media ${DeviceSize.sm} {
    padding: 3rem 0 2rem;
  }
`;

const HeroContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const HeroBadge = styled.span`
  display: inline-block;
  padding: 0.4rem 1rem;
  font-size: 1.2rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  margin-bottom: 1.5rem;
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 600;
  line-height: 1.1;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
  letter-spacing: -0.02em;

  @media ${DeviceSize.sm} {
    font-size: 3rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.6rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.secondary};
`;

const ContentSection = styled.section`
  padding: 2rem 0 5rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 2rem;

  @media ${DeviceSize.md} {
    grid-template-columns: 1fr;
  }
`;

const FormCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 2.5rem;

  @media ${DeviceSize.sm} {
    padding: 1.5rem;
  }
`;

const FormHeader = styled.div`
  margin-bottom: 2rem;
`;

const FormTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const FormSubtitle = styled.p`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.muted};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media ${DeviceSize.sm} {
    grid-template-columns: 1fr;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormLabel = styled.label`
  font-size: 1.3rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
`;

const FormInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.875rem 1rem;
  font-size: 1.4rem;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${props => props.$hasError ? 'rgba(239, 68, 68, 0.5)' : props.theme.colors.border};
  border-radius: 8px;
  outline: none;
  transition: all 0.15s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.borderHover};
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

const FormTextarea = styled.textarea<{ $hasError?: boolean }>`
  width: 100%;
  min-height: 140px;
  padding: 0.875rem 1rem;
  font-size: 1.4rem;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${props => props.$hasError ? 'rgba(239, 68, 68, 0.5)' : props.theme.colors.border};
  border-radius: 8px;
  outline: none;
  resize: vertical;
  transition: all 0.15s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.borderHover};
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

const FormError = styled.span`
  font-size: 1.2rem;
  color: #ef4444;
`;

const RecaptchaContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const SubmitButton = styled(CustomButton)`
  width: 100%;
  margin-top: 0.5rem;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1.5rem;
`;

const LoadingText = styled.p`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const SuccessState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  gap: 1rem;
`;

const SuccessIcon = styled.div`
  width: 4rem;
  height: 4rem;
  color: #3CE38A;
  margin-bottom: 0.5rem;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const SuccessTitle = styled.h3`
  font-size: 2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const SuccessText = styled.p`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.secondary};
  max-width: 320px;
  margin-bottom: 1rem;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
  }
`;

const InfoIconContainer = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.secondary};
  flex-shrink: 0;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.div`
  font-size: 1.4rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
`;

const InfoDescription = styled.div`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 0.25rem;
`;

const QuickLinks = styled.div`
  margin-top: 1rem;
  padding: 1.25rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
`;

const QuickLinksTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
`;

const QuickLinksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const QuickLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 1.35rem;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const ArrowIcon = styled.span`
  width: 1rem;
  height: 1rem;
  color: ${({ theme }) => theme.colors.muted};

  svg {
    width: 100%;
    height: 100%;
  }
`;

const MapSection = styled.section`
  padding-bottom: 5rem;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};

  iframe {
    width: 100%;
    height: 100%;
    border: 0;
    filter: ${({ theme }) => theme.name === 'light' ? 'grayscale(100%) contrast(83%)' : 'grayscale(100%) invert(92%) contrast(83%)'};
  }

  @media ${DeviceSize.sm} {
    height: 300px;
  }
`;
