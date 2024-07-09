import React, { useEffect, useState } from "react";
import { Field, FieldArray, Form, Formik } from "formik";
import styled from "styled-components";
import FileUploadDialogField from "../../../components/FileUploadDialogField";
import BaseSlide from "./BaseSlide";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
    UserDocumentDto,
    userDocumentsValidationSchema,
} from "../../../features/documents/model/userDocumentsValidationSchema";
import {
    selectDocumentError,
    selectDocumentsStatus,
    setDocumentsData,
    submitUserDocuments,
} from "../../../features/documents/DocumentsSlice";
import { Spinner } from "../../../components/Spinner";
import { useNavigate } from "react-router-dom";
import { SlideProps } from "../helpers/slide-types";
import { ButtonsContainer } from "../components/ButtonsContainer";
import { SlideButton } from "../components/SlideButton";
import { setActiveState } from "../../../features/auth/ViewCarouselSlice";
import DocumentsDialogSlide, {
    SubHeader,
    Container,
} from "./DocumentsDialogSlide";
import { CircleRegion, LeftButton } from "../../../components/Containers";
export default function DocumentsUploadSlide(props: SlideProps) {
    const documents = [{ type: "profile_photo", text: "", uuid: "" }];
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const status = useAppSelector(selectDocumentsStatus);
    const error = useAppSelector(selectDocumentError);
    return (
        <>
            <LeftButton>
                <CircleRegion>
                    <button
                        onClick={() => {
                            dispatch(setActiveState({ activeState: 2 }));
                            props.goToSlide(DocumentsDialogSlide);
                        }}
                        style={{
                            border: "none",
                            borderRadius: "50%",
                            cursor: "pointer",
                            position: "relative",
                            paddingTop: "9px",
                        }}
                    >
                        <img
                            src={`${process.env.PUBLIC_URL}/images/larrow.svg`}
                            alt="Prev"
                        />
                    </button>
                </CircleRegion>
            </LeftButton>
            <BaseSlide
                key="documents-upload-slide"
                title="Verify your identity"
            >
                <SubHeader style={{ marginBottom: "20px" }} >
                    Submit your photo
                </SubHeader>
                <FullCircleRegion />
                <Formik
                    initialValues={{
                        documents: documents.map(
                            (document): UserDocumentDto => ({
                                type: document.type,
                                uuid: "",
                                text: document.text
                            })
                        ),
                    }}
                    validationSchema={userDocumentsValidationSchema}
                    onSubmit={async (values) => {
                        dispatch(setDocumentsData(values));
                        await dispatch(submitUserDocuments()).unwrap();
                        navigate("/registration/thanks");
                    }}
                >
                    {({values , handleSubmit}) => (
                        <Form onSubmit={handleSubmit}>
                            <Container>
                                <FieldArray
                                    name="documents"
                                    render={(arrayHelpers) => {
                                        return documents.map(
                                            (document, index) => (
                                                <div key={index}>
                                                    <FileUploadDialogField
                                                        labelText=""
                                                        name={`documents.${index}.uuid`}
                                                        title={document.type}
                                                        upload="submit"
                                                        uuid={document.uuid}
                                                    />
                                                    <Field
                                                        type="hidden"
                                                        name={`documents.${index}.type`}
                                                        value={document.type}
                                                    />
                                                </div>
                                            )
                                        );
                                    }}
                                />

                                {status === "error" ? (
                                    <ErrorText>{error}</ErrorText>
                                ) : null}
                            </Container>
                            {status === "loading" ? (
                                <Spinner color="white" />
                            ) : (
                                <ButtonsContainer>
                                    <SlideButton secondary>Next</SlideButton>
                                    <SlideButton
                                        bgrey
                                        type="button"
                                        onClick={() => {
                                            navigate("/registration/thanks");
                                        }}
                                    >
                                        Submit later
                                    </SlideButton>
                                </ButtonsContainer>
                            )}
                        </Form>
                    )}
                </Formik>
            </BaseSlide>
        </>
    );
}
const Note = styled.p`
    text-align: left;
`;

const ErrorText = styled.span`
    color: ${(props) => props.theme.colors.danger};
    padding: 3px 10px;
    font-size: 0.8em;
`;

const FullCircleRegion = styled.div`
    width: 136px;
    height: 136px;
    border-radius: 100%;
    margin: 0 auto;
    background-color: ${(props) => props.theme.colors.bgrey};
    background: url(${process.env.PUBLIC_URL}/images/defaultuser.png) no-repeat
        center !important;
`;
