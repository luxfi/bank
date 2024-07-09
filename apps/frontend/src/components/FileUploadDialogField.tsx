import { useFormikContext } from "formik";
import React from "react";
import styled from "styled-components";
import { useAppDispatch } from "../app/hooks";
import { deleteUserDocuments, setCurrent, setDocumentsData, setUserDocuments, submitUserDocuments } from "../features/documents/DocumentsSlice";
import Button from "./Button";
import UploadDocumentModal from "./UploadDocumentModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { deleteDocument } from "../features/documents/DocumentsApi";

interface Props {
    labelText: string;
    name: string;
    title: string;
    upload?: string;
    uuid?: string
}

export default function FileUploadDialogField({ labelText, name, title, upload,uuid }: Props) {
    const [isOpen, setIsModalOpen] = React.useState(false);
    const [filename, setFilename] = React.useState('');

    const { setFieldValue } = useFormikContext();
    const dispatch = useAppDispatch();
    return <Conatiner>
    <Label>
        {labelText}
    </Label>
    {
        labelText==''?
        (
            
            <PhotoContainer>
                <UploadButtonContainer>
                    <Button primary type="button" onClick={() => setIsModalOpen(true)}>
                        Upload your photo
                    </Button>
                    <FileName>{filename}</FileName>
                </UploadButtonContainer>
            </PhotoContainer>
        ):
        (
            <FormContainer>
                <UploadButtonContainer>
                    <Button primary type="button" onClick={() => setIsModalOpen(true)}>
                        Upload document
                    </Button>
                    <FileName>{filename}</FileName>
                    {filename !== '' && uuid && <IconContainer>
                    <Icon  icon={faTrash} onClick={async ()=>{
                        await dispatch(deleteUserDocuments({ uuid }));
                        setFieldValue(name, '');
                        setFilename('');
                        }}/>
                    </IconContainer>
                    }
                </UploadButtonContainer>
            </FormContainer>
        )
    }
    
    <UploadDocumentModal
        isOpen={isOpen}
        onSubmit={async (submittedData) => {
            setIsModalOpen(false);
            if (submittedData === null) {
                setFieldValue(name, '');
                setFilename('');
            } else {
                setFieldValue(name, submittedData.uuid);
                setFilename(submittedData.filename);
                if(upload === 'direct') {
                    dispatch(setCurrent(title));
                    dispatch(setDocumentsData({documents: [{uuid: submittedData.uuid, type: title,text:labelText}]}));
                    await dispatch(submitUserDocuments()).unwrap();
                    dispatch(setUserDocuments({uuid: submittedData.uuid, type: title}));
                    dispatch(setCurrent(''));
                }
            }
        }}
    />
</Conatiner>;
}

const Conatiner = styled.div`
    display: flex;
    width: 100%;
    text-align: left;
    flex-direction: column;
    margin-bottom: 30px;
    font-size: 14px;
`;

const Label = styled.div`
margin: 5px;
`;

const FileName = styled.div`
margin: 5px;
font-size: 0.9em;
`;

const FormContainer = styled.div`
display: flex;
justify-content: space-between;
width: 100%;
align-items: center;
`;
const PhotoContainer = styled.div`
display: flex;
justify-content: center;
width: 100%;
align-items: center;
`;

const UploadButtonContainer = styled.div`
display: flex;
flex-direction: row;
align-items: center;
`;
const IconContainer = styled.div`
padding: 5px;
cursor: pointer;
`;
const Icon = styled(FontAwesomeIcon)`
font-weight: normal;
margin-right: 10px;
font-size: 18px;
color:'#FF0000';
cusror: pointer;
`;

