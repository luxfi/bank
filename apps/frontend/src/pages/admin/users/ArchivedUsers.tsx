import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Button from "../../../components/Button";
import { User } from "../../../features/auth/AuthApi";
import { selectCurrentUser } from "../../../features/auth/AuthSlice";
import RequireAuth from "../../../features/auth/RequireAuth";
import { AdminRoles, UserAdminRoles, UserOrAdminRoles, UserPaymentRoles } from "../../../features/auth/user-role.enum";
import { createUsersSelector, listUsers, resetUsersData, selectUsersError, selectUsersLoadingStatus, selectUsersNumberOfPages } from "../../../features/users/UsersSlice";
import { useQuery } from "../../../utils/use-query";
import UserRoleChecker from "../../../utils/UserRoleChecker";
import DashboardLayout from "../../dashboard/components/DashboardLayout";
import { PageTitle } from "../../dashboard/components/PageTitle";
import { Table, ResponsiveTableContainer } from "../../dashboard/components/Table";
import { TableBody } from "../../dashboard/components/TableBody";
import { TableCell } from "../../dashboard/components/TableCell";
import { TableHeadWithItems } from "../../dashboard/components/TableHead"
import { TableRow } from "../../dashboard/components/TableRow";
import { TopContainer } from "../../dashboard/components/TopContainer";
import AdminDashboardLayout from "../../admin/components/AdminDashboardLayout";
import { Paginator } from "../../../components/Paginator";
import { confirm } from "../../../components/Modal";
import { ExclamationCircleFilled } from '@ant-design/icons';
import { archiveUser } from "../../../features/users/UsersApi";
import { openErrorNotification, openNotification } from "../../../components/Notifications";
import { listArchivedUsers, selectArchivedUsers, selectLoading } from "../../../features/admin-clients/ArchivedUsersSlice";
import { dateToHuman, dateToHumanDate } from "../../../utils/text-helpers";
import { restoreUser } from "../../../features/admin-clients/AdminClientsApi";
export default function ArchivedUsers() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const query = useQuery();
    // const pageNumber = parseInt(query.get('page') || '1');
    // const numberOfPages = useAppSelector(selectUsersNumberOfPages);
    const users = useAppSelector(selectArchivedUsers);
    const loading = useAppSelector(selectLoading);
    useEffect(() => {
        dispatch(listArchivedUsers());
    }, [dispatch]);
    return <RequireAuth roles={AdminRoles}>
        <AdminDashboardLayout>
            <PageTitle>
                Users
            </PageTitle>
            <ResponsiveTableContainer>
                <Table>
                    <TableHeadWithItems items={['User', 'Archived Date', 'Role', 'Actions']} />

                    <TableBody>
                        {users.map((user, index) => (
                            <UserItem index={index} key={user.uuid} user={user} />
                        ))}
                    </TableBody>
                </Table>
            </ResponsiveTableContainer>
        </AdminDashboardLayout>
    </RequireAuth>;
}

const UserItem = ({ user, page = 1, index }: { user: User, page?: number, index: number }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(selectCurrentUser);
    return <TableRow index={index}>
        <TableCell>
            {user.username} <br />
            {user.firstname} {user.lastname}
        </TableCell>
        <TableCell>
            {dateToHumanDate(user.archivedAt)}
        </TableCell>
        <TableCell>
            {user.role}
        </TableCell>
        <TableCell>
            <Button danger size='small' onClick={() => {
                confirm({
                    title: 'Restore User',
                    icon: <ExclamationCircleFilled />,
                    content: 'Are you sure you want to restore this user?',
                    onOk() {
                        return new Promise((resolve, reject) => {
                            restoreUser(user.uuid).then((response) => {
                                dispatch(listArchivedUsers()).unwrap().finally(() => {
                                    resolve(openNotification('Restore User', 'The user was restored successfully.'));
                                });
                            }).catch(() => {
                                console.log('something went wrong');
                                resolve(openErrorNotification('Restore User', 'Sorry, the user could not be restored.'));
                            })
                        })
                    },
                    onCancel() {
                        console.log('Cancel');
                    },
                })
            }}>
                Restore
            </Button>
        </TableCell>
    </TableRow>;
}
