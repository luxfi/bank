import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Button as AntButton, Modal, Space, Tooltip } from "antd";
import { Formik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import Button, { EditButton } from "../../../../components/Button";
import { Card } from "../../../../components/Card";
import { ButtonContainer } from "../../../../components/LeftPart";
import { RowItem } from "../../../../components/RowItem";

import { Spinner } from "../../../../components/Spinner";
import {
    selectAdminClientLinkedUsers,
    selectAdminClientsError,
    selectAdminClientsLoadingStatus,
    submitAdminClientLinkedUserData,
    submitAdminClientRemoveLinkedUser,
} from "../../../../features/admin-clients/AdminClientsSlice";
import { ErrorText } from "../../../dashboard/components/ErrorText";
import {
    FlexibleForm,
    FlexibleFormFieldWithPadding as FlexibleFormField,
} from "../../../dashboard/components/FlexibleForm";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import InputField from "../../../../components/InputField";
import { openNotification } from "../../../../components/Notifications";
import SelectInputField from "../../../../components/SelectInputField";
import {
    AdminUserDto,
    adminUserSchema,
} from "../../../../features/admin-users/model/adminUserSchema";
import { selectCurrentUser } from "../../../../features/auth/AuthSlice";
import { userRoles } from "../../../../features/invitation/model/user-roles";
import { emailExists } from "../../../../features/registration/RegistrationApi";
import { countriesToSelect } from "../../../../features/registration/model/countries";
const MyModal = styled(Modal)`
    .ant-modal-header {
        background-color: #00569e;
    }
    .ant-modal-title,
    .ant-modal-close {
        color: white;
    }
    .ant-modal-close:hover {
        color: gray;
    }
`;

export const ClientLinkedUsers = ({
    createModal,
    remove,
}: {
    createModal: any;
    remove: any;
}): JSX.Element => {
    const dispatch = useAppDispatch();
    const linkedUserData = useAppSelector(selectAdminClientLinkedUsers);
    const [linkUserModalState, setLinkUserModalState] = useState(false);
    const loading =
        useAppSelector(selectAdminClientsLoadingStatus) === "loading";
    const error = useAppSelector(selectAdminClientsError);
    const currentUser = useAppSelector(selectCurrentUser);
    const { client_id } = useParams();

    console.log(client_id);
    const [emailVerifyMessage, setEmailVerifyMessage] = useState("");
    const [disableButton, setDisableButton] = useState(false);

    const [formInitialValues, setFormInitialValues] = useState<AdminUserDto>({
        email: "",
        confirmPassword: "",
        firstname: "",
        lastname: "",
        country: "",
        mobileNumber: "",
        password: "",
        role: "user:member",
        uuid: "",
    });

    const showLinkUserModal = () => {
        setLinkUserModalState(true);
    };
    const hideLinkUserModal = () => {
        setLinkUserModalState(false);
    };
    const removeLinkedUser = async (uuid: string) => {
        await dispatch(
            submitAdminClientRemoveLinkedUser({
                uuid: uuid,
                clientId: client_id || "",
            })
        );
    };
    let linkedUsers: any[] = [];
    linkedUserData.forEach((user, index) => {
        let temp = {
            name: "userName",
            label: user.firstname + " " + user.lastname,
            text: user.role,
            uuid: user.uuid,
            details: [
                {
                    name: "email",
                    label: "Email",
                    text: user.username,
                    rules: [
                        {
                            required: true,
                            message: "Required field!",
                            type: "email",
                        },
                    ],
                    key: "email-ln",
                    checkEmail: true,
                },
                {
                    name: "firstname",
                    label: "First Name",
                    text: user.firstname,
                    rules: [{ required: true, message: "Required field!" }],
                    key: "firstName-ln",
                },
                {
                    name: "lastname",
                    label: "Last Name",
                    text: user.lastname,
                    rules: [{ required: true, message: "Required field!" }],
                    key: "lastName-ln",
                },
                {
                    name: "mobileNumber",
                    label: "Mobile Number",
                    type: "mobileNumber",
                    text: user.contact.mobileNumber,
                    rules: [{ required: true, message: "Required field!" }],
                    key: "mobileNumber-ln",
                },
                {
                    name: "country",
                    label: "Country",
                    type: "select",
                    text: user.contact.country,
                    rules: [{ required: true, message: "Required field!" }],
                    key: "country-ln",
                    options: countriesToSelect,
                },
                {
                    name: "role",
                    label: "Role",
                    type: "select",
                    text: user.role,
                    options: userRoles(currentUser?.role),
                    rules: [{ required: true, message: "Required field!" }],
                    key: "role-ln",
                },
                {
                    name: "password",
                    label: "Password",
                    text: "",
                    type: "password",
                    key: "password-ln",
                },
                {
                    name: "confirmPassword",
                    label: "Confirm Password",
                    text: "",
                    type: "password",
                    key: "confirm2-ln",
                    rules: [
                        ({ getFieldValue }: any) => ({
                            validator(_: any, value: any) {
                                if (
                                    !value ||
                                    getFieldValue("password") === value
                                ) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error(
                                        "The two passwords that you entered do not match!"
                                    )
                                );
                            },
                        }),
                    ],
                },
            ],
        };
        linkedUsers.push(temp);
    });

    const handleVerifyEmail = async (email: string) => {
        setEmailVerifyMessage("");

        if (!email) return;

        const res = await emailExists(email)
            .then((c) => {
                return c;
            })
            .catch((e) => {
                if (e.statusCode === 400) {
                    setEmailVerifyMessage("User already exists!");
                    setDisableButton(true);
                }

                setFormInitialValues({
                    firstname: "",
                    lastname: "",
                    country: "",
                    email: email,
                    mobileNumber: "",
                    role: "user:member",
                    password: "",
                    confirmPassword: "",
                    uuid: "",
                });
                return null;
            });

        if (!res) return;

        setEmailVerifyMessage(
            "Please be advised that the email is already associated with an active user account."
        );

        const { firstname, lastname, role, contact } = res;
        const { mobileNumber, country } = contact;

        const invitationData: AdminUserDto = {
            firstname,
            lastname,
            email: email,
            mobileNumber,
            role,
            country,
            password: "",
            confirmPassword: "",
            uuid: "",
        };
        setFormInitialValues(invitationData);
    };
    return (
        <>
            <Card title="Linked Users">
                {linkedUsers.map((detail, index) => (
                    <RowItem
                        key={index}
                        label={detail.label}
                        text={userRoles(currentUser?.role).get(detail.text)}
                        odd={index % 2 === 1 ? "even" : "odd"}
                    >
                        <Space>
                            <Tooltip title="Edit">
                                <AntButton
                                    icon={<EditOutlined />}
                                    onClick={() =>
                                        createModal({
                                            url: index,
                                            title: "Linked User Details",
                                            fields: detail.details,
                                            uuid: detail.uuid,
                                        })
                                    }
                                />
                            </Tooltip>
                            <Tooltip title="Remove">
                                <AntButton
                                    icon={<DeleteOutlined />}
                                    onClick={() =>
                                        remove(
                                            String(detail.uuid),
                                            removeLinkedUser,
                                            detail.uuid
                                        )
                                    }
                                />
                            </Tooltip>
                        </Space>
                    </RowItem>
                ))}
                <ButtonContainer>
                    <EditButton
                        secondary
                        size="small"
                        onClick={showLinkUserModal}
                    >
                        Add
                    </EditButton>
                </ButtonContainer>
            </Card>
            <MyModal
                title="Add a New User"
                open={linkUserModalState}
                onCancel={hideLinkUserModal}
                footer={[]}
            >
                <Formik
                    enableReinitialize
                    initialValues={formInitialValues}
                    validationSchema={adminUserSchema}
                    onSubmit={async (values) => {
                        dispatch(
                            submitAdminClientLinkedUserData({
                                data: values,
                                uuid: client_id,
                            })
                        );
                        openNotification(
                            "Add Company User",
                            "The new user has been added successfully!"
                        );
                        hideLinkUserModal();
                        setFormInitialValues({
                            email: "",
                            confirmPassword: "",
                            firstname: "",
                            lastname: "",
                            country: "",
                            mobileNumber: "",
                            password: "",
                            role: "user:member",
                            uuid: "",
                        });
                    }}
                >
                    {({ values, setFieldValue, resetForm, setErrors }) => (
                        <FlexibleForm>
                            <Row>
                                <InputField
                                    type="email"
                                    name="email"
                                    labeltext="E-mail"
                                    placeholder="email@example.com"
                                    onBlur={(e: any) => {
                                        handleVerifyEmail(e.target.value);
                                    }}
                                    onFocus={() => {
                                        setEmailVerifyMessage("");
                                        setDisableButton(false);
                                    }}
                                />
                            </Row>
                            {emailVerifyMessage && (
                                <Row>
                                    <EmailMessageContainer>
                                        <ExclamationCircleOutlined />
                                        {emailVerifyMessage}
                                    </EmailMessageContainer>
                                </Row>
                            )}

                            <FlexibleFormField
                                labeltext="First name"
                                name="firstname"
                                placeholder="John"
                            />

                            <FlexibleFormField
                                labeltext="Last name"
                                name="lastname"
                                placeholder="Smith"
                            />

                            <div
                                style={{
                                    padding: "10px 20px",
                                    width: "100%",
                                    marginRight: "10px",
                                }}
                            >
                                <SelectInputField
                                    labeltext="Country"
                                    name="country"
                                    options={countriesToSelect}
                                />
                            </div>
                            <div
                                style={{
                                    padding: "10px 20px",
                                    width: "100%",
                                    marginRight: "10px",
                                }}
                            >
                                <InputField
                                    name="mobileNumber"
                                    id="mobileNumber"
                                    labeltext="Mobile Number *"
                                    variant="phone"
                                    onChange={(v: any) => {
                                        setFieldValue("mobileNumber", v, true);
                                    }}
                                />
                            </div>

                            <Row>
                                <SelectInputField
                                    style={{ minWidth: "100%" }}
                                    className="role-input"
                                    name="role"
                                    labeltext="Role"
                                    options={userRoles(currentUser?.role)}
                                />
                            </Row>

                            <FlexibleFormField
                                type="password"
                                labeltext="Password"
                                name="password"
                                placeholder="Password"
                                disabled={!!emailVerifyMessage}
                            />

                            <FlexibleFormField
                                type="password"
                                labeltext="Confirm password"
                                name="confirmPassword"
                                placeholder="Password"
                                disabled={!!emailVerifyMessage}
                            />
                            {error ? <ErrorText>{error}</ErrorText> : null}
                            {loading ? (
                                <Spinner />
                            ) : (
                                <Button
                                    type="submit"
                                    style={{ marginLeft: "auto" }}
                                    secondary
                                    disabled={disableButton}
                                    size="long"
                                >
                                    Save
                                </Button>
                            )}
                        </FlexibleForm>
                    )}
                </Formik>
            </MyModal>
        </>
    );
};

export const Row = styled.div`
    display: flex;
    width: 100%;
    padding: 10px 20px;

    div {
        width: 100%;
        margin-right: 10px;
    }
`;
export const EmailMessageContainer = styled.div`
    display: flex;
    gap: 0.5rem;
    color: red;
    font-weight: 500;
    font-size: 14px;
    margin-left: 0.5rem;
    margin-bottom: 1rem;
`;
