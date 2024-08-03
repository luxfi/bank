import {
    faCircleCheck,
    faCircleXmark,
    faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field, FieldArray, Form, Formik } from "formik";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Button from "../../../components/Button";
import FileUploadDialogField from "../../../components/FileUploadDialogField";
import { Progress } from "../../../components/Spinner";
import { selectCurrentUser } from "../../../features/auth/AuthSlice";
import RequireAuth from "../../../features/auth/RequireAuth";
import { UserRoles } from "../../../features/auth/user-role.enum";
import {
    loadUserDocuments,
    selectDocumentError,
    selectDocumentsStatus,
    selectUserDocuments,
    setDocumentsData,
    submitUserDocuments,
    selectCurrent,
} from "../../../features/documents/DocumentsSlice";
import { DocumentType } from "../../../features/documents/model/DocumentType.enum";
import { useDocumentList } from "../../../features/documents/model/useDocumentList";
import {
    UserDocumentDto,
    userDocumentsValidationSchema,
} from "../../../features/documents/model/userDocumentsValidationSchema";
import { device } from "../../../utils/media-query-helpers";
import DashboardLayout from "../components/DashboardLayout";

const getStatus = (documents: any[], type: DocumentType): boolean => {
    for (const document of documents) {
        if (document.type === type) {
            return true;
        }
    }

    return false;
};

export default function Documents() {
    const documents = useDocumentList();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const status = useAppSelector(selectDocumentsStatus);
    const error = useAppSelector(selectDocumentError);
    const current = useAppSelector(selectCurrent);
    const userDocuments = useAppSelector(selectUserDocuments);

    const currentUser = useAppSelector(selectCurrentUser);

    useEffect(() => {
        dispatch(loadUserDocuments());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser?.uuid]);

    return (
        <RequireAuth roles={UserRoles}>
            <DashboardLayout>
                <SubHeader>
                    In order to complete your registration, please upload the
                    following documents:
                </SubHeader>
                <Formik
                    initialValues={{
                        documents: documents.map(
                            (document): UserDocumentDto => ({
                                type: document.type,
                                uuid: "",
                                text: document.text || "",
                            })
                        ),
                    }}
                    validationSchema={userDocumentsValidationSchema}
                    onSubmit={async (values) => {
                        // dispatch(setDocumentsData(values));
                        // await dispatch(submitUserDocuments()).unwrap();
                        // navigate('/dashboard');
                    }}
                >
                    {({ values }) => (
                        <Form>
                            <FieldArray
                                name="documents"
                                render={(arrayHelpers) => {
                                    return values.documents.map((document, index) => (
                                        <Row key={index}>
                                            {current === document.type &&
                                            status === "loading" ? (
                                                <Progress icon={faSpinner} />
                                            ) : getStatus(
                                                  userDocuments,
                                                  (document.type as DocumentType)
                                              ) ? (
                                                <Approved
                                                    icon={faCircleCheck}
                                                />
                                            ) : (
                                                <Declined
                                                    icon={faCircleXmark}
                                                />
                                            )}

                                            <FileUploadDialogField
                                                labelText={document.text as string}
                                                name={`documents.${index}.uuid`}
                                                title={document.type as string}
                                                upload="direct"
                                                uuid={document.uuid}
                                            />
                                            <Field
                                                type="hidden"
                                                name={`documents.${index}.type`}
                                                value={document.type}
                                            />
                                        </Row>
                                    ));
                                }}
                            />

                            {status === "error" ? (
                                <ErrorText>{error}</ErrorText>
                            ) : null}

                            {
                                <ButtonsContainer>
                                    <BackButton
                                        disabled={
                                            status === "loading" ? true : false
                                        }
                                        sky
                                        onClick={() => navigate("/dashboard")}
                                    >
                                        Go Back
                                    </BackButton>
                                </ButtonsContainer>
                            }
                        </Form>
                    )}
                </Formik>
            </DashboardLayout>
        </RequireAuth>
    );
}

const BackButton = styled(Button)`
    @media ${device.xs} {
        width: auto;
    }
`;
const SubHeader = styled.p`
    text-align: left;
    font-weight: bold;
`;

const ButtonsContainer = styled.div`
    @media ${device.sm} {
        flex-direction: row;
    }

    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: stretch;
    padding: 30px;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
`;

const ErrorText = styled.span`
    color: ${(props) => props.theme.colors.danger};
    padding: 3px 10px;
    font-size: 0.8em;
`;

const Approved = styled(FontAwesomeIcon)`
    color: ${(props) => props.theme.colors.success};
    font-size: 2em;
    padding: 10px 20px;
`;

const Declined = styled(FontAwesomeIcon)`
    color: ${(props) => props.theme.colors.danger};
    font-size: 2em;
    padding: 10px 20px;
`;
