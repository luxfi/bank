import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Button from "../../../components/Button";
import { Paginator } from "../../../components/Paginator";
import { Spinner } from "../../../components/Spinner";
import { Link } from "react-router-dom";
import { countryToAlpha2 } from "country-to-iso";
import {
    archiveAdminClients,
    createAdminClientsSelector,
    listAdminClients,
    resetAdminClientsData,
    selectAdminClientsCurrentPage,
    selectAdminClientsError,
    selectAdminClientsLoadingStatus,
    selectAdminClientsNumberOfPages,
} from "../../../features/admin-clients/AdminClientsSlice";
import { archiveClient } from "../../../features/admin-clients/AdminClientsApi";
import { User } from "../../../features/auth/AuthApi";
import RequireAuth from "../../../features/auth/RequireAuth";
import { AdminRoles } from "../../../features/auth/user-role.enum";
import { useQuery } from "../../../utils/use-query";
import { ErrorText } from "../../dashboard/components/ErrorText";
import { PageTitle } from "../../dashboard/components/PageTitle";
import {
    ResponsiveTableContainer,
    Table,
} from "../../dashboard/components/Table";
import { TableBody } from "../../dashboard/components/TableBody";
import { TableCell } from "../../dashboard/components/TableCell";
import { TableHeadWithItems } from "../../dashboard/components/TableHead";
import { TableRow } from "../../dashboard/components/TableRow";
import {
    TopLeftContainer,
    RowGroup,
} from "../../dashboard/components/Containers";
import AdminDashboardLayout from "../components/AdminDashboardLayout";
import { Form, Input, Select, Tooltip } from "antd";
import { countries } from "../../../features/registration/model/countries";
import { confirm } from "../../../components/Modal";
import { ExclamationCircleFilled } from "@ant-design/icons";
import {
    openErrorNotification,
    openNotification,
} from "../../../components/Notifications";

export default function AdminClients() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const query = useQuery();
    const pageNumberToLoad = parseInt(query.get("page") || "1");
    const pageNumber = useAppSelector(selectAdminClientsCurrentPage);
    const [searchQuery, setSearchQuery] = React.useState(
        query.get("search") || ""
    );
    const numberOfPages = useAppSelector(selectAdminClientsNumberOfPages);
    const dispatchedClients = useAppSelector(
        createAdminClientsSelector(pageNumber)
    );

    const status = useAppSelector(selectAdminClientsLoadingStatus);
    const isLoading = status === "loading";
    const error = useAppSelector(selectAdminClientsError);
    const [clients, setClients] = useState<User[]>([]);
    React.useEffect(() => {
        dispatch(
            listAdminClients({
                page: 1,
                searchQuery,
            })
        );
    }, [searchQuery]);
    const navigationButtons = (
        <div>
            <Button
                secondary
                size="long"
                margin="10px"
                onClick={() => navigate("/admin/clients/new")}
                style={{ width: "auto" }}
            >
                Add Account
            </Button>
        </div>
    );

    React.useEffect(() => {
        dispatch(
            listAdminClients({
                page: pageNumberToLoad,
            })
        );
    }, [dispatch, pageNumberToLoad]);

    React.useEffect(() => {
        setClients(dispatchedClients);
    }, [dispatchedClients]);
    const countryOptions: any[] = [];
    countries.forEach((c, i) => {
        countryOptions.push(<Select.Option value={i}>{c}</Select.Option>);
    });

    return (
        <RequireAuth roles={AdminRoles}>
            <AdminDashboardLayout navigationButtons={navigationButtons}>
                <PageTitle>Clients</PageTitle>
                <TopLeftContainer>
                    <Form
                        name="filter"
                        initialValues={{ remember: true }}
                        autoComplete="off"
                        onFieldsChange={(changedFields, allFields) => {
                            let filteredClients = dispatchedClients;
                            const q = allFields
                                .map((field) => {
                                    if (field.name == "country") {
                                        field.value = countryToAlpha2(
                                            field.value
                                        );
                                    }
                                    return field.value
                                        ? encodeURIComponent(
                                              field.name.toLocaleString()
                                          ) +
                                              "=" +
                                              encodeURIComponent(field.value)
                                        : null;
                                })
                                .filter((field) => field)
                                .join("&");
                            setSearchQuery(q || "");
                            //setClients(filteredClients);
                        }}
                    >
                        <RowGroup>
                            <Form.Item
                                name="name"
                                style={{ marginLeft: "10px" }}
                            >
                                <Input placeholder="Name" />
                            </Form.Item>
                            <Form.Item
                                name="entityType"
                                style={{ marginLeft: "10px", width: "260px" }}
                            >
                                <Select placeholder="Individual / Business">
                                    <Select.Option value="">
                                        Individual / Business
                                    </Select.Option>
                                    <Select.Option value="individual">
                                        Individual
                                    </Select.Option>
                                    <Select.Option value="business">
                                        Business
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="country"
                                style={{ marginLeft: "10px" }}
                            >
                                <Select placeholder="Country">
                                    <Select.Option value="">
                                        Any Country
                                    </Select.Option>
                                    {countryOptions}
                                </Select>
                            </Form.Item>
                        </RowGroup>
                    </Form>
                </TopLeftContainer>
                {isLoading ? (
                    <Spinner />
                ) : (
                    <>
                        {error ? <ErrorText>{error} </ErrorText> : null}
                        <ResponsiveTableContainer>
                            <Table>
                                <TableHeadWithItems
                                    items={[
                                        "Name",
                                        "Risk Rating",
                                        "PEP",
                                        "Country",
                                        "Actions",
                                    ]}
                                />

                                <TableBody>
                                    {clients &&
                                        clients.map((client, index) => (
                                            <ClientItem
                                                key={client.uuid}
                                                index={index}
                                                client={client}
                                                page={pageNumber}
                                            />
                                        ))}
                                </TableBody>
                            </Table>
                        </ResponsiveTableContainer>
                        <Paginator
                            page={pageNumber}
                            pageCount={numberOfPages}
                            setPage={(page) => {
                                navigate(`/admin/clients/?page=${page}`);
                            }}
                        />
                    </>
                )}
            </AdminDashboardLayout>
        </RequireAuth>
    );
}

function ClientItem({
    client,
    page,
    index,
}: {
    client: User;
    page: number;
    index: number;
}) {
    const dispatch = useAppDispatch();

    function getClientInfo(client: any) {
        const individualName = `${
            client.account?.individualMetadata?.firstname || "--"
        } ${client.account?.individualMetadata?.lastname || ""}`;
        const name =
            client.account.entityType === "business"
                ? client.account?.businessMetadata?.companyName || "--"
                : individualName;
        const type = client.account.entityType.toUpperCase();
        return {
            name,
            type,
        };
    }

    return (
        <TableRow index={index}>
            <TableCell>
                {client.username}
                <div style={{ height: "0.8rem" }} />
                {client.clients?.length
                    ? client.clients?.map((c, i) => (
                          <p
                              key={i}
                              style={{
                                  display: "flex",
                                  gap: "0.5rem",
                                  margin: "0",
                              }}
                          >
                              <strong>{getClientInfo(c).name}</strong>
                              <span>|</span>
                              <span style={{ lineHeight: 2, fontSize: "12px" }}>
                                  {getClientInfo(c).type}
                              </span>
                          </p>
                      ))
                    : ""}
            </TableCell>
            <TableCell>
                {client.contact?.complyLaunchResponse || "Unknown"}
            </TableCell>
            <TableCell>
                {client.contact.account?.riskAssessments?.length > 0
                    ? client.contact.account?.riskAssessments?.filter(
                          (r: { pep: string }) => r.pep == "yes"
                      ).length
                        ? "Yes"
                        : "No"
                    : ""}
            </TableCell>
            <TableCell>
                {client.contact.account?.individualMetadata?.country}{" "}
                {
                    client.contact.account?.businessMetadata
                        ?.countryOfRegistration
                }{" "}
                {client.country}
            </TableCell>
            <TableCell>
                {/* <Link
                    to={`/admin/clients/${client.uuid}/profile/${client.uuid}`}
                >
                    <Tooltip
                        title={`Edit "${client.firstname} ${client.lastname}"`}
                    >
                        <span>Edit</span>
                    </Tooltip>
                </Link>
                &nbsp;&nbsp;|&nbsp;&nbsp; */}
                <Link
                    to=""
                    onClick={() => {
                        confirm({
                            title: "Archive Client",
                            icon: <ExclamationCircleFilled />,
                            content:
                                "Are you sure you want to archive this client?",
                            onOk() {
                                return new Promise((resolve, reject) =>
                                    archiveClient(client.uuid)
                                        .then((response) => {
                                            dispatch(
                                                listAdminClients({ page: 1 })
                                            );
                                            resolve(
                                                openNotification(
                                                    "Archive Client",
                                                    "The client was archived successfully."
                                                )
                                            );
                                        })
                                        .catch(() => {
                                            // console.log('something went wrong');
                                            resolve(
                                                openErrorNotification(
                                                    "Archive Client",
                                                    "Sorry, the client could not be archived."
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
                </Link>
                <div style={{ height: "0.8rem" }} />
                {client.clients?.length
                    ? client.clients?.map((c, i) => (
                          <p key={i} style={{ margin: "0" }}>
                              <Tooltip
                                  title={`Edit  "${getClientInfo(c).name}"`}
                              >
                                  <Link
                                      to={`/admin/clients/${client.uuid}/profile/${c.uuid}`}
                                  >
                                      Edit
                                  </Link>
                              </Tooltip>
                          </p>
                      ))
                    : ""}
            </TableCell>
        </TableRow>
    );
}
