import RequireAuth from "../../../features/auth/RequireAuth";
import {
    AdminRoles,
    UserRole,
    UserRoles,
} from "../../../features/auth/user-role.enum";
import DashboardLayout from "../components/DashboardLayout";
import { RowItem } from "../../../components/RowItem";
import styled from "styled-components";
import Button, { EditButton } from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import { device } from "../../../utils/media-query-helpers";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { logout, selectCurrentUser } from "../../../features/auth/AuthSlice";
import { ucFirst } from "../../../utils/functions";
import { EntityType } from "../../../features/registration/RegistrationSlice";
import { Form, Input, Select, Space, Typography } from "antd";

import Individual from "./Individual";
import Business from "./Business";
import AdminDashboardLayout from "../../admin/components/AdminDashboardLayout";
import { Modal } from "../../../components/Modal";
import { useEffect, useState } from "react";
import { Spinner } from "../../../components/Spinner";
import {
    resetAdminUsersData,
    selectAdminUsersLoadingStatus,
    setSelectedAdminUserData,
    submitAdminUser,
} from "../../../features/admin-users/AdminUsersSlice";
import {
    openErrorNotification,
    openNotification,
} from "../../../components/Notifications";
import { getCurrentUser } from "../../../features/auth/AuthApi";

const { Option } = Select;
const { Text } = Typography;
const Header = styled.div`
    display: flex;
    @media ${device.lg} {
        justify-content: space-between;
        flex-direction: row;
    }
    flex-direction: column;
`;
const LeftPart = styled.div`
    font-size: 14px;
    min-width: 50%;
    margin-bottom: 20px;
`;
const RightPart = styled.div`
    @media ${device.xs} {
        margin: auto;
    }
`;
const ResponsiveContainer = styled.div`
    @media ${device.xs} {
        display: block;
    }
    display: flex;
    column-gap: 15px;
`;
export default function Profile() {
    const navigate = useNavigate();
    const currentUser = useAppSelector(selectCurrentUser);
    const dispatch = useAppDispatch();
    const navigationButtons = (
        <Button
            secondary
            size="long"
            margin="10px"
            onClick={() => dispatch(logout())}
        >
            Log out
        </Button>
    );
    const [profileModal, openProfileModal] = useState(false);
    const handleCancel = () => {
        openProfileModal(false);
    };
    const status = useAppSelector(selectAdminUsersLoadingStatus);
    const loading = status === "loading";
    const [form] = Form.useForm();

    const handleCheckCurrentUser = async () => {
        const currentUser = await getCurrentUser();
    };
    useEffect(() => {
        handleCheckCurrentUser();
    }, []);

    return currentUser?.role === UserRole.SuperAdmin ? (
        <RequireAuth roles={AdminRoles}>
            <AdminDashboardLayout navigationButtons={navigationButtons}>
                <Header>
                    <LeftPart>
                        <RowItem
                            label="Full Name: "
                            text={
                                currentUser?.firstname +
                                " " +
                                currentUser?.lastname
                            }
                            odd="odd"
                        />
                        <RowItem
                            label="Email: "
                            text={currentUser.username}
                            odd="odd"
                        />
                    </LeftPart>
                    <RightPart>
                        <ResponsiveContainer>
                            <Button
                                secondary
                                size="long"
                                onClick={() => {
                                    openProfileModal(true);
                                }}
                            >
                                Edit Profile
                            </Button>
                            <Button
                                secondary
                                size="long"
                                onClick={() =>
                                    navigate(
                                        "/dashboard/profile/reset-password"
                                    )
                                }
                            >
                                Reset password
                            </Button>
                        </ResponsiveContainer>
                    </RightPart>
                </Header>
                <Modal
                    key="admin-profile"
                    title="Edit Profile"
                    open={profileModal}
                    onCancel={handleCancel}
                    footer={[
                        loading ? (
                            <Spinner />
                        ) : (
                            <Button
                                secondary
                                size="long"
                                onClick={() => {
                                    form.submit();
                                }}
                            >
                                Save
                            </Button>
                        ),
                    ]}
                >
                    <Form
                        name="profile"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 16 }}
                        form={form}
                        initialValues={{
                            firstname: currentUser.firstname,
                            lastname: currentUser.lastname,
                            email: currentUser.username,
                        }}
                        onFinish={async (values) => {
                            values.role = UserRole.SuperAdmin;
                            dispatch(setSelectedAdminUserData(values));
                            await dispatch(
                                submitAdminUser({ uuid: currentUser.uuid })
                            )
                                .unwrap()
                                .then(() => {
                                    dispatch(resetAdminUsersData());
                                    openNotification(
                                        "Admin User",
                                        "The profile has been updated successfully."
                                    );
                                    navigate("/admin/admins");
                                })
                                .catch((error) => {
                                    openErrorNotification(
                                        "Admin User",
                                        error.message
                                    );
                                });
                        }}
                    >
                        <Form.Item
                            key="firstname"
                            label="First Name"
                            name="firstname"
                        >
                            <Input placeholder="First Name" />
                        </Form.Item>
                        <Form.Item
                            key="lastname"
                            label="Last Name"
                            name="lastname"
                        >
                            <Input placeholder="Last Name" />
                        </Form.Item>
                        <Form.Item
                            key="email"
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    type: "email",
                                    message:
                                        "Please input a valid email address",
                                },
                            ]}
                        >
                            <Input
                                type="email"
                                placeholder="example@email.com"
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </AdminDashboardLayout>
        </RequireAuth>
    ) : (
        <RequireAuth roles={UserRoles}>
            <DashboardLayout>
                <Header>
                    {/* <LeftPart>
                            <RowItem label='Full Name: ' text={currentUser?.firstname + ' ' + currentUser?.lastname} odd="odd" />
                            <RowItem label='Account Type: ' text={ucFirst(currentUser?.currentClient?.account?.entityType)} odd="odd" />
                        </LeftPart> */}
                    <RightPart>
                        <Button
                            secondary
                            size="long"
                            margin="10px"
                            style={{ marginBottom: "1rem" }}
                            onClick={() =>
                                navigate("/dashboard/profile/reset-password")
                            }
                        >
                            Reset password
                        </Button>
                    </RightPart>
                </Header>
                {currentUser?.currentClient?.account?.entityType ===
                EntityType.Individual ? (
                    <Individual />
                ) : (
                    currentUser?.currentClient?.account?.entityType ===
                        EntityType.Business && <Business />
                )}
            </DashboardLayout>
        </RequireAuth>
    );
}
