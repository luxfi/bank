import { Form as F, Input, Modal, DatePicker, Select } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import { Spinner } from "../../../components/Spinner";
import Button from "../../../components/Button";
import moment from "moment";
import styled from "styled-components";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks";
import { selectAdminClientsLoadingStatus } from "../../../features/admin-clients/AdminClientsSlice";
import { emailExists } from "../../../features/registration/RegistrationApi";
import { AdminUserDto } from "../../../features/admin-users/model/adminUserSchema";
import { useCallback, useState } from "react";
import { EmailMessageContainer, Row } from "./components/ClientLinkedUsers";
import { Loading } from "../../../features/auth/RequireAuth";

const { Option } = Select;
const Form = styled<any>(F)`
    .ant-form-item-label {
        white-space: pre-wrap;
    }
`;
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
export const ProfileModalForm = function ({
    updateProfile,
    modalData: modalDataD,
    handleCancel,
}: {
    updateProfile: any;
    modalData: any;
    handleCancel: any;
}) {
    const [form] = F.useForm();
    const modalData = { ...modalDataD };
    window.caches.delete("");
    const [isLoading, setIsLoading] = useState(false);
    const inititalShareholderType = modalData.fields
        .filter((z: any) => {
            return z.name == "entityType";
        })
        .map((z: any) => z.text)
        .pop()
        ?.toLowerCase();
    F.useWatch("entityType", form);
    const shareholderType =
        (
            form.getFieldValue("entityType") || inititalShareholderType
        )?.toLowerCase() || "individual";
    const { uuid, client_id } = useParams();
    const loading =
        useAppSelector(selectAdminClientsLoadingStatus) === "loading";
    const saveProfile = () => {
        let data = {
            uuid: "",
        };
        // eslint-disable-next-line array-callback-return
        modalData.fields
            .filter((f: any, k: any) => {
                const shareholderType = modalData.fields
                    .filter((z: any) => {
                        return z.name == "entityType";
                    })
                    .map((z: any) => z.text)
                    .pop();
                return (
                    modalData.title !== "Shareholder Details" ||
                    (shareholderType?.toLowerCase() === "business" &&
                        ["dob", "nationality", "occupation"].indexOf(f.name) ===
                            -1) ||
                    (shareholderType?.toLowerCase() === "individual" &&
                        ["companyType"].indexOf(f.name) === -1)
                );
            })
            .map((field: any, index: number) => {
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

    const [emailVerifyMessage, setEmailVerifyMessage] = useState("");
    const [disableButton, setDisableButton] = useState(false);

    const handleVerifyEmail = useCallback(
        async (email: string) => {
            setEmailVerifyMessage("");

            if (!email) return;

            setIsLoading(true);
            const res = await emailExists(email)
                .then((c) => {
                    return c;
                })
                .catch((e) => {
                    if (e.statusCode === 400) {
                        setEmailVerifyMessage("User already exists!");
                        setDisableButton(true);
                    }

                    modalData.fields.forEach((field: any) => {
                        field.text = "";
                        if (field.name === "email") field.text = email;
                        form.setFieldValue(field.name, "");
                        form.setFieldValue("email", email);
                    });
                    form.resetFields();
                    setIsLoading(false);

                    return null;
                });

            if (!res) return;

            setEmailVerifyMessage(
                "Please be advised that the email is already associated with an active user account."
            );

            const { firstname, lastname, role, contact } = res;
            const { mobileNumber, country } = contact;

            const invitationData: AdminUserDto = {
                firstname: firstname,
                lastname: lastname,
                email: email,
                mobileNumber: mobileNumber,
                role: role,
                country: country,
                password: "",
                confirmPassword: "",
                uuid: "",
            };
            modalData.fields.forEach((field: any) => {
                const name = field.name;
                const text = invitationData[name];
                field.text = text;
                form.setFieldValue(name, text);
            });
            form.resetFields();
            setIsLoading(false);
        },
        [form, modalData]
    );

    return (
        modalData.isModalVisible && (
            <MyModal
                key={modalData.url}
                title={modalData.title}
                open={modalData.isModalVisible}
                onCancel={handleCancel}
                footer={[
                    loading ? (
                        <Spinner />
                    ) : (
                        <Button
                            secondary
                            size="long"
                            disabled={disableButton}
                            onClick={() => {
                                form.submit();
                            }}
                        >
                            Save
                        </Button>
                    ),
                ]}
            >
                {isLoading ? (
                    <div>
                        <Loading />
                    </div>
                ) : (
                    <Form
                        form={form}
                        name={modalData.title}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        autoComplete="off"
                        onFinish={saveProfile}
                    >
                        {modalData.fields
                            .filter(
                                (f: any, k: any) =>
                                    modalData.title !== "Shareholder Details" ||
                                    (shareholderType === "individual" &&
                                        f.name !== "companyType") ||
                                    (shareholderType === "business" &&
                                        [
                                            "dob",
                                            "nationality",
                                            "occupation",
                                        ].indexOf(f.name) === -1)
                            )
                            .map((field: any, key: any) => {
                                //initialValue={field.type !== 'date' ? field.text : moment(field.text)}
                                const formItemAttributes =
                                    field.type === "date"
                                        ? {
                                              initialValue: field.text
                                                  ? moment(field.text)
                                                  : "",
                                          }
                                        : {
                                              initialValue: field.text,
                                          };
                                const datePickerAttributes =
                                    field.type === "date" && field.text
                                        ? {
                                              defaultValue: moment.utc(
                                                  field.text
                                              ),
                                          }
                                        : {};
                                return (
                                    field.name !== "uuid" && (
                                        <Form.Item
                                            key={key}
                                            label={field.label}
                                            name={field.name}
                                            style={{
                                                marginBottom: "10px",
                                            }}
                                            rules={
                                                field.rules
                                                    ? field.rules
                                                    : undefined
                                            }
                                            {...formItemAttributes}
                                        >
                                            {field.type === "date" ? (
                                                <>
                                                    <DatePicker
                                                        {...datePickerAttributes}
                                                        style={{
                                                            width: "100%",
                                                        }}
                                                        onChange={(
                                                            date,
                                                            dateString
                                                        ) => {
                                                            field.text =
                                                                dateString;
                                                            form.setFieldValue(
                                                                field.name,
                                                                field.text
                                                            );
                                                        }}
                                                    />
                                                </>
                                            ) : field.type === "select" ? (
                                                <>
                                                    <Select
                                                        showSearch={
                                                            field.search
                                                                ? true
                                                                : false
                                                        }
                                                        defaultValue={
                                                            field.text
                                                        }
                                                        onChange={(value) => {
                                                            field.text = value;
                                                            form.setFieldValue(
                                                                field.name,
                                                                field.text
                                                            );
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
                                                                el[
                                                                    i
                                                                ].setAttribute(
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
                                                        ).map(
                                                            ([
                                                                key,
                                                                value,
                                                            ]: any) =>
                                                                key === "GB" ? (
                                                                    <Option
                                                                        key={
                                                                            key
                                                                        }
                                                                        value={
                                                                            key
                                                                        }
                                                                        key2="UK"
                                                                    >
                                                                        {value}
                                                                    </Option>
                                                                ) : (
                                                                    <Option
                                                                        key={
                                                                            key
                                                                        }
                                                                        value={
                                                                            key
                                                                        }
                                                                    >
                                                                        {value}
                                                                    </Option>
                                                                )
                                                        )}
                                                    </Select>
                                                </>
                                            ) : field.type === "textarea" ? (
                                                <>
                                                    <TextArea
                                                        style={{
                                                            minHeight: "120px",
                                                        }}
                                                        onChange={(e) => {
                                                            field.text =
                                                                e.target.value;
                                                            form.setFieldValue(
                                                                field.name,
                                                                field.text
                                                            );
                                                        }}
                                                        defaultValue={
                                                            field.text
                                                        }
                                                    />
                                                </>
                                            ) : field.type === "password" ? (
                                                <Input.Password
                                                    disabled={
                                                        !!emailVerifyMessage
                                                    }
                                                    placeholder="Password"
                                                    iconRender={(visible) =>
                                                        visible ? (
                                                            <EyeTwoTone />
                                                        ) : (
                                                            <EyeInvisibleOutlined />
                                                        )
                                                    }
                                                    onChange={(e) => {
                                                        field.text =
                                                            e.target.value;
                                                        form.setFieldValue(
                                                            field.name,
                                                            field.text
                                                        );
                                                    }}
                                                />
                                            ) : (
                                                <>
                                                    <Input
                                                        key={
                                                            modalData.url +
                                                            " " +
                                                            key
                                                        }
                                                        disabled={
                                                            field.disabled
                                                        }
                                                        autoComplete={
                                                            "new-input-" + key
                                                        }
                                                        onChange={(e) => {
                                                            if (
                                                                field.format ===
                                                                    "number" &&
                                                                isNaN(
                                                                    Number(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                )
                                                            ) {
                                                                form.setFieldValue(
                                                                    field.name,
                                                                    field.text
                                                                );
                                                                return;
                                                            } else
                                                                form.setFieldValue(
                                                                    field.name,
                                                                    e.target
                                                                        .value
                                                                );
                                                            field.text =
                                                                e.target.value;
                                                        }}
                                                        onFocus={(e: any) => {
                                                            if (
                                                                !field.checkEmail
                                                            ) {
                                                                return;
                                                            }
                                                            setEmailVerifyMessage(
                                                                ""
                                                            );
                                                            setDisableButton(
                                                                false
                                                            );
                                                        }}
                                                        onBlur={(e: any) => {
                                                            if (
                                                                !field.checkEmail
                                                            ) {
                                                                return;
                                                            }
                                                            handleVerifyEmail(
                                                                e.target.value
                                                            );
                                                        }}
                                                        defaultValue={
                                                            field.text
                                                        }
                                                    />
                                                    {field.checkEmail &&
                                                        emailVerifyMessage && (
                                                            <Row
                                                                style={{
                                                                    padding:
                                                                        "0",
                                                                }}
                                                            >
                                                                <EmailMessageContainer
                                                                    style={{
                                                                        fontSize:
                                                                            "12px",
                                                                        padding:
                                                                            "0",
                                                                    }}
                                                                >
                                                                    <ExclamationCircleOutlined />
                                                                    {
                                                                        emailVerifyMessage
                                                                    }
                                                                </EmailMessageContainer>
                                                            </Row>
                                                        )}
                                                </>
                                            )}
                                        </Form.Item>
                                    )
                                );
                            })}
                    </Form>
                )}
            </MyModal>
        )
    );
};
