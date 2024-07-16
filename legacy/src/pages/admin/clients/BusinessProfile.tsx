import Button from "../../../components/Button";
import { Card, FlexContainer } from "../../../components/Card";
import { RowItem } from "../../../components/RowItem";
import styled from "styled-components";
import { EditButton } from "../../../components/Button";
import { Form as F, Typography, Row, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useState } from "react";
import { countries } from "../../../features/registration/model/countries";
import { businessRoles } from "../../../features/registration/model/businessRoles";
import {
    selectAdminClientExpectedSpending,
    fetchAdminClient,
    selectAdminClientBankMetadata,
    setSelectedClientUserData,
    setAdminClientBankMetadata,
    submitAdminClient,
    submitAdminClientMetadata,
    submitAdminClientBankMetadata,
    setAdminClientBusinessMetaData,
    selectAdminClientDirectors,
    setAdminClientDirectors,
    setAdminClientBrokers,
    submitAdminClientBrokers,
    submitAdminClientDirectors,
    selectAdminClientShareholders,
    setAdminClientShareholders,
    submitAdminClientShareholders,
    setAdminClientSpending,
    submitAdminClientSpendingData,
    selectAdminClientBrokers,
    submitAdminClientLinkedUserData,
    setAdminClientFeeStructure,
    submitAdminClientFeeStructure,
    updateAdminClientLinkedUserData,
} from "../../../features/admin-clients/AdminClientsSlice";
import { EntityType } from "../../../features/registration/RegistrationSlice";
import {
    openNotification,
    openErrorNotification,
} from "../../../components/Notifications";

import { currencies } from "../../../features/beneficiaries/model/currencies";
import { yesOrNo } from "../../../utils/select-options";
import { ResetPasswordModal } from "../../../components/ResetPasswordModal";
import { ProfileModalForm } from "./ProfileModalForm";
import { ClientBrokersList } from "./components/ClientBrokersList";
import { ButtonContainer } from "../../../components/LeftPart";
import { ClientDirectorsList } from "./components/ClientDirectorsList";
import { ClientShareholdersList } from "./components/ClientShareholdersList";
import { ClientLinkedUsers } from "./components/ClientLinkedUsers";
import { ClientCompanyDetails } from "./components/ClientCompanyDetails";
import { ClientOfficeAddresses } from "./components/ClientOfficeAddresses";
import { ClientFeeStructure } from "./components/ClientFeeStructure";
import { useParams } from "react-router-dom";
const { Text } = Typography;

const { confirm } = Modal;
const Form = styled<any>(F)`
    .ant-form-item-label {
        white-space: pre-wrap;
    }
`;

export const BusinessProfile = ({ client, uuid }: any) => {
    const bankData = useAppSelector(selectAdminClientBankMetadata);
    const expectedData = useAppSelector(selectAdminClientExpectedSpending);
    const { client_id } = useParams();

    const directorsData = useAppSelector(selectAdminClientDirectors);
    const shareholdersData = useAppSelector(selectAdminClientShareholders);

    const brokers = useAppSelector(selectAdminClientBrokers);

    const numberOfDirectors = directorsData.length;
    const numberOfShareholders = shareholdersData.length;
    const numberOfBrokers = brokers.length;

    const [isResetModalVisible, showResetModal] = useState(false);

    const dispatch = useAppDispatch();

    const detailsOfRegistrar = [
        {
            name: "fullName",
            label: "Full name",
            text: client.firstname + " " + client.lastname,
            key: "fullName",
        },
        { name: "email", label: "Email", text: client.email, disabled: true },
        {
            name: "verifiedAt",
            label: "Email Verified",
            text: client.verifiedAt ? "Yes" : "No",
            type: "select",
            options: yesOrNo,
            key: "email",
        },
        { name: "mobileNumber", label: "Tel No.", text: client.mobileNumber },
        {
            name: "businessRole",
            label: "Who they are",
            text: client.businessRole,
            type: "select",
            options: businessRoles,
            key: "businessRole",
        },
    ];
    const addDirector = () => {
        const newDirector = {
            fullName: "",
            dob: undefined,
            occupation: "",
            telephoneNumber: "",
            email: "",
            nationality: "",
            address1: "",
            address2: "",
            previousAddress1: "",
            previousAddress2: "",
            country: "",
        };
        dispatch(
            setAdminClientDirectors({
                index: numberOfDirectors,
                director: newDirector,
            })
        );
    };
    // shareholders
    const addShareholder = () => {
        const newShareholder = {
            fullName: "",
            dob: undefined,
            occupation: "",
            telephoneNumber: "",
            email: "",
            nationality: "",
            address1: "",
            address2: "",
            previousAddress1: "",
            previousAddress2: "",
            country: "",
            entityType: "",
            shares: undefined,
            uuid: "",
        };
        dispatch(
            setAdminClientShareholders({
                index: numberOfShareholders,
                shareholder: newShareholder,
            })
        );
    };

    const expectedActivity: any[] = [
        {
            name: "expectedVolumeOfTransactions",
            label: "Expected Volume",
            text: expectedData.expectedVolumeOfTransactions,
        },
        {
            name: "expectedValueOfTurnover",
            label: "Expected Value",
            text: expectedData.expectedValueOfTurnover,
        },
    ];
    const bankAccountDetails: any[] = [
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

    const [modalData, setModalData] = useState({
        url: "",
        title: "",
        fields: [],
        uuid: "",
        isModalVisible: false,
    });
    const handleCancel = () => {
        setModalData({
            url: "",
            title: "",
            fields: [],
            uuid: "",
            isModalVisible: false,
        });
    };
    const createModal = async (data: any) => {
        setModalData({
            ...data,
            isModalVisible: true,
        });
    };

    const updateProfile = async (profileData: any) => {
        const data = profileData.data;
        let metaData = {},
            clientData = {};
        switch (profileData.title) {
            case "Details Of Registrar":
                clientData = {
                    firstname: data.fullName.split(" ").slice(0, -1).join(" "),
                    lastname: data.fullName.split(" ").slice(-1).join(" "),
                    email: data.email,
                    verifiedAt: data.verifiedAt,
                    mobileNumber: data.mobileNumber,
                    companyType: data.companyType,
                    businessRole: data.businessRole,
                };
                dispatch(setSelectedClientUserData(clientData));
                try {
                    await dispatch(
                        submitAdminClient({ uuid: profileData.uuid })
                    ).unwrap();
                    dispatch(
                        fetchAdminClient({ uuid: uuid, clientId: client_id })
                    );
                    openNotification(
                        "Details of Registrar",
                        "Details of registrar have been updated successfully!"
                    );
                    handleCancel();
                } catch (error) {
                    dispatch(
                        fetchAdminClient({ uuid: uuid, clientId: client_id })
                    ).unwrap();
                    openErrorNotification(
                        "Personal Details",
                        "Sorry, something went wrong."
                    );
                    handleCancel();
                }
                break;
            case "Bank Account Details":
                dispatch(setAdminClientBankMetadata(data));
                try {
                    await dispatch(
                        submitAdminClientBankMetadata({
                            uuid: profileData.uuid,
                            entityType: EntityType.Business,
                            clientId: client_id || "",
                        })
                    ).unwrap();
                    dispatch(
                        fetchAdminClient({ uuid: uuid, clientId: client_id })
                    ).unwrap();
                    openNotification(
                        "Bank Account Details",
                        "Bank account details have been updated successfully!"
                    );
                    handleCancel();
                } catch (error) {
                    dispatch(
                        fetchAdminClient({ uuid: uuid, clientId: client_id })
                    ).unwrap();
                    openErrorNotification(
                        "Bank Account Details",
                        "Sorry, something went wrong."
                    );
                    handleCancel();
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
                            entityType: EntityType.Business,
                        })
                    ).unwrap();
                    openNotification(
                        "Brokers Details",
                        "Brokers have been updated successfully!"
                    );
                    handleCancel();
                } catch (error: any) {
                    dispatch(
                        fetchAdminClient({ uuid: uuid, clientId: client_id })
                    ).unwrap();
                    openErrorNotification(
                        "Bank Account Details",
                        "Errors: " +
                            Object.keys(error.bankMetadata.errors).map(
                                (e) => error.bankMetadata.errors[e] + "\r\n"
                            )
                    );
                    handleCancel();
                }
                break;
            case "Director Details":
                let directorData = data;
                dispatch(
                    setAdminClientDirectors({
                        index: profileData.url,
                        director: directorData,
                    })
                );
                try {
                    await dispatch(
                        submitAdminClientDirectors({
                            uuid: profileData.uuid,
                            entityType: EntityType.Business,
                            clientId: client_id,
                        })
                    ).unwrap();
                    dispatch(
                        fetchAdminClient({ uuid: uuid, clientId: client_id })
                    ).unwrap();
                    openNotification(
                        "Director Details",
                        "Directors have been updated successfully!"
                    );
                    handleCancel();
                } catch (error) {
                    dispatch(
                        fetchAdminClient({ uuid: uuid, clientId: client_id })
                    ).unwrap();
                    openErrorNotification(
                        "Director Details",
                        "Sorry, something went wrong."
                    );
                    handleCancel();
                }
                break;
            case "Shareholder Details":
                let shareholderData = data;
                dispatch(
                    setAdminClientShareholders({
                        index: profileData.url,
                        shareholder: shareholderData,
                    })
                );
                try {
                    await dispatch(
                        submitAdminClientShareholders({
                            uuid: profileData.uuid,
                            entityType: EntityType.Business,
                            clientId: client_id || "",
                        })
                    ).unwrap();
                    dispatch(
                        fetchAdminClient({ uuid: uuid, clientId: client_id })
                    ).unwrap();
                    openNotification(
                        "Shareholder Details",
                        "Shareholders have been updated successfully!"
                    );
                    handleCancel();
                } catch (error) {
                    dispatch(
                        fetchAdminClient({ uuid: uuid, clientId: client_id })
                    ).unwrap();
                    openErrorNotification(
                        "Shareholder Details",
                        "Sorry, something went wrong."
                    );
                    handleCancel();
                }
                break;
            case "Expected Activity":
                dispatch(setAdminClientSpending(data));
                try {
                    await dispatch(
                        submitAdminClientSpendingData({
                            uuid: profileData.uuid,
                            entityType: EntityType.Business,
                            clientId: client_id || "",
                        })
                    ).unwrap();
                    dispatch(
                        fetchAdminClient({ uuid: uuid, clientId: client_id })
                    );
                    openNotification(
                        profileData.title,
                        profileData.title + " has been updated successfully!"
                    );
                    handleCancel();
                } catch (error) {
                    dispatch(
                        fetchAdminClient({ uuid: uuid, clientId: client_id })
                    ).unwrap();
                    openErrorNotification(
                        profileData.title,
                        "Sorry, something went wrong."
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
                    dispatch(
                        fetchAdminClient({ uuid: uuid, clientId: client_id })
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
                data.isPubliclyTrading = data.isPubliclyTrading === "yes";
                metaData = data;
                dispatch(setAdminClientBusinessMetaData(metaData));
                try {
                    await dispatch(
                        submitAdminClientMetadata({
                            uuid: profileData.uuid,
                            entityType: EntityType.Business,
                            clientId: client_id || "",
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
                    // navigate('/admin/clients/');
                } catch (error) {
                    await dispatch(
                        fetchAdminClient({
                            uuid: profileData.uuid,
                            clientId: client_id,
                        })
                    ).unwrap();
                    openErrorNotification(
                        profileData.title,
                        "Sorry, something went wrong."
                    );
                    handleCancel();
                }

                break;
        }

        // navigate('/admin/clients/');
    };

    const remove = (title: string, onOk: Function, index: any) => {
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
    const ModalFunc = [isResetModalVisible, showResetModal];
    return (
        <FlexContainer>
            <Card title="Details Of Registrar">
                {detailsOfRegistrar
                    .filter(
                        (d) =>
                            d.name !== "password" &&
                            d.name !== "confirmPassword"
                    )
                    .map((detail, index) => {
                        return (
                            <RowItem
                                key={index}
                                label={detail.label}
                                text={detail.text}
                                odd={index % 2 === 1 ? "even" : "odd"}
                            />
                        );
                    })}
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
                                url: "registrar-details",
                                title: "Details Of Registrar",
                                fields: detailsOfRegistrar,
                            })
                        }
                    >
                        Edit
                    </EditButton>
                </ButtonContainer>
            </Card>
            <ClientLinkedUsers createModal={createModal} remove={remove} />
            <ClientCompanyDetails createModal={createModal} />
            <ClientOfficeAddresses createModal={createModal} />
            <Row style={{ width: "100%" }}>
                <Form.Item
                    label="Number of Directors"
                    style={{
                        marginBottom: "5px",
                        marginLeft: "15px",
                        alignItems: "baseline",
                    }}
                >
                    <Text style={{ width: "50px", marginRight: "15px" }}>
                        {numberOfDirectors}
                    </Text>
                    <Button secondary size="small" onClick={addDirector}>
                        Add a Director
                    </Button>
                </Form.Item>
            </Row>
            <ClientDirectorsList createModal={createModal} remove={remove} />
            <Row style={{ width: "100%" }}>
                <Form.Item
                    label="Number of Shareholders"
                    style={{
                        marginBottom: "5px",
                        marginLeft: "15px",
                        alignItems: "baseline",
                    }}
                >
                    <Text style={{ width: "50px", marginRight: "15px" }}>
                        {numberOfShareholders}
                    </Text>
                    <Button secondary size="small" onClick={addShareholder}>
                        Add a Shareholder
                    </Button>
                </Form.Item>
            </Row>
            <ClientShareholdersList createModal={createModal} remove={remove} />
            <Card title="Expected Activity">
                {expectedActivity.map((detail, index) => (
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
                                url: "activity",
                                title: "Expected Activity",
                                fields: expectedActivity,
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
                updateProfile={updateProfile}
                handleCancel={handleCancel}
            />
            <ResetPasswordModal uuid={uuid} ModalFunc={ModalFunc} />
        </FlexContainer>
    );
};
