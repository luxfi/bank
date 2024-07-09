import { ExclamationCircleFilled } from "@ant-design/icons";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Button from "../../../components/Button";
import { confirm } from "../../../components/Modal";
import {
    openErrorNotification,
    openNotification,
} from "../../../components/Notifications";
import { Paginator } from "../../../components/Paginator";
import { User } from "../../../features/auth/AuthApi";
import { selectCurrentUser } from "../../../features/auth/AuthSlice";
import RequireAuth from "../../../features/auth/RequireAuth";
import {
    UserAdminRoles,
    UserOrAdminRoles,
    UserPaymentRoles,
    UserRole,
} from "../../../features/auth/user-role.enum";
import { archiveUser } from "../../../features/users/UsersApi";
import {
    createUsersSelector,
    listUsers,
    resetUsersData,
    selectUsersError,
    selectUsersLoadingStatus,
    selectUsersNumberOfPages,
} from "../../../features/users/UsersSlice";
import UserRoleChecker from "../../../utils/UserRoleChecker";
import { useQuery } from "../../../utils/use-query";
import AdminDashboardLayout from "../../admin/components/AdminDashboardLayout";
import DashboardLayout from "../components/DashboardLayout";
import { PageTitle } from "../components/PageTitle";
import { ResponsiveTableContainer, Table } from "../components/Table";
import { TableBody } from "../components/TableBody";
import { TableCell } from "../components/TableCell";
import { TableHeadWithItems } from "../components/TableHead";
import { TableRow } from "../components/TableRow";
import { TopContainer } from "../components/TopContainer";
export default function UsersList() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const query = useQuery();

    const pageNumber = parseInt(query.get("page") || "1");
    const numberOfPages = useAppSelector(selectUsersNumberOfPages);
    const users = useAppSelector(createUsersSelector(pageNumber));

    const status = useAppSelector(selectUsersLoadingStatus);
    const isLoading = status === "loading";
    const error = useAppSelector(selectUsersError);
    const currentUser = useAppSelector(selectCurrentUser);
    useEffect(() => {
        dispatch(listUsers({ page: pageNumber }));
    }, [dispatch, pageNumber]);
    const Layout =
        currentUser?.role !== "admin:super"
            ? DashboardLayout
            : AdminDashboardLayout;
    return (
        <RequireAuth roles={UserOrAdminRoles}>
            <Layout>
                <PageTitle>Users</PageTitle>
                <UserRoleChecker roles={UserAdminRoles}>
                    {currentUser?.role === "admin:super" ||
                        (currentUser?.currentClient?.account?.entityType ===
                            "business" && (
                            <TopContainer>
                                <Button
                                    primary
                                    onClick={() =>
                                        navigate("/dashboard/users/invite")
                                    }
                                >
                                    Invite a user
                                </Button>
                            </TopContainer>
                        ))}
                </UserRoleChecker>
                <ResponsiveTableContainer>
                    <Table>
                        <TableHeadWithItems
                            items={["User", "Approved", "Role", "Actions"]}
                        />

                        <TableBody>
                            {users.map((user, index) => (
                                <UserItem
                                    index={index}
                                    key={user.uuid}
                                    user={user}
                                    page={pageNumber}
                                />
                            ))}
                        </TableBody>
                    </Table>
                    <Paginator
                        page={pageNumber}
                        pageCount={numberOfPages}
                        setPage={(page) => {
                            navigate(`/admin/users/?page=${page}`);
                        }}
                    />
                </ResponsiveTableContainer>
            </Layout>
        </RequireAuth>
    );
}

const UserItem = ({
    user,
    page,
    index,
}: {
    user: User;
    page: number;
    index: number;
}) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(selectCurrentUser);
    return (
        <TableRow index={index}>
            <TableCell>
                {user.username} <br />
                {user.firstname} {user.lastname}
            </TableCell>
            <TableCell>Yes</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>
                <UserRoleChecker
                    roles={[UserRole.AdminUser, UserRole.SuperAdmin]}
                    ignore
                >
                    {currentUser?.username !== user.username && (
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
                                                    // console.log('response', response);
                                                    dispatch(resetUsersData());
                                                    dispatch(
                                                        listUsers({
                                                            page,
                                                        })
                                                    );
                                                    resolve(
                                                        openNotification(
                                                            "Archive User",
                                                            "The user was archived successfully."
                                                        )
                                                    );
                                                })
                                                .catch(() => {
                                                    // console.log('something went wrong');
                                                    resolve(
                                                        openErrorNotification(
                                                            "Archive User",
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
                    )}
                </UserRoleChecker>
            </TableCell>
        </TableRow>
    );
};
