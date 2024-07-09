import Button from "../../../components/Button";
import RequireAuth from "../../../features/auth/RequireAuth";
import { AdminRoles } from "../../../features/auth/user-role.enum";
import AdminDashboardLayout from "../components/AdminDashboardLayout";
import { RowItem } from "../../../components/RowItem";
import styled from "styled-components";
import { device } from "../../../utils/media-query-helpers";
import { Row, Form, Select, Space, Typography } from "antd";
import { Progress, Spinner } from "../../../components/Spinner";
import { ErrorText } from "../../dashboard/components/ErrorText";
import { Modal } from "../../../components/Modal";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect, useState } from "react";
import { individualDocuments } from "../../../features/documents/model/individualDocuments";
import { businessDocuments } from "../../../features/documents/model/businessDocuments";
import {
    selectAdminClientUserData,
    fetchAdminClient,
    resetSelectedClientUserData,
    selectAdminClientRiskAssessment,
    selectSubaccounts,
    listSubaccounts,
    linkAdminClient,
    selectAdminClientIndividualMetadata,
    selectAdminClientBusinessMetadata,
    selectAdminClientDocuments,
    approveDocument,
    setAdminClientDocuments,
    rejectDocument,
} from "../../../features/admin-clients/AdminClientsSlice";
import { IndividualProfile } from "./IndividualProfile";
import { BusinessProfile } from "./BusinessProfile";
import {
    openNotification,
    openErrorNotification,
} from "../../../components/Notifications";
import { EntityType } from "../../../features/registration/RegistrationSlice";
import { snakeCaseToHumanCase } from "../../../utils/text-helpers";
import {
    ResponsiveTableContainer,
    Table,
} from "../../dashboard/components/Table";
import { TableHeadWithItems } from "../../dashboard/components/TableHead";
import { TableBody } from "../../dashboard/components/TableBody";
import { TableRow } from "../../dashboard/components/TableRow";
import { TableCell } from "../../dashboard/components/TableCell";
import { Tags } from "../../dashboard/components/Tags";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const { Paragraph } = Typography;
const Header = styled.div`
    display: flex;
    @media ${device.lg} {
        width: 50%;
    }
    flex-direction: column;
`;
const Label = styled.span`
    font-weight: bold;
    padding: 10px 15px;
`;

export default function ClientProfile() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const client = useAppSelector(selectAdminClientUserData);
    const documents = useAppSelector(selectAdminClientDocuments);
    const documentTypes = documents.map((document) => document.type);
    const requiredDocuments =
        client.entityType === EntityType.Individual
            ? individualDocuments
            : businessDocuments;
    const basePath = documents[0]?.document?.ownCloudPath;
    const subaccounts = useAppSelector(selectSubaccounts);
    const { uuid, client_id } = useParams();
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        window.addEventListener("resize", () => setWidth(window.innerWidth));
    }, []);
    useEffect(() => {
        if (
            !subaccounts?.openpayd?.length &&
            !subaccounts?.currencycloud?.length
        ) {
            dispatch(listSubaccounts({ gateway: "openpayd" }));
            dispatch(listSubaccounts({ gateway: "currencycloud" }));
        }
    }, []);
    useEffect(() => {
        const resetData = async () => {
            await dispatch(resetSelectedClientUserData());
            if (uuid && uuid !== "new") {
                dispatch(fetchAdminClient({ uuid: uuid, clientId: client_id }));
            }
        };
        resetData();
    }, [dispatch, uuid]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const [isLoading, setIsLoading] = useState(false);
    const [selectedGateway, setSelectedGateway] = useState("currency_cloud");
    const [error, setError] = useState("");
    const initialValues = {
        //passwordUrl: '',
        contactId: "",
        //accountId: '',
        gateway: "currency_cloud",
    };
    const onFinish = async (values: any) => {
        setIsLoading(true);
        setError("");
        try {
            await dispatch(
                linkAdminClient({
                    uuid: String(uuid),
                    data: { ...values, clientId: client_id || "" },
                })
            ).unwrap();
            if (values.gateway == "open_payd") {
                await dispatch(listSubaccounts({ gateway: "openpayd" }));
            } else {
                await dispatch(listSubaccounts({ gateway: "currencycloud" }));
            }
            openNotification(
                "Link the Client",
                `Linked to ${snakeCaseToHumanCase(
                    values.gateway
                )} successfully.`
            );
            handleCancel();
        } catch (err) {
            if ((err as Error).message) {
                setError((err as Error).message);
            } else {
                setError("Linking failed.");
            }
        }

        setIsLoading(false);
    };
    const onFinishFailed = (errorInfo: any) => {
        setError(errorInfo.message ? errorInfo.message : "Linking failed");
    };
    const [documentsModalState, showDocumentModal] = useState(false);
    const [warningModalState, showWarningModal] = useState(false);
    const navigationButtons = (
        <div style={{ display: "flex", alignItems: "center" }}>
            <Space
                direction={width > 578 ? "horizontal" : "vertical"}
                style={{ alignItems: "center" }}
            >
                {client.contact?.complyLaunchId && (
                    <Button
                        secondary
                        size="long"
                        margin="10px"
                        onClick={() =>
                            window.open(
                                "https://app.complyadvantage.com/#/case-management/search/" +
                                    client.contact?.complyLaunchId
                            )
                        }
                        style={{ width: "auto" }}
                    >
                        Comply Launch Search
                    </Button>
                )}
                <Button
                    secondary
                    size="long"
                    margin="10px"
                    onClick={() => {
                        window.localStorage.removeItem("new");
                        navigate("./risk-assessment");
                    }}
                    style={{ width: "auto" }}
                >
                    Risk Assessment
                </Button>
                <Button
                    secondary
                    size="long"
                    margin="10px"
                    onClick={() => {
                        showDocumentModal(true);
                    }}
                    style={{ width: "auto" }}
                >
                    View Documents
                </Button>
            </Space>
        </div>
    );
    const riskAssessmentData = useAppSelector(selectAdminClientRiskAssessment);
    const openPaydAccount = subaccounts?.openpayd?.filter(
        (sub) => sub.accountHolderId == client.contact?.account?.openPaydId
    )[0];
    const currencyCloudAccount = subaccounts?.currencycloud?.filter(
        (sub) => sub.accountHolderId == client.contact?.account?.cloudCurrencyId
    )[0];
    const metaDataIndividual = useAppSelector(
        selectAdminClientIndividualMetadata
    );
    const metaDataBusiness = useAppSelector(selectAdminClientBusinessMetadata);
    const verifyMetadata = true;
    let wrongMetadata = false;
    if (verifyMetadata) {
        if (client.entityType == EntityType.Business) {
            if (
                !metaDataBusiness?.registeredOffice1 ||
                !metaDataBusiness?.companyRegistrationNumber ||
                !metaDataBusiness?.companyName ||
                !metaDataBusiness?.companyType ||
                !metaDataBusiness?.countryOfRegistration
            ) {
                wrongMetadata = true;
            }
        } else if (client.entityType == EntityType.Individual) {
            if (
                !metaDataIndividual?.identificationNumber ||
                !metaDataIndividual?.identificationType ||
                !metaDataIndividual?.addressLine1 ||
                !metaDataIndividual?.dateOfBirth
            ) {
                wrongMetadata = true;
            }
        }
    }
    const Document = ({ document }: any) => {
        const [loading, setLoading] = useState(false);
        return (
            <TableRow>
                <TableCell style={{ textTransform: "capitalize" }}>
                    {document.type.replaceAll("_", " ")}
                </TableCell>
                <TableCell>{document.createdAt.split("T")[0]}</TableCell>
                <TableCell>
                    <Tags style={document.status} text={document.status} />
                </TableCell>
                <TableCell>
                    {loading ? (
                        <Progress icon={faSpinner} />
                    ) : document.status === "approved" ? (
                        <Link
                            to=""
                            style={{ color: "red" }}
                            onClick={async () => {
                                if (!uuid || !document.uuid) return;
                                setLoading(true);
                                const newDocument = await dispatch(
                                    rejectDocument({
                                        owner: uuid,
                                        uuid: document.uuid,
                                    })
                                ).unwrap();
                                if (newDocument.document) {
                                    openNotification(
                                        "Document Action",
                                        "The document is rejected."
                                    );
                                    dispatch(
                                        setAdminClientDocuments(
                                            newDocument.document
                                        )
                                    );
                                } else
                                    openErrorNotification(
                                        "Document Action",
                                        "The document could not be rejected."
                                    );
                                setLoading(false);
                            }}
                        >
                            Reject
                        </Link>
                    ) : document.status === "rejected" ? (
                        <Link
                            to=""
                            onClick={async () => {
                                if (!uuid || !document.uuid) return;
                                setLoading(true);
                                const newDocument = await dispatch(
                                    approveDocument({
                                        owner: uuid,
                                        uuid: document.uuid,
                                    })
                                ).unwrap();
                                if (newDocument.document) {
                                    openNotification(
                                        "Document Action",
                                        "The document is successfully approved."
                                    );
                                    dispatch(
                                        setAdminClientDocuments(
                                            newDocument.document
                                        )
                                    );
                                } else
                                    openErrorNotification(
                                        "Document Action",
                                        "The document could not be approved."
                                    );
                                setLoading(false);
                            }}
                        >
                            Approve
                        </Link>
                    ) : (
                        <>
                            <Link
                                to=""
                                onClick={async () => {
                                    if (!uuid || !document.uuid) return;
                                    const newDocument = await dispatch(
                                        approveDocument({
                                            owner: uuid,
                                            uuid: document.uuid,
                                        })
                                    ).unwrap();
                                    setLoading(true);
                                    if (newDocument.document) {
                                        openNotification(
                                            "Document Action",
                                            "The document is successfully approved."
                                        );
                                        dispatch(
                                            setAdminClientDocuments(
                                                newDocument.document
                                            )
                                        );
                                    } else
                                        openErrorNotification(
                                            "Document Action",
                                            "The document could not be approved."
                                        );
                                    setLoading(false);
                                }}
                            >
                                Approve
                            </Link>
                            &nbsp; | &nbsp;
                            <Link
                                to=""
                                style={{ color: "red" }}
                                onClick={async () => {
                                    if (!uuid || !document.uuid) return;
                                    const newDocument = await dispatch(
                                        rejectDocument({
                                            owner: uuid,
                                            uuid: document.uuid,
                                        })
                                    ).unwrap();
                                    setLoading(true);
                                    if (newDocument.document) {
                                        openNotification(
                                            "Document Action",
                                            "The document is rejected."
                                        );
                                        dispatch(
                                            setAdminClientDocuments(
                                                newDocument.document
                                            )
                                        );
                                    } else
                                        openErrorNotification(
                                            "Document Action",
                                            "The document could not be rejected."
                                        );
                                    setLoading(false);
                                }}
                            >
                                Reject
                            </Link>
                        </>
                    )}
                </TableCell>
            </TableRow>
        );
    };
    return (
        <RequireAuth roles={AdminRoles}>
            <AdminDashboardLayout navigationButtons={navigationButtons}>
                <Header>
                    <RowItem
                        label="Full Name: "
                        text={client.firstname + " " + client.lastname}
                        odd="odd"
                    />
                    <RowItem
                        label="Country: "
                        text={client.country}
                        odd="odd"
                    />
                    <RowItem
                        label="Account Type: "
                        text={client.entityType?.toUpperCase()}
                        odd="odd"
                    />
                    <RowItem
                        label="Risk Assessment: "
                        text={riskAssessmentData.riskRating?.toUpperCase()}
                        odd="odd"
                    />
                    <RowItem
                        label="PEP: "
                        text={riskAssessmentData.pep?.toUpperCase()}
                        odd="odd"
                    />
                </Header>
                <Row
                    style={{
                        marginBottom: "20px",
                        justifyContent: "flex-start",
                    }}
                >
                    {!!client.contact?.account?.openPaydId && (
                        <Label>
                            OpenPayd Linked Client:{" "}
                            {openPaydAccount?.friendlyName} (
                            {openPaydAccount?.clientType})
                        </Label>
                    )}
                    {!!client.contact?.account?.cloudCurrencyId && (
                        <Label>
                            Currency Cloud Linked Client:{" "}
                            {currencyCloudAccount?.friendlyName} (
                            {currencyCloudAccount?.clientType}
                            {!currencyCloudAccount &&
                                client.contact.account.cloudCurrencyId}
                            )
                        </Label>
                    )}
                    {!verifyMetadata ||
                        (!wrongMetadata && (
                            <>
                                <Label>
                                    To link this account to the payment gateway
                                    please click this button
                                </Label>
                                <Button
                                    secondary
                                    size="long"
                                    style={{
                                        width: "auto",
                                        padding: "2px 15px",
                                        minWidth: "auto",
                                    }}
                                    onClick={() => {
                                        let missing = [];
                                        for (const requiredDocument of requiredDocuments) {
                                            if (
                                                !documentTypes.includes(
                                                    requiredDocument.type
                                                )
                                            )
                                                missing.push(
                                                    requiredDocument.type
                                                );
                                        }
                                        if (missing.length) {
                                            showWarningModal(true);
                                        } else showModal();
                                    }}
                                >
                                    Link
                                </Button>
                            </>
                        ))}
                    {wrongMetadata && (
                        <Label>
                            Please fill in missing information before linking
                            the client.
                        </Label>
                    )}
                </Row>
                {client.entityType === "individual" ? (
                    <IndividualProfile client={client} uuid={uuid} />
                ) : (
                    <BusinessProfile client={client} uuid={uuid} />
                )}
                <Modal
                    title="Link to Gateway"
                    open={isModalVisible}
                    onCancel={handleCancel}
                    footer={[]}
                >
                    <Form
                        initialValues={initialValues}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        onFieldsChange={(form_values) => {
                            if (form_values[0].name == "gateway") {
                                setSelectedGateway(form_values[0].value);
                            }
                        }}
                    >
                        <Form.Item name="gateway">
                            <Select placeholder="Gateway">
                                <Select.Option value="currency_cloud">
                                    Currency Cloud
                                </Select.Option>
                                {/* <Select.Option value="open_payd">
                                    OpenPayd
                                </Select.Option> */}
                            </Select>
                        </Form.Item>
                        {selectedGateway == "open_payd" && (
                            <Form.Item
                                name="contactId"
                                label="Contact ID"
                                rules={[
                                    {
                                        required: false,
                                        message: "Please select the contact!",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Linked account"
                                    value={client.contact?.account?.openPaydId}
                                >
                                    <Select.Option value={""}>
                                        Create new account
                                    </Select.Option>
                                    {subaccounts.openpayd
                                        ?.filter(
                                            (subaccount) => !subaccount.taken
                                        )
                                        .map((subaccount) => (
                                            <Select.Option
                                                value={
                                                    subaccount.accountHolderId
                                                }
                                            >
                                                {subaccount.friendlyName} (
                                                {subaccount.clientType})
                                            </Select.Option>
                                        ))}
                                </Select>
                            </Form.Item>
                        )}
                        {selectedGateway == "currency_cloud" && (
                            <Form.Item
                                name="contactId"
                                label="Contact ID"
                                rules={[
                                    {
                                        required: false,
                                        message: "Please select the contact!",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Linked account"
                                    value={
                                        client.contact?.account?.cloudCurrencyId
                                    }
                                >
                                    {subaccounts.currencycloud
                                        ?.filter(
                                            (subaccount) => !subaccount.taken
                                        )
                                        .map((subaccount) => (
                                            <Select.Option
                                                value={
                                                    subaccount.accountHolderId
                                                }
                                            >
                                                {subaccount.friendlyName} (
                                                {subaccount.clientType})
                                            </Select.Option>
                                        ))}
                                </Select>
                            </Form.Item>
                        )}
                        {error ? <ErrorText>{error} </ErrorText> : null}
                        <Row>
                            {isLoading ? (
                                <Spinner />
                            ) : (
                                <Button
                                    secondary
                                    size="long"
                                    type="submit"
                                    style={{ marginLeft: "auto" }}
                                >
                                    Link
                                </Button>
                            )}
                        </Row>
                    </Form>
                </Modal>
                <Modal
                    title="Client Documents"
                    open={documentsModalState}
                    onCancel={() => showDocumentModal(false)}
                    footer={[
                        <Button
                            primary
                            onClick={() => {
                                let path = basePath;
                                if (path)
                                    path = path.substring(
                                        0,
                                        path.lastIndexOf("/")
                                    );
                                else {
                                    openErrorNotification(
                                        "Could not Access",
                                        "Documents do not exist in the cloud"
                                    );
                                    return;
                                }
                                window.open(
                                    "https://cdaxkycuploads.cdaxforex.com/index.php/apps/files/?dir=/" +
                                        encodeURIComponent(path)
                                );
                                // showDocumentModal(false);
                            }}
                        >
                            View Documents on Cloud
                        </Button>,
                    ]}
                    style={width > 1000 ? { minWidth: "850px" } : {}}
                >
                    {documents.length ? (
                        <ResponsiveTableContainer>
                            <Table>
                                <TableHeadWithItems
                                    items={[
                                        "Document Type",
                                        "Upload Date",
                                        "Status",
                                        "Actions",
                                    ]}
                                />

                                <TableBody>
                                    {documents.map((document: any) => (
                                        <Document
                                            key={document.uuid}
                                            document={document}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </ResponsiveTableContainer>
                    ) : (
                        <Paragraph style={{ textAlign: "center" }}>
                            There are no documents uploaded for the client.
                        </Paragraph>
                    )}
                </Modal>
                <Modal
                    title="Warning"
                    open={warningModalState}
                    onCancel={() => showWarningModal(false)}
                    footer={[
                        <Space>
                            <Button
                                style={{ padding: "7px 15px" }}
                                primary
                                onClick={() => {
                                    showWarningModal(false);
                                    showDocumentModal(true);
                                }}
                            >
                                View Documents
                            </Button>
                            <Button
                                style={{ padding: "7px 15px" }}
                                secondary
                                onClick={() => {
                                    showWarningModal(false);
                                    showModal();
                                }}
                            >
                                Ignore and Link
                            </Button>
                            <Button
                                style={{ padding: "7px 15px" }}
                                danger
                                onClick={() => {
                                    showWarningModal(false);
                                }}
                            >
                                Cancel
                            </Button>
                        </Space>,
                    ]}
                >
                    This client's documents still need to be verified. Do you
                    still wish to approve the client without verifying
                    documents?
                </Modal>
            </AdminDashboardLayout>
        </RequireAuth>
    );
}
