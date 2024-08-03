import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Button from "../../../components/Button";
import InputField from "../../../components/InputField";
import SelectInputField from "../../../components/SelectInputField";
import { Spinner } from "../../../components/Spinner";
import { selectCurrentUser } from "../../../features/auth/AuthSlice";
import RequireAuth from "../../../features/auth/RequireAuth";
import {
    AdminRoles,
    UserAdminRoles,
} from "../../../features/auth/user-role.enum";
import {
    selectInvitationError,
    selectInvitationStatus,
    setInvitationData,
    submitInvitation,
} from "../../../features/invitation/UserInvitationSlice";
import {
    invitationDto,
    invitationSchema,
} from "../../../features/invitation/model/invitation-schema";
import { userRoles } from "../../../features/invitation/model/user-roles";
import { emailExists } from "../../../features/registration/RegistrationApi";
import { countriesToSelect } from "../../../features/registration/model/countries";
import AdminDashboardLayout from "../../admin/components/AdminDashboardLayout";
import { ButtonsRow } from "../components/ButtonsRow";
import DashboardLayout from "../components/DashboardLayout";
import { ErrorText } from "../components/ErrorText";
import { FlexibleForm } from "../components/FlexibleForm";
import { FormRow } from "../components/FormRow";
import { HalfWidth } from "../components/HalfWidth";
import { HeaderContainer } from "../components/HeaderContainer";
import { PageTitle } from "../components/PageTitle";

export default function Invite() {
    const currentUser = useAppSelector(selectCurrentUser);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [formInitialValues, setFormInitialValues] = useState<any>({
        firstname: "",
        lastname: "",
        country: "",
        email: "",
        mobileNumber: "",
        userRole: "user:member",
    });
    const error = useAppSelector(selectInvitationError);
    const loading = useAppSelector(selectInvitationStatus) === "loading";
    const [showButtonAttr, setButtonShowAttr] = useState("none");
    const [disableButton, setDisableButton] = useState(false);
    const [flag, setFlag] = useState(false);
    const [emailVerifyMessage, setEmailVerifyMessage] = useState("");

    const refreshPage = () => {
        window.location.reload();
    };
    useEffect(() => {
        if (flag)
            setTimeout(() => {
                setButtonShowAttr("none");
                // refreshPage();
            }, 3000);
    }, [flag]);

    const GetLayout = ({ children }: any) => {
        if (currentUser && AdminRoles.includes(currentUser.role)) {
            return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
        }
        return <DashboardLayout>{children}</DashboardLayout>;
    };

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
                    userRole: "user:member",
                });
                return null;
            });

        if (!res) return;

        setEmailVerifyMessage(
            "Please be advised that the email is already associated with an active user account."
        );

        const { firstname, lastname, role, contact } = res;
        const { country, mobileNumber } = contact;

        const invitationData: invitationDto = {
            firstname,
            lastname,
            email: email,
            country,
            mobileNumber,
            userRole: role,
        };
        setFormInitialValues(invitationData);
        dispatch(setInvitationData(invitationData));
    };

    return (
        <RequireAuth roles={UserAdminRoles}>
            <GetLayout>
                <HeaderContainer>
                    <PageTitle>Invite a user</PageTitle>
                </HeaderContainer>
                <HeaderContainer>
                    <PageTitle
                        style={{ color: "#32CD32", display: showButtonAttr }}
                    >
                        You have successfully sent the invitation to the user.
                    </PageTitle>
                </HeaderContainer>
                <Formik
                    initialValues={formInitialValues}
                    validateOnChange={false}
                    validationSchema={invitationSchema}
                    onSubmit={async (values) => {
                        try {
                            await dispatch(setInvitationData(values));
                            await dispatch(submitInvitation()).unwrap();
                            setFlag(true);
                            setButtonShowAttr("block");

                            setFormInitialValues({
                                firstname: "",
                                lastname: "",
                                country: "",
                                email: "",
                                mobileNumber: "",
                                userRole: "user:member",
                            });

                            // navigate('/');
                        } catch (err) {}
                    }}
                >
                    {({ values, setFieldValue }) => (
                        <FlexibleForm>
                            <FormRow>
                                <HalfWidth>
                                    <InputField
                                        type="email"
                                        name="email"
                                        labeltext="Email *"
                                        placeholder="email@example.com"
                                        onFocus={() => {
                                            setEmailVerifyMessage("");
                                            setDisableButton(false);
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
                                </HalfWidth>
                            </FormRow>

                            <FormRow>
                                <HalfWidth>
                                    <InputField
                                        name="mobileNumber"
                                        id="mobileNumber"
                                        labeltext="Mobile Number *"
                                        variant="phone"
                                        onChange={(v: any) => {
                                            setFieldValue(
                                                "mobileNumber",
                                                v,
                                                true
                                            );
                                        }}
                                    />
                                </HalfWidth>
                            </FormRow>

                            <FormRow>
                                <HalfWidth>
                                    <InputField
                                        name="firstname"
                                        labeltext="First name *"
                                        placeholder="John"
                                    />
                                </HalfWidth>
                            </FormRow>

                            <FormRow>
                                <HalfWidth>
                                    <InputField
                                        name="lastname"
                                        labeltext="Last name *"
                                        placeholder="Doe"
                                    />
                                </HalfWidth>
                            </FormRow>

                            <FormRow>
                                <HalfWidth>
                                    <SelectInputField
                                        labeltext="Country *"
                                        name="country"
                                        options={countriesToSelect}
                                    />
                                </HalfWidth>
                            </FormRow>

                            <FormRow>
                                <HalfWidth>
                                    <SelectInputField
                                        name="userRole"
                                        labeltext="Role *"
                                        options={userRoles(currentUser?.role)}
                                    />
                                </HalfWidth>
                            </FormRow>

                            {error ? <ErrorText>{error}</ErrorText> : null}

                            <ButtonsRow>
                                {loading ? (
                                    <Spinner />
                                ) : (
                                    <Button
                                        type="submit"
                                        primary
                                        disabled={disableButton}
                                    >
                                        Invite
                                    </Button>
                                )}
                            </ButtonsRow>
                        </FlexibleForm>
                    )}
                </Formik>
            </GetLayout>
        </RequireAuth>
    );
}

const EmailMessageContainer = styled.div`
    display: flex;
    gap: 0.5rem;
    color: red;
    font-weight: 500;
    font-size: 14px;
    margin-left: 0.5rem;
    margin-bottom: 1rem;
`;
