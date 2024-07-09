import styled from "styled-components";
import Modal from "react-modal";
import { useDropzone } from 'react-dropzone';
import * as yup from 'yup';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { Form, Formik } from "formik";
import { device } from "../utils/media-query-helpers";
import Button from "./Button";
import React from "react";
import { uploadDocument } from "../features/documents/DocumentsApi";
import { Spinner } from "./Spinner";

export default function UploadDocumentModal(props: Props) {
    const [file, setFile] = React.useState<File | null>(null);
    const [error, setError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles[0]) {
            setFile(acceptedFiles[0]);
            setError('');
        } else {
            setError("No file was selected.");
        }
    };
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true });

    const initialValues = {
        file: null,
    };

    const validationSchema = yup.object({
        file: yup.mixed(),
    });

    return (
        <Modal
            isOpen={props.isOpen}
            style={{ overlay: { zIndex: 99999999 } }}
            ariaHideApp={false}
        >
            <Formik
                validationSchema={validationSchema}
                initialValues={initialValues}
                onSubmit={async (values) => {
                    if (!file) {
                        return props.onSubmit(null);
                    }

                    setIsLoading(true);
                    try {
                        const document = await uploadDocument(file);

                        props.onSubmit({
                            uuid: document.uuid,
                            filename: file.name,
                        });
                    } catch (err) { }

                    setIsLoading(false);
                }}
            >
                <Container>
                    <Dropzone {...getRootProps()}>
                        <input name="file" {...getInputProps()} />
                        {
                            isDragActive
                                ? <><Icon icon={faUpload} /> Drop the files here...</>
                                : (
                                    file
                                        ? `Selected File: ${file.name}`
                                        : <><Icon icon={faUpload} /> Click to select files or drag & drop to upload.</>
                                )
                        }
                    </Dropzone>

                    <ErrorText>{error}</ErrorText>

                    {
                        isLoading
                            ? <Spinner />
                            : <ButtonsContainer>
                                <Button primary type="submit">Submit</Button>
                                <Button type="button" onClick={() => props.onSubmit(null)}>Cancel</Button>
                            </ButtonsContainer>
                    }
                </Container>
            </Formik>
        </Modal>
    );
}

type OnSubmit = (submittedData: { uuid: string, filename: string } | null) => void;
interface Props {
    onSubmit: OnSubmit;
    isOpen: boolean;
};

const Container = styled(Form)`
display: flex;
width: 100%;
padding: 50px;
flex-direction: column;
justify-content: center;
align-items: center;
box-sizing: border-box;
`;

const Dropzone = styled.div`
width: 80%;
cursor: pointer;
box-sizing: border-box;
border: dashed 2px ${(props) => props.theme.colors.fg};
padding: 50px 30px;
`;

const Icon = styled(FontAwesomeIcon)`
padding: 0px 10px;
`;

const ButtonsContainer = styled.div`
@media ${device.sm} {
    flex-direction: row;
    align-items: flex-end;
    justify-content: flex-end;
}

display: flex;
flex-direction: column;
width: 80%;
margin-top: 30px;
justify-content: space-around;
`;

const ErrorText = styled.span`
    color: ${props => props.theme.colors.danger};
    padding: 3px 10px;
    font-size: 0.8em;
`;
