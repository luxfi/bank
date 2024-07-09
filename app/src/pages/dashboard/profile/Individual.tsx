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
import {
    fetchProfile,
    selectBankMetadata,
    selectIndividualMetadata,
    selectLoadingStatus,
    selectPendingMetadata,
    selectUserData,
    setBankMetadata,
    setIndividualMetaData,
    setUserData,
    submitBankMetadata,
    submitMetadata,
    submitUser,
} from "../../../features/profile/ProfileSlice";
import { EntityType } from "../../../features/registration/RegistrationSlice";
import { countries } from "../../../features/registration/model/countries";
import { genders } from "../../../features/registration/model/genders";
import {
    identificationTypes,
    identificationTypesDictionary,
} from "../../../features/registration/model/identificationTypes";
import { personalTitles } from "../../../features/registration/model/personalTitles";
import { formatDate, wordsToDash } from "../../../utils/functions";
import { ButtonContainer } from "../components/Containers";
import { EmailModal } from "../components/EmailModal";
const Form = styled<any>(F)`
    .ant-form-item-label {
        white-space: pre-wrap;
    }
`;
const { Option } = Select;

export default function Individual() {
    const { Text } = Typography;
    const currentUser = useAppSelector(selectCurrentUser);
    const dispatch = useAppDispatch();
    const uuid = currentUser?.uuid || "";

    useEffect(() => {
        dispatch(fetchProfile({ uuid: uuid }));
    }, [dispatch, uuid]);
    const client = useAppSelector(selectUserData);
    const metaData = useAppSelector(selectIndividualMetadata);
    const bankData = useAppSelector(selectBankMetadata);
    const pendingData = useAppSelector(selectPendingMetadata);
    const dateString = currentUser?.contact?.account?.individualMetadata
        ?.dateOfBirth
        ? formatDate(
              currentUser?.contact?.account?.individualMetadata?.dateOfBirth
          )
        : "";

    const VALIDATION_TEXT =
        "Updating this information will require validation before being applied";
    const PENDING_TEXT = (value: any) => (
        <>
            Request to change to <Text strong>{value}</Text> is currenty being
            reviewed.
        </>
    );
    const VALIDATION_LIST = {
        "Personal Details": [],
        Address: [
            "addressLine1",
            "addressLine2",
            "city",
            "postcode",
            "state",
            "country",
        ],
        "Employment Details": ["occupation"],
        "Bank Account Details": ["bankCountry"],
    };
    const PersonalDetails = [
        {
            name: "title",
            label: "Title",
            text: currentUser?.contact?.account?.individualMetadata?.title,
            type: "select",
            options: personalTitles,
        },
        {
            name: "fullName",
            label: "Full name",
            text: currentUser?.currentClient?.name,
        },
        {
            name: "formerName",
            label: "Former names",
            text: currentUser?.contact?.account?.individualMetadata?.formerName,
        },
        {
            name: "dateOfBirth",
            label: "DOB",
            text: dateString,
            type: "date",
            rules: [
                { required: true, message: "This is a required field." },
                ({ getFieldValue }: any) => ({
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
            text: currentUser?.contact?.account?.individualMetadata
                ?.placeOfBirth,
        },
        {
            name: "email",
            label: "Email",
            text: currentUser?.username,
            hide: true,
        },
        {
            name: "mobileNumber",
            label: "Mobile Number.",
            text: currentUser?.contact?.mobileNumber,
        },
        {
            name: "country",
            label: "Nationality",
            text: currentUser?.contact?.account?.individualMetadata?.country,
            type: "select",
            search: true,
            options: countries,
        },
        {
            name: "gender",
            label: "Gender",
            text: currentUser?.contact?.account?.individualMetadata?.gender,
            type: "select",
            options: genders,
        },
    ];
    const Address = [
        {
            name: "addressLine1",
            label: "Address Line 1",
            text: currentUser?.contact?.account?.individualMetadata
                ?.addressLine1,
        },
        {
            name: "addressLine2",
            label: "Address Line 2",
            text: currentUser?.contact?.account?.individualMetadata
                ?.addressLine2,
        },
        {
            name: "city",
            label: "City",
            text: currentUser?.contact?.account?.individualMetadata?.city,
        },
        {
            name: "postcode",
            label: "Zip code/Post code",
            text: currentUser?.contact?.account?.individualMetadata?.postcode,
        },
        {
            name: "state",
            label: "State/County",
            text: currentUser?.contact?.account?.individualMetadata?.state,
        },
        {
            name: "country",
            label: "Country",
            text: currentUser?.contact?.account?.individualMetadata?.country,
            type: "select",
            options: countries,
            search: true,
        },
        {
            name: "previousAddressLine1",
            label: "Previous Address Line 1",
            text: currentUser?.contact?.account?.individualMetadata
                ?.previousAddressLine1,
        },
        {
            name: "previousAddressLine2",
            label: "Previous Address Line 2",
            text: currentUser?.contact?.account?.individualMetadata
                ?.previousAddressLine2,
        },
        {
            name: "previousCity",
            label: "Previous City",
            text: currentUser?.contact?.account?.individualMetadata
                ?.previousCity,
        },
        {
            name: "previousPostcode",
            label: "Previous Zip code/Post code",
            text: currentUser?.contact?.account?.individualMetadata
                ?.previousPostcode,
        },
        {
            name: "previousState",
            label: "Previous State/County",
            text: currentUser?.contact?.account?.individualMetadata
                ?.previousState,
        },
        {
            name: "previousCountry",
            label: "Previous Country",
            text: currentUser?.contact?.account?.individualMetadata
                ?.previousCountry,
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
            text: currentUser?.contact?.account?.individualMetadata
                ?.employerName,
        },
        {
            name: "employerAddress1",
            label: "Employer Address 1",
            text: currentUser?.contact?.account?.individualMetadata
                ?.employerAddress1,
        },
        {
            name: "employerAddress2",
            label: "Employer Address 2",
            text: currentUser?.contact?.account?.individualMetadata
                ?.employerAddress2,
        },
        {
            name: "employerAddress3",
            label: "Employer Address 3",
            text: currentUser?.contact?.account?.individualMetadata
                ?.employerAddress3,
        },
    ];
    const BankAccountDetails = [
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
    const OtherDetails = [
        {
            name: "publicPosition",
            label: "Public positions held",
            text: currentUser?.contact?.account?.individualMetadata
                ?.publicPosition,
        },
        {
            name: "highProfilePosition",
            label: "High profile position held",
            text: currentUser?.contact?.account?.individualMetadata
                ?.highProfilePosition,
        },
    ];
    const ID = [
        {
            name: "identificationType",
            label: "Identification type",
            text: identificationTypesDictionary[
                currentUser?.contact?.account?.individualMetadata
                    ?.identificationType || ""
            ],
            type: "select",
            options: identificationTypes,
        },
        {
            name: "identificationNumber",
            label: "Identification number",
            text: currentUser?.contact?.account?.individualMetadata
                ?.identificationNumber,
        },
    ];
    const [modalData, setModalData] = useState({
        url: "",
        title: "",
        fields: [],
        uuid: "",
    });
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
                    dateOfBirth: data.dateOfBirth,
                    placeOfBirth: data.placeOfBirth,
                    gender: data.gender,
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
                };
                dispatch(setIndividualMetaData(metaData));
                dispatch(setUserData(clientData));
                try {
                    await dispatch(
                        submitMetadata({
                            uuid: profileData.uuid,
                            entityType: EntityType.Individual,
                        })
                    ).unwrap();
                    await dispatch(
                        submitUser({ uuid: profileData.uuid })
                    ).unwrap();
                    openNotification(
                        "Personal Details",
                        "Personal details have been updated successfully!"
                    );
                    handleCancel();
                    window.location.reload();
                } catch (error: any) {
                    await dispatch(
                        fetchProfile({ uuid: profileData.uuid })
                    ).unwrap();
                    openErrorNotification(
                        "Personal Details",
                        error.message || "Sorry, something went wrong."
                    );
                    handleCancel();
                }
                break;
            case "Address":
            case "Employment Details":
            case "Other":
            case "ID":
                metaData = data;
                dispatch(setIndividualMetaData(metaData));
                try {
                    await dispatch(
                        submitMetadata({
                            uuid: profileData.uuid,
                            entityType: EntityType.Individual,
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
                        fetchProfile({ uuid: profileData.uuid })
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
                dispatch(setBankMetadata(bankData));
                try {
                    await dispatch(
                        submitBankMetadata({
                            uuid: profileData.uuid,
                            entityType: EntityType.Individual,
                        })
                    ).unwrap();
                    openNotification(
                        "Bank Account Details",
                        "Bank account details have been updated successfully!"
                    );
                    handleCancel();
                } catch (error: any) {
                    // console.log(error);
                    await dispatch(
                        fetchProfile({ uuid: profileData.uuid })
                    ).unwrap();
                    openErrorNotification(
                        "Bank Account Details",
                        `Errors: ${
                            error.message
                                ? error.message
                                : "Bank acount details can not be updated"
                        }`
                    );
                    //handleCancel();
                }
                break;
        }
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
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const createModal = (modalData: any) => {
        setModalData(modalData);
        showModal();
    };
    const CARDS = [
        { title: "Personal Details", type: "wide", content: PersonalDetails },
        { title: "Address", type: "wide", content: Address },
        {
            title: "Employment Details",
            type: "wide",
            content: EmploymentDetails,
        },
        {
            title: "Bank Account Details",
            type: "wide",
            content: BankAccountDetails,
        },
        { title: "Other", type: "wide", content: OtherDetails },
        { title: "ID", type: "wide", content: ID },
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
                        {/* {detail.name === "email" && (
                            <Extra style={{ marginLeft: "50px" }}>
                                <Link
                                    to="#"
                                    onClick={() => {
                                        setEmailModalStatus(true);
                                    }}
                                >
                                    Change Email Address
                                </Link>
                            </Extra>
                        )} */}
                        {/* {VALIDATION_LIST[card.title]?.includes(detail.name) && (
                            <Extra>
                                {pendingMeta && pendingMeta.length
                                    ? PENDING_TEXT(pendingMeta[0].value)
                                    : VALIDATION_TEXT}
                            </Extra>
                        )} */}
                    </RowItem>
                );
            })}
            {card.title === "Personal Details" && (
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
    const loading = useAppSelector(selectLoadingStatus) === "loading";
    const [emailModalStatus, setEmailModalStatus] = useState(false);
    return (
        <FlexContainer>
            {CARDS}
            <Modal
                key={modalData.url}
                title={modalData.title}
                open={isModalVisible}
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
                    {modalData.fields.map(
                        (field: any, key: any) =>
                            !field.hide && (
                                <Form.Item
                                    key={key}
                                    label={field.label}
                                    name={field.name}
                                    style={{ marginBottom: "10px" }}
                                    rules={field.rules}
                                >
                                    {field.type === "date" ? (
                                        <DatePicker
                                            defaultValue={
                                                dateString
                                                    ? moment(dateString)
                                                    : undefined
                                            }
                                            style={{ width: "100%" }}
                                            onChange={(date, dateString) => {
                                                field.text = dateString;
                                            }}
                                        />
                                    ) : field.type === "select" ? (
                                        <Select
                                            showSearch={
                                                field.search ? true : false
                                            }
                                            defaultValue={field.text}
                                            onChange={(value) =>
                                                (field.text = value)
                                            }
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
                                            filterOption={(
                                                input,
                                                option: any
                                            ) => {
                                                if (
                                                    input.toUpperCase() ===
                                                    input
                                                )
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
                                            {Array.from(
                                                field.options as any
                                            ).map(([key, value]: any) =>
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
                                            style={{ minHeight: "120px" }}
                                            defaultValue={field.text}
                                            onChange={(e) =>
                                                (field.text = e.target.value)
                                            }
                                        />
                                    ) : (
                                        <Input
                                            autoComplete={"new-input-" + key}
                                            key={modalData.url + " " + key}
                                            defaultValue={field.text}
                                            onChange={(e) =>
                                                (field.text = e.target.value)
                                            }
                                        />
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
