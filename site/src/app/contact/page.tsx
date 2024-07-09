"use client";
import { useState } from "react";

import { CustomButton } from "@/components/Button";
import Input from "@/components/Input";
import { Recaptcha } from "@/components/Recaptcha";
import Text from "@/components/Text";

import { Spin } from "antd";
import { useFormik } from "formik";
import * as yup from "yup";

import { ContactSubmit } from "@/api/forms";

import {
  CardContainer,
  Form,
  FullHeight,
  MainContainer,
  TextContainer,
} from "./styles";

const formSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  message: yup.string().required("Message is required"),
  r: yup.string().required("Please complete the reCAPTCHA"),
});
export default function Contact() {
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS;

  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    validationSchema: formSchema,
    validateOnChange: false,
    initialValues: {
      name: "",
      email: "",
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
    <MainContainer>
      <CardContainer>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}
        >
          <Text variant="title" color="#1E3456">
            Contact us - CDAX
          </Text>
          <Text variant="body" color="#516686">
            Let&apos;s get this conversation stared. Tell us a bit about
            yourself, and we&apos;ll get it in touch as soon as we can.
          </Text>
          {loading ? (
            <FullHeight>
              <Spin size="large" />
            </FullHeight>
          ) : emailSent ? (
            <FullHeight>
              <Text variant="title" color="#1E3456">
                Thank you.
              </Text>
              <Text variant="body">We&apos;ll be in touch shortly!</Text>
            </FullHeight>
          ) : (
            <>
              <Input
                title="Full Name*"
                onChange={formik.handleChange("name")}
                value={formik.values.name}
                error={formik.errors.name}
              />
              <Input
                title="Email*"
                onChange={formik.handleChange("email")}
                value={formik.values.email}
                error={formik.errors.email}
              />
              <Input
                type="textarea"
                title="Your Message*"
                onChange={formik.handleChange("message")}
                value={formik.values.message}
                error={formik.errors.message}
              />
              {formik.values.email &&
                formik.values.name &&
                formik.values.message && (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Recaptcha
                      error={formik.errors.r}
                      captchaToken={formik.handleChange("r")}
                    />
                  </div>
                )}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CustomButton type="submit">Submit</CustomButton>
              </div>
            </>
          )}
          <TextContainer>
            <div>
              <Text variant="body">Email us on: </Text>
              <Text variant="body_lg" color="#1E3456">
                hello@cdaxforex.com
              </Text>
            </div>
            <div>
              <Text variant="body">Or call us on: </Text>
              <Text variant="body_lg" color="#1E3456">
                +44 (0) 1624 682070
              </Text>
            </div>
          </TextContainer>
        </Form>
      </CardContainer>
      <CardContainer>
        <iframe
          className="map"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          src={`https://www.google.com/maps/embed/v1/place?q=place_id:ChIJ_ZFpDBSFY0gRq-SdCtluT10&key=${mapsApiKey}&language=en&zoom=18`}
        />
      </CardContainer>
    </MainContainer>
  );
}
