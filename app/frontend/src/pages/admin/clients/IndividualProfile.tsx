import Button from "../../../components/Button";
import { Card, FlexContainer } from "../../../components/Card";
import { RowItem } from "../../../components/RowItem";
import { EditButton } from "../../../components/Button";
import { Form as F, Row, Typography } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal } from "../../../components/Modal";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect, useState } from "react";
import { personalTitles } from "../../../features/registration/model/personalTitles";
import { genders } from "../../../features/registration/model/genders";
import { countries } from "../../../features/registration/model/countries";
import { identificationTypes } from "../../../features/registration/model/identificationTypes";
import {
    selectAdminClientIndividualMetadata,
    fetchAdminClient,
    selectAdminClientBankMetadata,
    setAdminClientIndividualMetaData,
    setSelectedClientUserData,
    setAdminClientBankMetadata,
    submitAdminClient,
    submitAdminClientMetadata,
    submitAdminClientBankMetadata,
    selectAdminClientBrokers,
    setAdminClientBrokers,
    submitAdminClientBrokers,
    setAdminClientFeeStructure,
    submitAdminClientFeeStructure,
    submitAdminClientLinkedUserData,
    updateAdminClientLinkedUserData,
} from "../../../features/admin-clients/AdminClientsSlice";
import { EntityType } from "../../../features/registration/RegistrationSlice";
import {
    openNotification,
    openErrorNotification,
} from "../../../components/Notifications";
import moment from "moment";
import { currencies } from "../../../features/beneficiaries/model/currencies";
import { yesOrNo } from "../../../utils/select-options";
import { ResetPasswordModal } from "../../../components/ResetPasswordModal";
import { ButtonContainer } from "../../dashboard/components/Containers";
import { ProfileModalForm } from "./ProfileModalForm";
import { ClientFeeStructure } from "./components/ClientFeeStructure";
import { ClientBrokersList } from "./components/ClientBrokersList";
import { ClientLinkedUsers } from "./components/ClientLinkedUsers";
import styled from "styled-components";
import { useParams } from "react-router-dom";
const { Text } = Typography;
const Form = styled<any>(F)`
    .ant-form-item-label {
        white-space: pre-wrap;
    }
`;
export const IndividualProfile = ({ client, uuid }: any) => {
    const metaData = useAppSelector(selectAdminClientIndividualMetadata);
    const bankData = useAppSelector(selectAdminClientBankMetadata);
    const { client_id } = useParams();

    let dt = metaData.dateOfBirth;
    let dateString = "";
    if (dt) {
        dt = new Date(dt);
        dateString = dt.toISOString().split("T")[0];
    }
    const PersonalDetails = [
        {
            name: "title",
            label: "Title",
            text: metaData.title,
            type: "select",
            options: personalTitles,
        },
        {
            name: "fullName",
            label: "Full name",
            text: metaData.firstname + " " + metaData.lastname,
        },
        {
            name: "formerName",
            label: "Former names",
            text: metaData.formerName,
        },
        {
            name: "otherName",
            label: "Other names",
            text: metaData.otherName,
        },
        {
            name: "dateOfBirth",
            label: "DOB",
            text: dateString ? dateString : "",
            type: "date",
            rules: [
                { required: true, message: "This is a required field." },
                () => ({
                    validator(_: any, value: any) {
                        if (
                            !value ||
                            moment(new Date()).subtract(18, "y").unix() >
                                moment(value).unix()
                        ) {
                            return Promise.resolve();
                        }
                        return Promise.reject(
                            new Error("Must be at least 18 years old!")
                        );
                    },
                }),
            ],
        },
        {
            name: "placeOfBirth",
            label: "Place of Birth",
            text: metaData.placeOfBirth,
        },
        { name: "email", label: "Email", text: client.email },
        {
            name: "verifiedAt",
            label: "Email Verified",
            text: client.verifiedAt ? "Yes" : "No",
            type: "select",
            options: yesOrNo,
        },
        { name: "mobileNumber", label: "Tel No.", text: client.mobileNumber },
        {
            name: "country",
            label: "Country",
            text: client.country,
            type: "select",
            search: true,
            options: countries,
            rules: [{ required: true, message: "This is a required field." }],
        },
        {
            name: "nationality",
            label: "Nationality",
            text: metaData.nationality,
            type: "select",
            search: true,
            options: countries,
            // rules: [{required: true, message: 'This is a required field.'}],
        },
        {
            name: "gender",
            label: "Gender",
            text: metaData.gender,
            type: "select",
            options: genders,
        },
    ];
    const Address = [
        {
            name: "addressLine1",
            label: "Address Line 1",
            text: metaData.addressLine1,
            rules: [{ required: true, message: "Please enter Address Line 1" }],
        },
        {
            name: "addressLine2",
            label: "Address Line 2",
            text: metaData.addressLine2,
        },
        {
            name: "city",
            label: "City",
            text: metaData.city,
            rules: [{ required: true, message: "Please enter the City" }],
        },
        {
            name: "postcode",
            label: "Zip code/Post code",
            text: metaData.postcode,
            rules: [
                {
                    required: true,
                    message: "Please enter the Zip code/Post code",
                },
            ],
        },
        {
            name: "state",
            label: "State/County",
            text: metaData.state,
            rules: [{ required: true, message: "Please enter State/Country" }],
        },
        {
            name: "country",
            label: "Country",
            text: metaData.country,
            type: "select",
            options: countries,
            search: true,
            rules: [{ required: true, message: "Please enter the country" }],
        },
        {
            name: "previousAddressLine1",
            label: "Previous Address Line 1",
            text: metaData.previousAddressLine1,
        },
        {
            name: "previousAddressLine2",
            label: "Previous Address Line 2",
            text: metaData.previousAddressLine2,
        },
        {
            name: "previousCity",
            label: "Previous City",
            text: metaData.previousCity,
        },
        {
            name: "previousPostcode",
            label: "Previous Zip Code/Post code",
            text: metaData.previousPostcode,
        },
        {
            name: "previousState",
            label: "Previous State/County",
            text: metaData.previousState,
        },
        {
            name: "previousCountry",
            label: "Previous Country",
            text: metaData.previousCountry,
            type: "select",
            options: countries,
            search: true,
        },
    ];
    const EmploymentDetails = [
        { name: "occupation", label: "Occupation", text: metaData.occupation },
        {
            name: "employerName",
            label: "Employer Name",
            text: metaData.employerName,
        },
        {
            name: "employerAddress1",
            label: "Employer Address 1",
            text: metaData.employerAddress1,
        },
        {
            name: "employerAddress2",
            label: "Employer Address 2",
            text: metaData.employerAddress2,
        },
        {
            name: "employerAddress3",
            label: "Employer Address 3",
            text: metaData.employerAddress3,
        },
    ];
    const bankAccountDetails = [
        { name: "bankName", label: "Name of bank", text: bankData.bankName },
        { name: "branch", label: "Branch", text: bankData.branch },
        {
            name: "accountHolderName",
            label: "Account Holder",
            text: bankData.accountHolderName,
        },
        {
            name: "bankCountry",
            label: "Bank country",
            text: bankData.bankCountry,
            type: "select",
            options: countries,
            search: true,
        },
        {
            name: "currency",
            label: "Account currency",
            text: bankData.currency,
            type: "select",
            options: currencies,
            search: true,
        },
        { name: "sortCode", label: "Sort code", text: bankData.sortCode },
        {
            name: "accountNumber",
            label: "Account Number",
            text: bankData.accountNumber,
        },
        { name: "IBAN", label: "IBAN", text: bankData.IBAN },
        { name: "bicSwift", label: "BIC", text: bankData.bicSwift },
    ];
    const OtherDetails = [
        {
            name: "publicPosition",
            label: "Public positions held",
            text: metaData.publicPosition,
        },
        {
            name: "highProfilePosition",
            label: "High profile position held",
            text: metaData.highProfilePosition,
        },
    ];
    const ID = [
        {
            name: "identificationType",
            label: "Identification type",
            text: metaData.identificationType,
            type: "select",
            options: identificationTypes,
        },
        {
            name: "identificationNumber",
            label: "Identification number",
            text: metaData.identificationNumber,
        },
    ];
    const brokers = useAppSelector(selectAdminClientBrokers);
    const [modalData, setModalData] = useState({
        url: "",
        title: "",
        fields: [],
        uuid: "",
        isModalVisible: false,
    });
    const [isResetModalVisible, showResetModal] = useState(false);
    const ModalFunc = [isResetModalVisible, showResetModal];
    const numberOfBrokers = brokers.length;
    const addBroker = () => {
        const newBroker = {
            name: "",
            address: "",
            kyc: "",
            client: "",
            percentageSplit: undefined,
            payment: "",
            bankAccount: "",
            contract: "",
            comment: "",
        };
        dispatch(
            setAdminClientBrokers({ index: numberOfBrokers, broker: newBroker })
        );
    };
    const { confirm } = Modal;
    const remove = (title: string, onOk: Function, index: number) => {
        confirm({
            title: "Delete",
            icon: <ExclamationCircleOutlined />,
            content: "Are you sure you want to remove this item?",
            onOk() {
                return new Promise((resolve, reject) => {
                    onOk(index)
                        .then(() => resolve("Finished"))
                        .catch(() => reject("Error"));
                });
            },
            onCancel() {},
        });
    };
    const handleCancel = () => {
        setModalData({
            url: "",
            title: "",
            fields: [],
            uuid: "",
            isModalVisible: false,
        });
    };
    const createModal = (data: any) => {
        setModalData({
            ...data,
            isModalVisible: true,
        });
    };
    const dispatch = useAppDispatch();
    const updateProfile = async (profileData: any) => {
        const data = profileData.data;
        let metaData = {},
            clientData = {},
            bankData = {};
        switch (profileData.title) {
            case "Personal Details":
                metaData = {
                    title: data.title,
                    firstname: data.fullName.split(" ").slice(0, -1).join(" "),
                    lastname: data.fullName.split(" ").slice(-1).join(" "),
                    formerName: data.formerName,
                    otherName: data.otherName,
                    dateOfBirth: data.dateOfBirth,
                    placeOfBirth: data.placeOfBirth,
                    gender: data.gender,
                    nationality: data.nationality,
                    country: data.country,
                };
                if (!data.dateOfBirth) {
                    openErrorNotification(
                        "Date of Birth",
                        "Date of birth is a required field. Please input a valid date."
                    );
                    break;
                }
                clientData = {
                    firstname: data.fullName.split(" ").slice(0, -1).join(" "),
                    lastname: data.fullName.split(" ").slice(-1).join(" "),
                    email: data.email,
                    mobileNumber: data.mobileNumber,
                    country: data.country,
                    verifiedAt: data.verifiedAt,
                };
                dispatch(setAdminClientIndividualMetaData(metaData));
                dispatch(setSelectedClientUserData(clientData));
                try {
                    await dispatch(
                        submitAdminClientMetadata({
                            uuid: profileData.uuid,
                            entityType: EntityType.Individual,
                            clientId: client_id || "",
                        })
                    ).unwrap();
                    dispatch(
                        fetchAdminClient({ uuid: uuid, clientId: client_id })
                    );
                    await dispatch(
                        submitAdminClient({ uuid: profileData.uuid })
                    ).unwrap();
                    handleCancel();
                    openNotification(
                        "Personal Details",
                        "Personal details have been updated successfully!"
                    );
                } catch (error: any) {
                    await dispatch(
                        fetchAdminClient({ uuid: profileData.uuid })
                    ).unwrap();
                    handleCancel();
                    openErrorNotification(
                        "Personal Details",
                        error.message || "Sorry, something went wrong."
                    );
                }
                break;
            case "Address":
            case "Employment Details":
            case "Other":
            case "ID":
                metaData = data;
                dispatch(setAdminClientIndividualMetaData(metaData));
                try {
                    await dispatch(
                        submitAdminClientMetadata({
                            uuid: profileData.uuid,
                            entityType: EntityType.Individual,
                            clientId: client_id || "",
                        })
                    ).unwrap();
                    openNotification(
                        profileData.title,
                        profileData.title.split(" ")[0] +
                            " details have been updated successfully!"
                    );
                    handleCancel();
                } catch (error: any) {
                    await dispatch(
                        fetchAdminClient({ uuid: profileData.uuid })
                    ).unwrap();
                    openErrorNotification(
                        profileData.title,
                        error.message || "Sorry, something went wrong."
                    );
                    handleCancel();
                }
                break;
            case "Bank Account Details":
                bankData = data;
                dispatch(setAdminClientBankMetadata(bankData));
                try {
                    await dispatch(
                        submitAdminClientBankMetadata({
                            uuid: profileData.uuid,
                            entityType: EntityType.Individual,
                            clientId: client_id || "",
                        })
                    ).unwrap();
                    dispatch(
                        fetchAdminClient({ uuid: uuid, clientId: client_id })
                    );
                    openNotification(
                        "Bank Account Details",
                        "Bank account details have been updated successfully!"
                    );
                    handleCancel();
                } catch (error: any) {
                    await dispatch(
                        fetchAdminClient({ uuid: profileData.uuid })
                    ).unwrap();
                    openErrorNotification(
                        "Bank Account Details",
                        error.message ||
                            "Sorry, the bank details could not be validated."
                    );
                    //handleCancel();
                }
                break;
            case "Broker Details":
                let brokerData = data;
                dispatch(
                    setAdminClientBrokers({
                        index: profileData.url,
                        broker: brokerData,
                    })
                );
                try {
                    await dispatch(
                        submitAdminClientBrokers({
                            uuid: profileData.uuid,
                            entityType: EntityType.Individual,
                        })
                    ).unwrap();
                    openNotification(
                        "Brokers Details",
                        "Brokers have been updated successfully!"
                    );
                    handleCancel();
                } catch (error: any) {
                    await dispatch(
                        fetchAdminClient({ uuid: profileData.uuid })
                    ).unwrap();
                    openErrorNotification(
                        "Broker Details",
                        error.message
                            ? error.message
                            : "Sorry, something went wrong."
                    );
                    handleCancel();
                }
                break;
            case "Linked User Details":
                if (
                    !data.firstname ||
                    !data.lastname ||
                    !data.email ||
                    !(data.password === data.confirmPassword)
                ) {
                    openErrorNotification(
                        profileData.title,
                        "Please input the details correctly."
                    );
                    break;
                }
                try {
                    await dispatch(
                        updateAdminClientLinkedUserData({
                            data: data,
                            uuid: profileData.data.uuid,
                            clientId: client_id,
                        })
                    ).unwrap();
                    dispatch(
                        fetchAdminClient({ uuid: uuid, clientId: client_id })
                    );
                    openNotification(
                        profileData.title,
                        profileData.title + " have been updated successfully!"
                    );
                    handleCancel();
                } catch (error) {
                    openErrorNotification(
                        profileData.title,
                        "Sorry, something went wrong."
                    );
                    handleCancel();
                }
                break;
            case "Fee Structure":
                let feeData = data;
                dispatch(setAdminClientFeeStructure(feeData));
                try {
                    await dispatch(
                        submitAdminClientFeeStructure({
                            uuid: profileData.uuid,
                        })
                    ).unwrap();
                    openNotification(
                        "Fee Structure",
                        "Fee Structure has been updated successfully!"
                    );
                    handleCancel();
                } catch (error: any) {
                    await dispatch(
                        fetchAdminClient({ uuid: profileData.uuid })
                    ).unwrap();
                    openErrorNotification(
                        "Fee Structure",
                        error.message
                            ? error.message
                            : "Sorry, something went wrong."
                    );
                    handleCancel();
                }
                break;
            default:
                openErrorNotification(
                    "Save Details Error",
                    `${profileData.title} Not implemented`
                );
        }
    };
    return (
        <FlexContainer>
            <Card title="Personal Details">
                {PersonalDetails.map((detail, index) => (
                    <RowItem
                        key={index}
                        label={detail.label}
                        text={detail.text}
                        odd={index % 2 === 1 ? "even" : "odd"}
                    />
                ))}
                <Row>
                    <Button
                        secondary
                        size="long"
                        margin="10px"
                        style={{ marginRight: "15px" }}
                        onClick={() => showResetModal(true)}
                    >
                        Reset password
                    </Button>
                </Row>
                <ButtonContainer>
                    <EditButton
                        secondary
                        size="small"
                        onClick={() =>
                            createModal({
                                url: "personal-details",
                                title: "Personal Details",
                                fields: PersonalDetails,
                            })
                        }
                    >
                        Edit
                    </EditButton>
                </ButtonContainer>
            </Card>
            <ClientLinkedUsers createModal={createModal} remove={remove} />
            <Card title="Address">
                {Address.map((detail, index) => (
                    <RowItem
                        key={index}
                        label={detail.label}
                        text={detail.text}
                        odd={index % 2 === 1 ? "even" : "odd"}
                    />
                ))}
                <ButtonContainer>
                    <EditButton
                        secondary
                        size="small"
                        onClick={() =>
                            createModal({
                                url: "address",
                                title: "Address",
                                fields: Address,
                            })
                        }
                    >
                        Edit
                    </EditButton>
                </ButtonContainer>
            </Card>
            <Card title="Employment Details">
                {EmploymentDetails.map((detail, index) => (
                    <RowItem
                        key={index}
                        label={detail.label}
                        text={detail.text}
                        odd={index % 2 === 1 ? "even" : "odd"}
                    />
                ))}
                <ButtonContainer>
                    <EditButton
                        secondary
                        size="small"
                        onClick={() =>
                            createModal({
                                url: "employment-details",
                                title: "Employment Details",
                                fields: EmploymentDetails,
                            })
                        }
                    >
                        Edit
                    </EditButton>
                </ButtonContainer>
            </Card>
            <Card title="Bank Account Details">
                {bankAccountDetails.map((detail, index) => (
                    <RowItem
                        key={index}
                        label={detail.label}
                        text={detail.text}
                        odd={index % 2 === 1 ? "even" : "odd"}
                    />
                ))}
                <ButtonContainer>
                    <EditButton
                        secondary
                        size="small"
                        onClick={() =>
                            createModal({
                                url: "bank-details",
                                title: "Bank Account Details",
                                fields: bankAccountDetails,
                            })
                        }
                    >
                        Edit
                    </EditButton>
                </ButtonContainer>
            </Card>
            <Card title="Other">
                {OtherDetails.map((detail, index) => (
                    <RowItem
                        key={index}
                        label={detail.label}
                        text={detail.text}
                        odd={index % 2 === 1 ? "even" : "odd"}
                    />
                ))}
                <ButtonContainer>
                    <EditButton
                        secondary
                        size="small"
                        onClick={() =>
                            createModal({
                                url: "other-details",
                                title: "Other",
                                fields: OtherDetails,
                            })
                        }
                    >
                        Edit
                    </EditButton>
                </ButtonContainer>
            </Card>
            <Card title="ID">
                {ID.map((detail, index) => (
                    <RowItem
                        key={index}
                        label={detail.label}
                        text={
                            !detail?.options
                                ? detail.text
                                : detail.options?.get(detail.text || "") ||
                                  detail.text
                        }
                        odd={index % 2 === 1 ? "even" : "odd"}
                    />
                ))}
                <ButtonContainer>
                    <EditButton
                        secondary
                        size="small"
                        onClick={() =>
                            createModal({
                                url: "id-details",
                                title: "ID",
                                fields: ID,
                            })
                        }
                    >
                        Edit
                    </EditButton>
                </ButtonContainer>
            </Card>
            <Form.Item
                label="Number of Brokers"
                style={{
                    marginBottom: "5px",
                    marginLeft: "15px",
                    alignItems: "baseline",
                }}
            >
                <Text style={{ width: "50px", marginRight: "15px" }}>
                    {numberOfBrokers}
                </Text>
                <Button secondary size="small" onClick={addBroker}>
                    Add a Broker
                </Button>
            </Form.Item>
            <ClientBrokersList createModal={createModal} remove={remove} />
            <ClientFeeStructure createModal={createModal} />
            <ProfileModalForm
                modalData={modalData}
                handleCancel={handleCancel}
                updateProfile={updateProfile}
            />
            <ResetPasswordModal uuid={uuid} ModalFunc={ModalFunc} />
        </FlexContainer>
    );
};
