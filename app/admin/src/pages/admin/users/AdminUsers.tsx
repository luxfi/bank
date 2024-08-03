import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Button from "../../../components/Button";
import { Paginator } from "../../../components/Paginator";
import { Spinner } from "../../../components/Spinner";
import {
    archiveAdminUsers,
    createAdminUsersSelector,
    listAdminUsers,
    resetAdminUsersData,
    selectAdminUsersError,
    selectAdminUsersLoadingStatus,
    selectAdminUsersNumberOfPages,
} from "../../../features/admin-users/AdminUsersSlice";
import { User } from "../../../features/auth/AuthApi";
import RequireAuth from "../../../features/auth/RequireAuth";
import { AdminRoles } from "../../../features/auth/user-role.enum";
import { useQuery } from "../../../utils/use-query";
import { DeleteButton } from "../../dashboard/components/DeleteButton";
import { ErrorText } from "../../dashboard/components/ErrorText";
import { PageTitle } from "../../dashboard/components/PageTitle";
import { Table } from "../../dashboard/components/Table";
import { TableBody } from "../../dashboard/components/TableBody";
import { TableCell } from "../../dashboard/components/TableCell";
import { TableHeadWithItems } from "../../dashboard/components/TableHead";
import { TableRow } from "../../dashboard/components/TableRow";
import { TopContainer } from "../../dashboard/components/TopContainer";
import AdminDashboardLayout from "../components/AdminDashboardLayout";
import { confirm } from "../../../components/Modal";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { archiveUser } from "../../../features/admin-users/AdminUsersApi";
import {
    openErrorNotification,
    openNotification,
} from "../../../components/Notifications";
import { selectCurrentUser } from "../../../features/auth/AuthSlice";

export default function AdminUsers() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const query = useQuery();

    const pageNumber = parseInt(query.get("page") || "1");
    const numberOfPages = useAppSelector(selectAdminUsersNumberOfPages);
    const users = useAppSelector(createAdminUsersSelector(pageNumber));

    const status = useAppSelector(selectAdminUsersLoadingStatus);
    const isLoading = status === "loading";
    const error = useAppSelector(selectAdminUsersError);
    const currentUser = useAppSelector(selectCurrentUser);
    React.useEffect(() => {
        dispatch(listAdminUsers({ page: pageNumber }));
    }, [dispatch, pageNumber]);

    return (
        <RequireAuth roles={AdminRoles}>
            <AdminDashboardLayout>
                {isLoading ? (
                    <Spinner />
                ) : (
                    <>
                        <PageTitle>Admin Users</PageTitle>

                        <TopContainer>
                            <Button
                                primary
                                onClick={() => navigate("/admin/users/new")}
                            >
                                Add Admin User
                            </Button>
                        </TopContainer>

                        {error ? <ErrorText>{error} </ErrorText> : null}

                        <Table>
                            <TableHeadWithItems
                                items={[
                                    "First name",
                                    "Last name",
                                    "E-mail",
                                    "Actions",
                                ]}
                            />

                            <TableBody>
                                {users &&
                                    users.map((user) => (
                                        <UserItem
                                            key={user.uuid}
                                            user={user}
                                            page={pageNumber}
                                            access={"full"}
                                        />
                                    ))}
                            </TableBody>
                        </Table>

                        <Paginator
                            page={pageNumber}
                            pageCount={numberOfPages}
                            setPage={(page) => {
                                navigate(`/admin/admins/?page=${page}`);
                            }}
                        />
                    </>
                )}
            </AdminDashboardLayout>
        </RequireAuth>
    );
}

function UserItem({
    user,
    page,
    access,
}: {
    user: User;
    page: number;
    access: string;
}) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    return (
        <TableRow>
            <TableCell>{user.firstname}</TableCell>
            <TableCell>{user.lastname}</TableCell>
            <TableCell>{user.username}</TableCell>
            {access === "full" ? (
                <TableCell>
                    <Button
                        primary
                        size="small"
                        onClick={() => navigate(`/admin/users/${user.uuid}`)}
                    >
                        Edit
                    </Button>
                    <Button
                        danger
                        size="small"
                        onClick={() => {
                            confirm({
                                title: "Archive User",
                                icon: <ExclamationCircleFilled />,
                                content:
                                    "Are you sure you want to archive this user?",
                                onOk() {
                                    return new Promise((resolve, reject) =>
                                        archiveUser(user.uuid)
                                            .then((response) => {
                                                dispatch(resetAdminUsersData());
                                                dispatch(
                                                    listAdminUsers({ page })
                                                );
                                                resolve(
                                                    openNotification(
                                                        "Archive Admin User",
                                                        "The user was archived successfully."
                                                    )
                                                );
                                            })
                                            .catch(() => {
                                                resolve(
                                                    openErrorNotification(
                                                        "Archive Admin User",
                                                        "Sorry, the user could not be archived."
                                                    )
                                                );
                                            })
                                    );
                                },
                                onCancel() {
                                    console.log("Cancel");
                                },
                            });
                        }}
                    >
                        Archive
                    </Button>
                </TableCell>
            ) : (
                ""
            )}
        </TableRow>
    );
}
