"use client";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  InputsContainer,
  MailListFormContainer,
  TextContainer,
} from "./styles";

import { NewsLetterJoin } from "@/api/forms";
import { Spin } from "antd";
import { useState } from "react";
import { CustomButton } from "../Button";
import Input from "../Input";
import { Recaptcha } from "../Recaptcha";
import Text from "../Text";

const formSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  r: yup.string().required("Please complete the reCAPTCHA"),
});

export default function MailListForm() {
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    validationSchema: formSchema,
    validateOnChange: false,
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      r: "",
    },
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      await NewsLetterJoin(values)
        .then(() => {
          setFeedbackMessage("Thank you for subscribing!");
          resetForm();
        })
        .catch((err) => {
          console.error(err);
          setFeedbackMessage(
            "This email cannot be added to this list. Please enter a different email address."
          );
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  return (
    <>
      <MailListFormContainer>
        <TextContainer>
          <Text variant="title">Stay in the loop</Text>
          <Text variant="body" color="rgba(255, 255, 255, 0.65)">
            Get the latest on stablecoin infrastructure, product updates, and market insights.
          </Text>
        </TextContainer>

        <InputsContainer
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}
        >
          <Input
            title="Email Address*"
            onChange={formik.handleChange("email")}
            value={formik.values.email}
            error={formik.errors.email}
            onFocus={() => setFeedbackMessage("")}
          />
          <Input
            title="First Name*"
            onChange={formik.handleChange("firstName")}
            value={formik.values.firstName}
            error={formik.errors.firstName}
            onFocus={() => setFeedbackMessage("")}
          />
          <Input
            title="Last Name*"
            onChange={formik.handleChange("lastName")}
            value={formik.values.lastName}
            error={formik.errors.lastName}
            onFocus={() => setFeedbackMessage("")}
          />

          <div>
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Spin />
              </div>
            ) : (
              formik.values.email &&
              formik.values.firstName &&
              formik.values.lastName && (
                <Recaptcha
                  error={formik.errors.r}
                  captchaToken={formik.handleChange("r")}
                />
              )
            )}
            {feedbackMessage && (
              <Text
                variant="body"
                color={feedbackMessage.includes("Thank you") ? "#22C55E" : "#FFFFFF"}
                style={{ fontWeight: "500", textAlign: "center" }}
              >
                {feedbackMessage}
              </Text>
            )}
          </div>

          <CustomButton type="submit">Subscribe</CustomButton>
        </InputsContainer>
      </MailListFormContainer>
    </>
  );
}
