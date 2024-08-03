import React from "react";
import { Field, FieldArray, Formik } from "formik";
import styled from "styled-components";
import FileUploadDialogField from "../../../components/FileUploadDialogField";
import { useDocumentList } from "../../../features/documents/model/useDocumentList";
import BaseSlide, { StyledForm } from "./BaseSlide";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectCurrentUser } from "../../../features/auth/AuthSlice";
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
import RequireAuth from "../../../features/auth/RequireAuth";
import { Spinner } from "../../../components/Spinner";
import { SlideProps } from "../helpers/slide-types";
import { ButtonsContainer } from "../components/ButtonsContainer";
import { SlideButton } from "../components/SlideButton";
import { UserRoles } from "../../../features/auth/user-role.enum";
import DocumentsUploadSlide from "./DocumentsUploadSlide";
import { device } from "../../../utils/media-query-helpers";
import { setActiveState } from "../../../features/auth/ViewCarouselSlice";
import ExpectedActivitySlide from "./ExpectedActivitySlide";
import {
    EntityType,
    selectRegistrationType,
} from "../../../features/registration/RegistrationSlice";
import { CircleRegion, LeftButton } from "../../../components/Containers";
import IdentyInformationSlide from "./IdentyInformationSlide";
export default function DocumentsDialogSlide(props: SlideProps) {
    const documents = useDocumentList();
    const dispatch = useAppDispatch();

    const status = useAppSelector(selectDocumentsStatus);
    const error = useAppSelector(selectDocumentError);
    const entityType = useAppSelector(selectRegistrationType);
    const isBusinessRegistration = entityType === EntityType.Business;
    const data = useAppSelector(selectCurrentUser);
    const invitationFlag = data?.invitedBy ? true : false;
    return (
        <RequireAuth roles={UserRoles} key="documents-dialog-slide">
            <LeftButton>
                <CircleRegion>
                    <button
                        onClick={() => {
                            if (!invitationFlag) {
                                dispatch(setActiveState({ activeState: 2 }));
                                props.goToSlide(ExpectedActivitySlide);
                            } else {
                                dispatch(setActiveState({ activeState: 2 }));
                                props.goToSlide(IdentyInformationSlide);
                            }
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
                <SubHeader>
                    {isBusinessRegistration
                        ? "In order to complete your registration, please upload the following documents:"
                        : "We just need a couple of documents from you:"}
                </SubHeader>
                <Formik
                    initialValues={{
                        documents: documents.map(
                            (document): UserDocumentDto => ({
                                type: document.type,
                                uuid: "",
                                text:document.text
                            })
                        ),
                    }}
                    validationSchema={userDocumentsValidationSchema}
                    onSubmit={async (values) => {
                        dispatch(setDocumentsData(values));
                        await dispatch(submitUserDocuments()).unwrap();
                        props.goToSlide(DocumentsUploadSlide);
                    }}
                >
                   {({values, handleSubmit})=>(
                      <StyledForm>
                     <Container>
                     <FieldArray
                         name="documents"
                         render={(arrayHelpers) => {
                             return values.documents.map((document, index) => (
                                 <div key={index}>
                                     <FileUploadDialogField
                                         labelText={document.text || ''}
                                         name={`documents.${index}.uuid`}
                                         title=""
                                         upload="submit"
                                         uuid={document.uuid}
                                     />
                                     <Field
                                         type="hidden"
                                         name={`documents.${index}.type`}
                                         value={document.type}
                                     />
                                 </div>
                             ));
                         }}
                     />

                     <Note>
                         <span>
                             Note: Your registration will not be complete
                             until all required documentation has been
                             submitted and processed.
                         </span>
                     </Note>
                     {status === "error" ? (
                         <ErrorText>{error}</ErrorText>
                     ) : null}
                     </Container>
                     {status === "loading" ? (
                         <Spinner color="white"/>
                     ) : (
                         <ButtonsContainer>
                             <SlideButton secondary>Next</SlideButton>
                             <SlideButton
                                 bgrey
                                 type="button"
                                 onClick={() => {
                                     props.goToSlide(DocumentsUploadSlide);
                                 }}
                             >
                                 Submit later
                             </SlideButton>
                         </ButtonsContainer>
                     )}
                 </StyledForm>
                   )}
                </Formik>
            </BaseSlide>
        </RequireAuth>
    );
}
const Note = styled.p`
    text-align: left;
`;
export const SubHeader = styled.p`
    @media(${device.xs}) {
        background-color: white;
        margin-top: -20px;
        padding-top: 20px;
    }
    text-align: center;
    font-weight: bold;
`;

const ErrorText = styled.span`
    color: ${(props) => props.theme.colors.danger};
    padding: 3px 10px;
    font-size: 0.8em;
`;
export const Container = styled.div`
    @media ${device.xs} {
        background: white;
        // margin-top: -20px;
        padding: 25px;
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
    }
`