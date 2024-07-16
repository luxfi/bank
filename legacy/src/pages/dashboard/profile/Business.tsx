import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { DatePicker, Form as F, Input, Select, Typography } from "antd";
import TextArea from "antd/lib/input/TextArea";
import moment from "moment";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Button, { EditButton } from "../../../components/Button";
import { Card, FlexContainer } from "../../../components/Card";
import { Modal } from "../../../components/Modal";
import {
    openErrorNotification,
    openNotification,
} from "../../../components/Notifications";
import { RowItem } from "../../../components/RowItem";
import { Spinner } from "../../../components/Spinner";
import { selectCurrentUser } from "../../../features/auth/AuthSlice";
import { currencies } from "../../../features/beneficiaries/model/currencies";
import { companyTypes } from "../../../features/beneficiaries/model/entity-types";
import {
    fetchProfile,
    selectBankMetadata,
    selectBusinessMetadata,
    selectExpectedSpending,
    selectLoadingStatus,
    selectPendingMetadata,
    selectUserData,
    setBankMetadata,
    setBusinessMetaData,
    setSpending,
    setUserData,
    submitBankMetadata,
    submitMetadata,
    submitSpendingData,
    submitUser,
} from "../../../features/profile/ProfileSlice";
import { EntityType } from "../../../features/registration/RegistrationSlice";
import { businessRoles } from "../../../features/registration/model/businessRoles";
import { countries } from "../../../features/registration/model/countries";
import { wordsToDash } from "../../../utils/functions";
import { device } from "../../../utils/media-query-helpers";
import { yesOrNo } from "../../../utils/select-options";
import { ButtonContainer } from "../components/Containers";
import { EmailModal } from "../components/EmailModal";
const { Text } = Typography;
const { Option } = Select;
const LeftPart = styled.div`
    @media ${device.lg} {
        width: 48%;
        float: left;
    }
`;
const RightPart = styled.div`
    @media ${device.lg} {
        width: 48%;
        float: right;
    }
`;
const Form = styled<any>(F)`
    .ant-form-item-label {
        white-space: pre-wrap;
    }
`;
export default function Business() {
    const currentUser = useAppSelector(selectCurrentUser);
    const dispatch = useAppDispatch();
    const uuid = currentUser?.uuid || "";
    useEffect(() => {
        dispatch(fetchProfile({ uuid: uuid }));
    }, [dispatch, uuid]);
    const client = useAppSelector(selectUserData);
    const metaData = useAppSelector(selectBusinessMetadata);
    const bankData = useAppSelector(selectBankMetadata);
    const expectedData = useAppSelector(selectExpectedSpending);
    // const dateString = metaData.dateOfBirth ? formatDate(metaData.dateOfBirth) : ''
    const pendingData = useAppSelector(selectPendingMetadata);
    const VALIDATION_TEXT =
        "Updating this information will require validation before being applied";
    const PENDING_TEXT = (value: any) => (
        <>
            Request to change to <Text strong>{value}</Text> is currenty being
            reviewed.
        </>
    );
    const VALIDATION_LIST = {
        "Company Details": ["companyName", "tradingName"],
        Address: [
            "registeredOffice1",
            "registeredOffice1_address2",
            "registeredOffice1_city",
            "registeredOffice1_state",
            "registeredOffice2",
            "registeredOffice3",
            "principalPlace",
            "mailingAddress",
            "registeredOffice1_postcode",
        ],
        "Bank Account Details": ["bankCountry"],
    };
    const detailsOfRegistrar = [
        {
            name: "fullName",
            label: "Full name",
            text: currentUser?.firstname + " " + currentUser?.lastname,
            key: "fullName",
        },
        { name: "email", label: "Email", text: currentUser?.username },
        {
            name: "mobileNumber",
            label: "Tel No.",
            text: currentUser?.contact?.mobileNumber,
        },
        {
            name: "businessRole",
            label: "Who they are",
            text: currentUser?.contact?.businessRole,
            type: "select",
            options: businessRoles,
            key: "businessRole",
        },
    ];
    const companyDetails = [
        {
            name: "companyName",
            label: "Company Name",
            text: currentUser?.contact?.account?.businessMetadata?.companyName,
            key: "companyName",
        },
        {
            name: "tradingName",
            label: "Trading Name",
            text: currentUser?.contact?.account?.businessMetadata?.tradingName,
            key: "tradingName",
        },
        {
            name: "legalEntity",
            label: "Legal Entity",
            text: currentUser?.contact?.account?.businessMetadata?.legalEntity,
            key: "legalEntity",
        },
        {
            name: "email",
            label: "Email",
            text: currentUser?.contact?.account?.businessMetadata?.email,
            key: "email",
        },
        {
            name: "companyType",
            label: "Company Type",
            text: currentUser?.contact?.account?.businessMetadata?.companyType,
            type: "select",
            options: companyTypes,
            key: "companyType",
        },
        {
            name: "otherTradingNames",
            label: "Other Trading Names",
            text: currentUser?.contact?.account?.businessMetadata
                ?.otherTradingNames,
            key: "otherTradingNames",
        },
        {
            name: "countryOfRegistration",
            label: "Country of Registration",
            text: currentUser?.contact?.account?.businessMetadata
                ?.countryOfRegistration,
            type: "select",
            options: countries,
            search: true,
            key: "countryOfRegistration",
        },
        {
            name: "companyRegistrationNumber",
            label: "Company Reg Number",
            text: currentUser?.contact?.account?.businessMetadata
                ?.companyRegistrationNumber,
            key: "Company Reg Number",
        },
        {
            name: "dateOfRegistration",
            label: "Date of Registration",
            text: moment(
                currentUser?.contact?.account?.businessMetadata
                    ?.dateOfRegistration || new Date()
            ).format("YYYY-MM-DD"),
            type: "date",
            key: "dateOfRegistration",
        },
        {
            name: "telephoneNumber",
            label: "Tel No.",
            text: currentUser?.contact?.account?.businessMetadata
                ?.telephoneNumber,
            key: "telephoneNumber",
        },
        {
            name: "dateOfIncorporation",
            label: "Date of Incorporation",
            text: moment(
                currentUser?.contact?.account?.businessMetadata
                    ?.dateOfIncorporation || new Date()
            ).format("YYYY-MM-DD"),
            type: "date",
            key: "dateOfIncorporation",
        },
        {
            name: "vatNumber",
            label: "Tax/VAT Number",
            text: currentUser?.contact?.account?.businessMetadata?.vatNumber,
            key: "vatNumber",
        },
        {
            name: "websiteUrl",
            label: "Website",
            text: currentUser?.contact?.account?.businessMetadata?.websiteUrl,
            key: "websiteUrl",
            rules: [{ type: "url" }],
        },
        {
            name: "otherContactInfo",
            label: "Other contact info",
            text: currentUser?.contact?.account?.businessMetadata
                ?.otherContactInfo,
            key: "otherContactInfo",
        },
        {
            name: "statutoryProvision",
            label: "Statutory provision under which it is incorporated",
            text: currentUser?.contact?.account?.businessMetadata
                ?.statutoryProvision,
            key: "statutoryProvision",
        },
        {
            name: "isPubliclyTrading",
            label: "Publicly trading",
            text: currentUser?.contact?.account?.businessMetadata
                ?.isPubliclyTrading
                ? "Yes"
                : "No",
            type: "select",
            options: yesOrNo,
            key: "isPubliclyTrading",
        },
        {
            name: "stockMarketLocation",
            label: "Where listed",
            text: currentUser?.contact?.account?.businessMetadata
                ?.stockMarketLocation,
            key: "stockMarketLocation",
        },
        {
            name: "stockMarket",
            label: "Which market",
            text: currentUser?.contact?.account?.businessMetadata?.stockMarket,
            key: "stockMarket",
        },
        {
            name: "regulatorName",
            label: "Name of Regulator",
            text: currentUser?.contact?.account?.businessMetadata
                ?.regulatorName,
            key: "regulatorName",
        },
    ];
    const addresses = [
        {
            name: "registeredOffice1",
            label: "Address Line 1",
            text: currentUser?.contact?.account?.businessMetadata
                ?.registeredOffice1,
            key: "registeredOffice1",
            rules: [{ required: true, message: "Please enter Address Line 1" }],
        },
        {
            name: "registeredOffice1_address2",
            label: "Address Line 2",
            text: currentUser?.contact?.account?.businessMetadata
                ?.registeredOffice1_address2,
            key: "registeredOffice1_address2",
        },
        {
            name: "registeredOffice1_city",
            label: "City",
            text: currentUser?.contact?.account?.businessMetadata
                ?.registeredOffice1_city,
            key: "registeredOffice1_city",
            rules: [{ required: true, message: "Please enter City" }],
        },
        {
            name: "registeredOffice1_postcode",
            label: "Postcode",
            text: currentUser?.contact?.account?.businessMetadata
                ?.registeredOffice1_postcode,
            key: "registeredOffice1_postcode",
            rules: [{ required: true, message: "Please enter Postcode" }],
        },
        {
            name: "registeredOffice1_state",
            label: "State",
            text: currentUser?.contact?.account?.businessMetadata
                ?.registeredOffice1_state,
            key: "registeredOffice1_state",
            rules: [{ required: true, message: "Please enter State" }],
        },
        {
            name: "registeredOffice2",
            label: "Registered Office 2",
            text: currentUser?.contact?.account?.businessMetadata
                ?.registeredOffice2,
            key: "registeredOffice2",
        },
        {
            name: "registeredOffice3",
            label: "Registered Office 3",
            text: currentUser?.contact?.account?.businessMetadata
                ?.registeredOffice3,
            key: "registeredOffice3",
        },
        {
            name: "principalPlace",
            label: "Principal place of business",
            text: currentUser?.contact?.account?.businessMetadata
                ?.principalPlace,
            key: "principalPlace",
        },
        {
            name: "mailingAddress",
            label: "Mailing Address",
            text: currentUser?.contact?.account?.businessMetadata
                ?.mailingAddress,
            key: "mailingAddress",
        },
        {
            name: "previousOffice1",
            label: "Previous registered offices",
            text: currentUser?.contact?.account?.businessMetadata
                ?.previousOffice1,
            key: "previousOffice1",
        },
        {
            name: "previousOffice2",
            label: "Previous registered offices",
            text: currentUser?.contact?.account?.businessMetadata
                ?.previousOffice2,
            key: "previousOffice2",
        },
        {
            name: "previousOffice3",
            label: "Previous registered offices",
            text: currentUser?.contact?.account?.businessMetadata
                ?.previousOffice3,
            key: "previousoffice3",
        },
    ];
    const expectedActivity: any[] = [
        {
            name: "expectedVolumeOfTransactions",
            label: "Expected Volume",
            text: currentUser?.contact?.account?.businessMetadata
                ?.expectedVolumeOfTransactions,
        },
        {
            name: "expectedValueOfTurnover",
            label: "Expected Value",
            text: currentUser?.contact?.account?.businessMetadata
                ?.expectedValueOfTurnover,
        },
    ];
    const bankAccountDetails: any[] = [
        {
            name: "bankName",
            label: "Name of bank",
            text: currentUser?.contact?.account?.bankMetadata?.bankName,
        },
        {
            name: "branch",
            label: "Branch",
            text: currentUser?.contact?.account?.bankMetadata?.branch,
        },
        {
            name: "accountHolderName",
            label: "Account Holder",
            text: currentUser?.contact?.account?.bankMetadata
                ?.accountHolderName,
        },
        {
            name: "bankCountry",
            label: "Bank country",
            text: currentUser?.contact?.account?.bankMetadata?.bankCountry,
            type: "select",
            options: countries,
            search: true,
        },
        {
            name: "currency",
            label: "Account currency",
            text: currentUser?.contact?.account?.bankMetadata?.currency,
            type: "select",
            options: currencies,
            search: true,
        },
        {
            name: "sortCode",
            label: "Sort code",
            text: currentUser?.contact?.account?.bankMetadata?.sortCode,
        },
        {
            name: "accountNumber",
            label: "Account Number",
            text: currentUser?.contact?.account?.bankMetadata?.accountNumber,
        },
        {
            name: "IBAN",
            label: "IBAN",
            text: currentUser?.contact?.account?.bankMetadata?.IBAN,
        },
        {
            name: "bicSwift",
            label: "BIC",
            text: currentUser?.contact?.account?.bankMetadata?.bicSwift,
        },
    ];
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
                dispatch(setUserData(clientData));
                try {
                    await dispatch(
                        submitUser({ uuid: profileData.uuid })
                    ).unwrap();
                    openNotification(
                        "Details of Registrar",
                        "Details of registrar have been updated successfully!"
                    );
                    handleCancel();
                    window.location.reload();
                } catch (error) {
                    await dispatch(
                        fetchProfile({ uuid: profileData.uuid })
                    ).unwrap();
                    openErrorNotification(
                        "Personal Details",
                        "Sorry, something went wrong."
                    );
                    handleCancel();
                }
                break;
            case "Bank Account Details":
                dispatch(setBankMetadata(data));
                try {
                    await dispatch(
                        submitBankMetadata({
                            uuid: profileData.uuid,
                            entityType: EntityType.Business,
                        })
                    ).unwrap();
                    openNotification(
                        "Bank Account Details",
                        "Bank account details have been updated successfully!"
                    );
                    handleCancel();
                } catch (error) {
                    await dispatch(
                        fetchProfile({ uuid: profileData.uuid })
                    ).unwrap();
                    openErrorNotification(
                        "Bank Account Details",
                        "Sorry, something went wrong."
                    );
                    handleCancel();
                }
                break;
            case "Expected Activity":
                dispatch(setSpending(data));
                try {
                    await dispatch(
                        submitSpendingData({
                            uuid: profileData.uuid,
                            entityType: EntityType.Business,
                        })
                    ).unwrap();
                    openNotification(
                        profileData.title,
                        profileData.title + " has been updated successfully!"
                    );
                    handleCancel();
                } catch (error) {
                    await dispatch(
                        fetchProfile({ uuid: profileData.uuid })
                    ).unwrap();
                    openErrorNotification(
                        profileData.title,
                        "Sorry, something went wrong."
                    );
                    handleCancel();
                }
                break;
            default:
                data.isPubliclyTrading = data.isPubliclyTrading === "yes";
                metaData = data;
                dispatch(setBusinessMetaData(metaData));
                try {
                    await dispatch(
                        submitMetadata({
                            uuid: profileData.uuid,
                            entityType: EntityType.Business,
                        })
                    ).unwrap();
                    openNotification(
                        profileData.title,
                        profileData.title + " has been updated successfully!"
                    );
                    handleCancel();
                    // navigate('/admin/clients/');
                } catch (error) {
                    await dispatch(
                        fetchProfile({ uuid: profileData.uuid })
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
    const saveProfile = () => {
        let data = {
            uuid: "",
        };
        // eslint-disable-next-line array-callback-return
        modalData.fields.map((field: any, index: number) => {
            data = { ...data, [field.name]: field.text };
        });

        if (modalData.uuid) {
            data.uuid = modalData.uuid;
        }
        const profileData = {
            uuid,
            title: modalData.title,
            url: modalData.url,
            data,
        };
        updateProfile(profileData);
    };

    const CARDS = [
        {
            title: "Details Of Registrar",
            type: "wide",
            content: detailsOfRegistrar,
        },
        { title: "Company Details", type: "wide", content: companyDetails },
        { title: "Address", type: "wide", content: addresses },
        { title: "Expected Activity", type: "wide", content: expectedActivity },
        {
            title: "Bank Account Details",
            type: "wide",
            content: bankAccountDetails,
        },
    ].map((card, index) => (
        <Card key={index} title={card.title} type={card.type}>
            {card.content.map((detail, index) => {
                const pendingMeta =
                    pendingData &&
                    pendingData.filter((data) => data.field == detail.name);
                return (
                    <RowItem
                        key={index}
                        label={detail.label}
                        text={detail.text}
                        odd={index % 2 === 1 ? "even" : "odd"}
                    >
                        {/* { detail.name === 'email' && 
                            <Extra style={{marginLeft: '50px'}}>
                                <Link to = '#' onClick={() => {
                                    setEmailModalStatus(true);
                                }}>Change Email Address</Link>
                            </Extra>
                        } */}
                        {/* { VALIDATION_LIST[card.title]?.includes(detail.name) && 
                        <Extra>
                            { pendingMeta && pendingMeta.length ? PENDING_TEXT(pendingMeta[0].value) : VALIDATION_TEXT }
                        </Extra> } */}
                    </RowItem>
                );
            })}
            {card.title === "Details Of Registrar" && (
                <ButtonContainer>
                    <EditButton
                        secondary
                        size="small"
                        onClick={() =>
                            createModal({
                                url: wordsToDash(card.title),
                                title: card.title,
                                fields: card.content,
                            })
                        }
                    >
                        Edit
                    </EditButton>
                </ButtonContainer>
            )}
        </Card>
    ));
    const [emailModalStatus, setEmailModalStatus] = useState(false);
    const loading = useAppSelector(selectLoadingStatus) === "loading";
    return (
        <FlexContainer>
            {CARDS}
            <Modal
                style={{ minWidth: "600px" }}
                key={modalData.url}
                title={modalData.title}
                open={modalData.isModalVisible}
                onCancel={handleCancel}
                footer={[
                    loading ? (
                        <Spinner />
                    ) : (
                        <Button secondary size="long" onClick={saveProfile}>
                            Save
                        </Button>
                    ),
                ]}
            >
                <Form
                    name="editClient"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    autoComplete="off"
                >
                    {modalData.fields.map((field: any, key: any) =>
                        field.name === "uuid" ? (
                            ""
                        ) : (
                            <Form.Item
                                key={key}
                                label={field.label}
                                name={field.name}
                                style={{
                                    marginBottom: "10px",
                                }}
                                rules={field.rules ? field.rules : undefined}
                            >
                                {field.type === "date" ? (
                                    <>
                                        <DatePicker
                                            defaultValue={moment(field.text)}
                                            style={{ width: "100%" }}
                                            onChange={(date, dateString) =>
                                                (field.text = dateString)
                                            }
                                        />
                                    </>
                                ) : field.type === "select" ? (
                                    <Select
                                        showSearch={field.search ? true : false}
                                        defaultValue={field.text}
                                        onChange={(value) => {
                                            if (field.name === "entityType") {
                                                field.onChange(value);
                                            }
                                            field.text = value;
                                        }}
                                        onFocus={() => {
                                            const el =
                                                document.getElementsByClassName(
                                                    "ant-select-selection-search-input"
                                                );
                                            for (
                                                let i = 0;
                                                i < el.length;
                                                i++
                                            ) {
                                                el[i].setAttribute(
                                                    "autocomplete",
                                                    "new-select-item"
                                                );
                                            }
                                        }}
                                        filterOption={(input, option: any) => {
                                            if (input.toUpperCase() === input)
                                                return (
                                                    option?.key.includes(
                                                        input
                                                    ) ||
                                                    option?.key2?.includes(
                                                        input
                                                    )
                                                );
                                            else
                                                return option?.children
                                                    ?.toLocaleLowerCase()
                                                    .includes(
                                                        input.toLocaleLowerCase()
                                                    );
                                        }}
                                    >
                                        {Array.from(field.options as any).map(
                                            ([key, value]: any) =>
                                                key === "GB" ? (
                                                    <Option
                                                        key={key}
                                                        value={key}
                                                        key2="UK"
                                                    >
                                                        {value}
                                                    </Option>
                                                ) : (
                                                    <Option
                                                        key={key}
                                                        value={key}
                                                    >
                                                        {value}
                                                    </Option>
                                                )
                                        )}
                                    </Select>
                                ) : field.type === "textarea" ? (
                                    <TextArea
                                        style={{
                                            minHeight: "120px",
                                        }}
                                        defaultValue={field.text}
                                        onChange={(e) =>
                                            (field.text = e.target.value)
                                        }
                                    />
                                ) : field.type === "password" ? (
                                    <Input.Password
                                        placeholder="Password"
                                        iconRender={(visible) =>
                                            visible ? (
                                                <EyeTwoTone />
                                            ) : (
                                                <EyeInvisibleOutlined />
                                            )
                                        }
                                        onChange={(e) =>
                                            (field.text = e.target.value)
                                        }
                                    />
                                ) : (
                                    <>
                                        <Input
                                            key={modalData.url + " " + key}
                                            autoComplete={"new-input-" + key}
                                            defaultValue={field.text}
                                            onChange={(e) =>
                                                (field.text = e.target.value)
                                            }
                                        />
                                    </>
                                )}
                            </Form.Item>
                        )
                    )}
                </Form>
            </Modal>
            <EmailModal
                emailModalStatus={emailModalStatus}
                closeEmailModal={() => setEmailModalStatus(false)}
                previousEmail={client.email}
                uuid={uuid}
            />
        </FlexContainer>
    );
}
