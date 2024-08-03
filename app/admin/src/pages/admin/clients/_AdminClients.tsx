import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Button from "../../../components/Button";
import { Paginator } from "../../../components/Paginator";
import { Spinner } from "../../../components/Spinner";
import { archiveAdminClients, createAdminClientsSelector, listAdminClients, resetAdminClientsData, selectAdminClientsError, selectAdminClientsLoadingStatus, selectAdminClientsNumberOfPages } from "../../../features/admin-clients/AdminClientsSlice";
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
import ApproveModal from "./ApproveModal";

export default function _AdminClients() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const query = useQuery();

    const pageNumber = parseInt(query.get('page') || '1');
    const numberOfPages = useAppSelector(selectAdminClientsNumberOfPages);
    const clients = useAppSelector(createAdminClientsSelector(pageNumber));

    const status = useAppSelector(selectAdminClientsLoadingStatus);
    const isLoading = status === 'loading';
    const error = useAppSelector(selectAdminClientsError);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalUuid, setModalUuid] = useState('');

    const openModal = (uuid: string) => {
        setIsModalOpen(true);
        setModalUuid(uuid);
    }

    React.useEffect(() => {
        dispatch(listAdminClients({ page: pageNumber }));
    }, [dispatch, pageNumber]);

    return <RequireAuth roles={AdminRoles}>
        <AdminDashboardLayout>
            {
                isLoading
                    ? <Spinner />
                    : <>
                        <PageTitle>
                            Clients
                        </PageTitle>

                        <TopContainer>
                            <Button primary onClick={() => navigate('/admin/clients/new')}>
                                Add Client
                            </Button>
                        </TopContainer>

                        {
                            error
                                ? <ErrorText>{error} </ErrorText>
                                : null
                        }

                        <Table>
                            <TableHeadWithItems items={['Name', 'E-mail', 'Actions']} />

                            <TableBody>
                                {clients && clients.map((client) => (
                                    <ClientItem
                                        key={client.uuid}
                                        client={client}
                                        page={pageNumber}
                                        openModal={openModal}
                                    />
                                ))}
                            </TableBody>
                        </Table>

                        <ApproveModal uuid={modalUuid} isOpen={isModalOpen} onSubmit={() => {
                            setIsModalOpen(false);
                            setModalUuid('');
                        }} />

                        <Paginator page={pageNumber} pageCount={numberOfPages} setPage={(page) => {
                            navigate(`/admin/clients/?page=${page}`);
                        }} />
                    </>
            }
        </AdminDashboardLayout>
    </RequireAuth>;
}

function ClientItem(
    { client, page, openModal }: { client: User, page: number, openModal: (uuid: string) => void }
) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    return <TableRow>
        <TableCell>
            {`${client.firstname} ${client.lastname}`}
        </TableCell>
        <TableCell>
            {client.username}
        </TableCell>
        <TableCell>
            <Button
                primary
                size='small'
                onClick={() => openModal(client.uuid)}
            >
                Link & Approve
            </Button>

            <Button
                primary
                size='small'
                onClick={() => navigate(`/admin/clients/${client.uuid}/account`)}
            >
                Edit Account
            </Button>

            <DeleteButton text="Archive" onClick={async () => {
                try {
                    const response = await dispatch(archiveAdminClients(client.uuid)).unwrap();
                    if (response) {
                        dispatch(resetAdminClientsData());
                        dispatch(listAdminClients({ page }));
                    }
                } catch (err) { }
            }} />
        </TableCell>
    </TableRow>;
}
