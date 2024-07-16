import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Button from "../../../components/Button";
import { Spinner } from "../../../components/Spinner";
import RequireAuth from "../../../features/auth/RequireAuth";
import { AdminRoles } from "../../../features/auth/user-role.enum";
import { entityTypes } from "../../../features/beneficiaries/model/entity-types";
import { countries } from "../../../features/registration/model/countries";
import { ButtonsRow } from "../../dashboard/components/ButtonsRow";
import { ErrorText } from "../../dashboard/components/ErrorText";
import {
    FlexibleForm,
    FlexibleFormField,
    FlexibleFormSelectField,
} from "../../dashboard/components/FlexibleForm";

import { ExclamationCircleOutlined } from "@ant-design/icons";
import { FormRow } from "../../dashboard/components/FormRow";
import { HalfWidth } from "../../dashboard/components/HalfWidth";
import { PageTitle } from "../../dashboard/components/PageTitle";
import AdminDashboardLayout from "../components/AdminDashboardLayout";
import PhoneInput from "react-phone-number-input";
import InputFieldsSharedStyles from "../../../components/styles/input-fields-shared-styles";
import styled from "styled-components";
import { businessRoles } from "../../../features/registration/model/businessRoles";
import { adminClientSchema } from "../../../features/admin-clients/model/adminClientSchema";
import {
    fetchAdminClient,
    resetAdminClientsData,
    resetSelectedClientUserData,
    selectAdminClientsError,
    selectAdminClientsLoadingStatus,
    selectAdminClientUserData,
    setSelectedClientUserData,
    submitAdminClient,
} from "../../../features/admin-clients/AdminClientsSlice";
import { yesOrNo } from "../../../utils/select-options";
import { emailExists } from "../../../features/registration/RegistrationApi";

export default function AdminClientUserForm() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { uuid } = useParams();

    const [emailVerifyMessage, setEmailVerifyMessage] = useState("");

    const status = useAppSelector(selectAdminClientsLoadingStatus);
    const isLoading = status === "loading";
    const error = useAppSelector(selectAdminClientsError);
    const formData = useAppSelector(selectAdminClientUserData);
    const [existUser, setExistUser] = useState(false);

    useEffect(() => {
        if (uuid && uuid !== "new") {
            dispatch(fetchAdminClient({ uuid: uuid }));
        } else {
            dispatch(resetSelectedClientUserData());
        }
    }, [dispatch, uuid]);
    const onSubmit = async (values: any) => {
        dispatch(
            setSelectedClientUserData({
                ...values,
                skipWelcomeEmail: values.skipWelcomeEmail !== "yes",
            })
        );
        const client = await dispatch(
            submitAdminClient({ uuid: uuid || "new" })
        ).unwrap();
        dispatch(resetAdminClientsData());

        const clientId = client.userClients.slice(-1)[0]?.client.uuid;

        if (!uuid || uuid === "new") {
            navigate(`/admin/clients/${client.uuid}/profile/${clientId}`);
        } else {
            navigate(`/admin/clients/${uuid}/profile/${clientId}`);
        }
    };

    const handleVerifyEmail = async (email: string) => {
        setEmailVerifyMessage("");
        if (!email) return;
        const res = await emailExists(email)
            .then((c) => {
                return c;
            })
            .catch((e) => {
                setExistUser(false);
                dispatch(resetSelectedClientUserData());
                dispatch(
                    setSelectedClientUserData({
                        email,
                    })
                );

                return null;
            });

        if (!res) return;

        setEmailVerifyMessage(
            "Please be advised that the email is already associated with an active user account."
        );

        dispatch(
            setSelectedClientUserData({
                id: res.uuid,
                firstname: res.firstname,
                lastname: res.lastname,
                email: res.username,
                country: res.contact.country,
                mobileNumber: res.contact.mobileNumber,
            })
        );
        setExistUser(true);
    };

    return (
        <RequireAuth roles={AdminRoles}>
            <AdminDashboardLayout>
                {isLoading ? (
                    <Spinner />
                ) : (
                    <>
                        <PageTitle>Clients</PageTitle>

                        <Formik
                            enableReinitialize
                            initialValues={formData}
                            validationSchema={adminClientSchema}
                            onSubmit={onSubmit}
                        >
                            {({ values, setFieldValue, errors, touched }) => (
                                <FlexibleForm>
                                    <FlexibleFormField
                                        labeltext="E-mail"
                                        name="email"
                                        placeholder="email@example.com"
                                        onFocus={() => {
                                            setEmailVerifyMessage("");
                                        }}
                                        onBlur={(e: any) => {
                                            handleVerifyEmail(e.target.value);
                                        }}
                                    />
                                    {emailVerifyMessage && (
                                        <EmailMessageContainer>
                                            <ExclamationCircleOutlined />
                                            {emailVerifyMessage}
                                        </EmailMessageContainer>
                                    )}
                                    <FlexibleFormSelectField
                                        labeltext="Account Type"
                                        name="entityType"
                                        placeholder=""
                                        options={entityTypes}
                                    />
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
                                    <FlexibleFormSelectField
                                        labeltext="Country"
                                        name="country"
                                        placeholder=""
                                        options={countries}
                                        style={{ width: "100%" }}
                                    />

                                    <FormRow>
                                        <HalfWidth>
                                            <Label>Mobile Number</Label>
                                            <PhoneNumberInput
                                                international
                                                defaultCountry={"IM"}
                                                value={values.mobileNumber}
                                                onChange={(value: string) =>
                                                    setFieldValue(
                                                        "mobileNumber",
                                                        value,
                                                        true
                                                    )
                                                }
                                                labeltext="Enter your phone number"
                                                placeholder="+12345678901"
                                            />
                                        </HalfWidth>
                                    </FormRow>
                                    {touched.mobileNumber &&
                                    errors.mobileNumber ? (
                                        <ErrorText>
                                            {errors.mobileNumber}
                                        </ErrorText>
                                    ) : null}

                                    {values.entityType === "business"
                                        ? getBusinessRoleFields(values)
                                        : null}

                                    {!existUser && (
                                        <>
                                            <FlexibleFormField
                                                helpText={
                                                    uuid && uuid !== "new"
                                                        ? "Leave empty to keep the password unchanged."
                                                        : undefined
                                                }
                                                type="password"
                                                labeltext="Password"
                                                name="password"
                                                placeholder="Password"
                                            />

                                            <FlexibleFormField
                                                type="password"
                                                labeltext="Confirm password"
                                                name="confirmPassword"
                                                placeholder="Password"
                                            />
                                        </>
                                    )}

                                    <FlexibleFormSelectField
                                        type="select"
                                        labeltext="Send welcome email?"
                                        name="skipWelcomeEmail"
                                        placeholder="Yes"
                                        options={yesOrNo}
                                    />

                                    <ButtonsRow>
                                        <Button
                                            type="button"
                                            danger
                                            onClick={() =>
                                                navigate("/admin/clients")
                                            }
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" secondary>
                                            {uuid && uuid !== "new"
                                                ? "Update"
                                                : "Create"}{" "}
                                            Client
                                        </Button>
                                    </ButtonsRow>

                                    {error ? (
                                        <ErrorText>{error}</ErrorText>
                                    ) : null}
                                </FlexibleForm>
                            )}
                        </Formik>
                    </>
                )}
            </AdminDashboardLayout>
        </RequireAuth>
    );
}

const PhoneNumberInput = styled(PhoneInput)`
    .PhoneInputInput {
        ${InputFieldsSharedStyles}// margin-bottom: 30px;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
    }
    margin-bottom: 20px;
`;

function getBusinessRoleFields(values: any) {
    return (
        <>
            <FlexibleFormSelectField
                placeholder=""
                name="businessRoleSelect"
                labeltext="Who are you?"
                options={businessRoles}
            />

            {values.businessRoleSelect === "other" ? (
                <FlexibleFormField
                    placeholder="Please specify"
                    name="businessRole"
                    labeltext="Please specify"
                />
            ) : null}
        </>
    );
}

const Label = styled.label`
    color: ${(props) => props.theme.colors.fg};
    padding: 3px 10px;
    font-size: 0.8em;
    font-weight: bold;
`;

const EmailMessageContainer = styled.div`
    display: flex;
    gap: 0.5rem;
    color: red;
    font-weight: 500;
    font-size: 14px;
    margin-left: 0.5rem;
    margin-bottom: 1rem;
`;
