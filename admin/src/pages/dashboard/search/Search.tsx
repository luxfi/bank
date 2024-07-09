import RequireAuth from "../../../features/auth/RequireAuth";
import DashboardLayout from "../components/DashboardLayout";
import { UserRoles } from "../../../features/auth/user-role.enum";
import {
    Input as DefaultInput,
    Select as DefaultSelect,
    DatePicker as DefaultDatePicker,
    Row as DefaultRow,
    Col,
    Space as DefaultSpace,
    Button,
    Divider,
    Pagination,
} from "antd";
import styled, { keyframes } from "styled-components";
import { Table } from "../components/Table";
import { TableHeadWithItems } from "../components/TableHead";
import { TableBody } from "../components/TableBody";
import { useState, useEffect, PropsWithChildren, useCallback } from "react";
import type { DatePickerProps, PaginationProps } from "antd";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
    searchTransactions,
    selectTransactions,
    selectPagination,
    setPageInfo,
    selectStatus,
    setQuery,
    selectQuery,
} from "../../../features/search/SearchSlice";
import { TableRow } from "../components/TableRow";
import { TableCell } from "../components/TableCell";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "../../../components/Spinner";
import { snakeToWords, ucFirst } from "../../../utils/functions";
import {
    selectCurrencies,
    loadCurrenciesList,
} from "../../../features/balances/BalancesListSlice";
import CurrencyFlag from "react-currency-flags";
import { useQuery } from "../../../utils/use-query";
import moment from "moment";
import { device } from "../../../utils/media-query-helpers";
import { openErrorNotification } from "../../../components/Notifications";
import { selectCurrentUser } from "../../../features/auth/AuthSlice";
import AdminDashboardLayout from "../../admin/components/AdminDashboardLayout";
import {
    createAdminClientsSelector,
    listAdminClients,
} from "../../../features/admin-clients/AdminClientsSlice";
import { dateToHumanDate } from "../../../utils/text-helpers";

const actions = {
    currencycloud: [
        { key: "", value: "All" },
        { key: "funding", value: "Funding" },
        { key: "conversion", value: "Conversion" },
        { key: "payment", value: "Payment" },
        { key: "conversion_deposit", value: "Conversion Deposit" },
        { key: "inbound_funds", value: "Inbound Funds" },
        { key: "transfer", value: "Transfer" },
        { key: "margin", value: "Margin" },
        { key: "payment_fee", value: "Payment Fee" },
        { key: "payment_failure", value: "Failed Payments" },
    ],
    openpayd: [
        { key: "", value: "All" },
        { key: "funding", value: "Funding" },
        { key: "conversion", value: "Conversion" },
        { key: "payment", value: "Payment" },
        { key: "payment_failure", value: "Failed Payments" },
    ],
};
const statuses = {
    openPayd: {
        All: "",
        // initiated: 'Initiated',
        // processing: 'Processing',
        Pending: "pending",
        // released: 'Released',
        Completed: "completed",
        Failed: "failed",
        // deleted: 'Deleted',
        Cancelled: "cancelled",
    },
    clouldCurrency: {
        All: "",
        Pending: "pending",
        Completed: "completed",
        Deleted: "deleted",
        Scheduled: "scheduled",
        //Cancelled: 'cancelled',
    },
};
interface SearchProps {
    integrated?: boolean;
    account_id?: string;
    status?: string;
    currency?: string;
}
export default function Search(props: PropsWithChildren<SearchProps>) {
    const [gateway, setGateway] = useState<string>("transactions");
    const currentUser = useAppSelector(selectCurrentUser);
    // useEffect(() => {
    //     if (!currentUser?.role) return;
    //     console.log(currentUser?.role);
    //     if (currentUser?.role == "admin:super") {
    //         setGateway("transactions");
    //     } else {
    //         setGateway("currencycloud");
    //     }
    // }, [currentUser]);

    // console.log(gateway, gateway?.length);
    const [shortReference, setShortReference] = useState<string>("");
    const [action, setAction] = useState<string>();
    const [status, setStatus] = useState<string | undefined>(props.status);
    useEffect(() => {
        if (props.status) {
            setStatus(props.status);
        }
        if (props.currency) {
            setCurrency(props.currency);
        }
    }, [props]);
    const [type, setType] = useState<string>();
    const [amountFrom, setAmountFrom] = useState<Number>();
    const [amountTo, setAmountTo] = useState<Number>();
    const [currency, setCurrency] = useState<string | undefined>(
        props.currency
    );
    const [scope, setScope] = useState<string>();
    const [client, setClient] = useState<string>();
    const [gatewaySearch, setGatewaySearch] = useState<string>();
    const [dateType, setDateType] = useState<string>();
    const [dateFrom, setDateFrom] = useState<string>();
    const [dateTo, setDateTo] = useState<string>();
    const [toggle, setToggle] = useState<Boolean>(false);
    const setFromDate: DatePickerProps["onChange"] = (date, dateString) => {
        setDateFrom(dateString);
    };
    const setToDate: DatePickerProps["onChange"] = (date, dateString) => {
        setDateTo(dateString);
    };
    const account_id = props.account_id;
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const q = useQuery();
    const queryString = useLocation().search;
    const processQuery = () => {
        const searchquery = getSearchQuery();
        setQuery(queryString);
        if (gateway) {
            dispatch(
                searchTransactions({
                    query: searchquery !== "?" ? searchquery : queryString,
                    gateway,
                })
            );
        } else {
            openErrorNotification(
                "Search Transactions",
                "You do not have a trading account associated. Please contact the consultant to get one."
            );
        }
    };

    const updateState = () => {
        if (!props.integrated && q.get("status"))
            setStatus(String(q.get("status")));
        if (q.get("type")) setType(String(q.get("type")));
        if (q.get("settles_at_from")) {
            setDateFrom(String(q.get("settles_at_from")));
            setDateType("settlement_date");
        }
        if (q.get("settles_at_to")) {
            setDateTo(String(q.get("settles_at_to")));
            setDateType("settlement_date");
        }
        if (q.get("completed_at_from")) {
            setDateFrom(String(q.get("completed_at_from")));
            setDateType("completed_date");
        }
        if (q.get("completed_at_to")) {
            setDateTo(String(q.get("completed_at_to")));
            setDateType("completed_date");
        }
        if (q.get("action")) setAction(String(q.get("action")));
        if (q.get("shortReference"))
            setShortReference(String(q.get("shortReference")));
        if (!props.integrated && q.get("currency"))
            setCurrency(String(q.get("currency")));
        if (q.get("scope")) setScope(String(q.get("scope")));
        if (q.get("amount_from")) setAmountFrom(Number(q.get("amount_from")));
        if (q.get("amount_to")) setAmountTo(Number(q.get("amount_to")));
        if (
            q.get("status") ||
            q.get("type") ||
            q.get("amount_from") ||
            q.get("amount_to") ||
            q.get("currency") ||
            q.get("scope")
        )
            setToggle(true);
    };

    const getSearchQuery = () => {
        let settledAtFrom,
            settledAtTo,
            createdAtFrom,
            createdAtTo,
            completedAtFrom,
            completedAtTo;
        switch (dateType) {
            case "settlement_date":
                settledAtFrom = dateFrom;
                settledAtTo = dateTo;
                break;
            case "created_date":
                createdAtFrom = dateFrom;
                createdAtTo = dateTo;
                break;
            case "completed_date":
                completedAtFrom = dateFrom;
                completedAtTo = dateTo;
                break;
        }
        let query = "?";
        if (shortReference) query += `&shortReference=${shortReference}`;
        if (action) query += `&action=${action}`;
        if (settledAtFrom) query += `&settles_at_from=${settledAtFrom}`;
        if (settledAtTo) query += `&settles_at_to=${settledAtTo}`;
        if (createdAtFrom) query += `&created_at_from=${createdAtFrom}`;
        if (createdAtTo) query += `&created_at_to=${createdAtTo}`;
        if (completedAtFrom) query += `&completed_at_from=${completedAtFrom}`;
        if (completedAtTo) query += `&completed_at_to=${completedAtTo}`;
        if (status) query += `&status=${status}`;
        if (type) query += `&type=${type}`;
        if (amountFrom) query += `&amount_from=${amountFrom}`;
        if (amountTo) query += `&amount_to=${amountTo}`;
        if (currency) query += `&currency=${currency}`;
        if (account_id) query += `&account_id=${account_id}`;
        if (scope) query += `&scope=${scope}`;
        if (client) query += `&client=${client}`;
        if (gatewaySearch) query += `&gateway=${gatewaySearch}`;
        query = query.replace("?&", "?");
        return query;
    };

    const search = () => {
        navigate(`/dashboard/search${getSearchQuery()}`);
        // dispatch(setQuery(query));
        // dispatch(searchTransactions({query}));
    };

    const query = useAppSelector(selectQuery);

    const toggleAdvanced = () => {
        setToggle(!toggle);
        setAmountFrom(undefined);
        setAmountTo(undefined);
        setType(undefined);
        setScope(undefined);
        if (!props.integrated) {
            setCurrency(undefined);
            setStatus(undefined);
        }
    };

    const resetFilters = () => {
        setAmountFrom(undefined);
        setAmountTo(undefined);
        setType(undefined);
        setScope(undefined);
        if (!props.integrated) {
            setCurrency(undefined);
            setStatus(undefined);
        }
        setShortReference("");
        setAction(undefined);
        setDateType(undefined);
        setDateFrom(undefined);
        setDateTo(undefined);
        setGatewaySearch(undefined);
        setClient(undefined);
    };

    const onPageChange: PaginationProps["onChange"] = (page) => {
        dispatch(setPageInfo({ ...pageInfo, current_page: page }));
        let qs = getSearchQuery();
        if (qs.indexOf("page=") !== -1)
            qs = qs.replace(/page=[0-9]/, `page=${page}`);
        else qs += `&page=${page}`;
        if (gateway) dispatch(searchTransactions({ query: qs, gateway }));
        else
            openErrorNotification(
                "Searcn Transactions",
                "You do not have a trading account associated. Please contact the consultant to get one."
            );
    };

    const transactions = useAppSelector(selectTransactions);
    const pageInfo = useAppSelector(selectPagination);
    const loading = useAppSelector(selectStatus) === "loading" ? true : false;

    useEffect(() => {
        dispatch(loadCurrenciesList());
    }, [dispatch]);

    const currencies = useAppSelector(selectCurrencies);

    useEffect(() => {
        if (currentUser && gateway) {
            processQuery();
            updateState();
        }
    }, [currentUser, queryString, gateway]);

    const DashLayout =
        currentUser?.role !== "admin:super"
            ? DashboardLayout
            : AdminDashboardLayout;

    const Layout = useCallback(
        (lprops: PropsWithChildren<{}>) => {
            return !props.integrated ? (
                <RequireAuth roles={UserRoles}>
                    <DashLayout>{lprops.children}</DashLayout>
                </RequireAuth>
            ) : (
                <>{lprops.children}</>
            );
        },
        [props.integrated]
    );

    const adminTable = currentUser?.role === "admin:super";
    const dispatchedClients = useAppSelector(createAdminClientsSelector(1));
    useEffect(() => {
        if (!adminTable) return;
        dispatch(
            listAdminClients({
                page: 1,
            })
        );
    }, [dispatch, adminTable]);

    const allowsTxBrowsing = currentUser?.role !== "admin:super";
    const isShortDateTable =
        gateway === "openpayd" || gateway == "transactions";
    const tableColumns =
        currentUser?.role == "admin:super"
            ? [
                  "Reference",
                  "Account Name",
                  "Creator",
                  "Date",
                  "Status",
                  "Type/Reason",
                  "In",
                  "Out",
                  "Spread / CDAX Fee",
              ]
            : [
                  "Reference",
                  "Creator",
                  "Created Date",
                  "Settlement Date",
                  "Completed Date",
                  "Status",
                  "Type/Reason",
                  "In",
                  "Out",
              ];
    const CellStyle = {
        success: { color: "#448841", fontWeight: 700 },
        failed: { color: "#708090", fontWeight: 700 },
        red: { color: "#dc5c5c", fontWeight: 700 },
    };
    const failedStatus = ["failed", "deleted", "canceled", "cancelled"];

    return (
        <Layout>
            <Row>
                <Space direction="vertical">
                    <Input
                        placeholder="Reference"
                        value={shortReference}
                        onChange={(e) => setShortReference(e.target.value)}
                        allowClear
                    />
                </Space>
                <Space direction="vertical">
                    <Select
                        placeholder="Action"
                        allowClear
                        showSearch
                        value={action}
                        onChange={(value: any) => setAction(value)}
                    >
                        {actions["currencycloud"]?.map((action: any) => (
                            <Select.Option value={action.key}>
                                {action.value}
                            </Select.Option>
                        ))}
                    </Select>
                </Space>
                <Space direction="vertical">
                    <Select
                        placeholder="Date"
                        allowClear
                        value={dateType}
                        showSearch
                        onChange={(value: any) => {
                            setDateType(value);
                        }}
                    >
                        <Select.Option value="settlement_date">
                            Settlement Date
                        </Select.Option>
                        <Select.Option value="created_date">
                            Created Date
                        </Select.Option>
                        <Select.Option value="completed_date">
                            Completed Date
                        </Select.Option>
                    </Select>
                </Space>
                <DatePicker
                    placeholder="Date from"
                    value={dateFrom ? moment(String(dateFrom)) : undefined}
                    onChange={setFromDate}
                />
                <DatePicker
                    placeholder="Date to"
                    value={dateTo ? moment(String(dateTo)) : undefined}
                    onChange={setToDate}
                />
                <SearchButton onClick={search} disabled={loading}>
                    Search
                </SearchButton>
            </Row>
            <Row style={{ marginTop: "10px" }}>
                <Space style={{ marginLeft: "auto", width: "auto" }}>
                    <Text
                        color="#f7af41"
                        size="16px"
                        hover="#00A2E8"
                        onClick={toggleAdvanced}
                    >
                        Advanced
                    </Text>
                    <Text
                        color="rgba(0, 0, 0, 0.85)"
                        size="14px"
                        onClick={resetFilters}
                    >
                        Reset Filters
                    </Text>
                </Space>
            </Row>
            <Divider />
            <Row style={{ display: toggle ? "flex" : "none" }}>
                <Space direction="vertical">
                    <Title>Status</Title>
                    <Select
                        placeholder="Status"
                        allowClear
                        defaultValue=""
                        showSearch
                        value={status}
                        onChange={(value: any) => setStatus(value)}
                    >
                        {gateway === "openpayd"
                            ? Object.keys(statuses.openPayd).map((key) => (
                                  <Select.Option value={statuses.openPayd[key]}>
                                      {key}
                                  </Select.Option>
                              ))
                            : Object.keys(statuses.clouldCurrency).map(
                                  (key) => (
                                      <Select.Option
                                          value={statuses.clouldCurrency[key]}
                                      >
                                          {key}
                                      </Select.Option>
                                  )
                              )}
                    </Select>
                </Space>
                <Space direction="vertical">
                    <Title>Amount</Title>
                    <Input
                        placeholder="Min"
                        value={Number(amountFrom) > 0 ? Number(amountFrom) : ""}
                        type="number"
                        onChange={(e) => setAmountFrom(Number(e.target.value))}
                        allowClear
                    />
                </Space>
                <Input
                    placeholder="Max"
                    type="number"
                    value={Number(amountTo) > 0 ? Number(amountTo) : ""}
                    onChange={(e) => setAmountTo(Number(e.target.value))}
                    allowClear
                />
                {!props.integrated && (
                    <Space direction="vertical">
                        <Title>Currency</Title>
                        <Select
                            placeholder="Currency"
                            allowClear
                            showSearch
                            value={currency}
                            onChange={(value: any) => setCurrency(value)}
                        >
                            <Select.Option value="default" disabled>
                                Select Currency
                            </Select.Option>
                            {currencies.map((currency, index) => (
                                <Select.Option value={currency.code}>
                                    <CurrencyFlag
                                        style={{ marginRight: "5px" }}
                                        currency={currency.code}
                                    />
                                    {`${currency.name} (${currency.code})`}
                                </Select.Option>
                            ))}
                        </Select>
                    </Space>
                )}
                {adminTable && (
                    <>
                        <Space direction="vertical">
                            <Title>Scope</Title>
                            <Select
                                placeholder="Scope"
                                allowClear
                                showSearch
                                value={scope}
                                onChange={(value: any) => setScope(value)}
                            >
                                <Select.Option value="">All</Select.Option>
                                <Select.Option value="own">
                                    House Account
                                </Select.Option>
                                <Select.Option value="client">
                                    Clients
                                </Select.Option>
                            </Select>
                        </Space>
                        <Space direction="vertical">
                            <Title>Client</Title>
                            <Select
                                placeholder="Client"
                                allowClear
                                showSearch
                                value={client}
                                onChange={(value: any) => setClient(value)}
                            >
                                <Select.Option value="">All</Select.Option>
                                {dispatchedClients
                                    .filter(
                                        (client) =>
                                            client.contact?.account
                                                ?.openPaydId ||
                                            client.contact?.account
                                                ?.cloudCurrencyId
                                    )
                                    .map((dispatchedClient, index) => (
                                        <Select.Option
                                            value={
                                                dispatchedClient.contact.account
                                                    ?.openPaydId ||
                                                dispatchedClient.contact.account
                                                    ?.cloudCurrencyId
                                            }
                                        >
                                            {dispatchedClient.contact.account
                                                ?.businessMetadata
                                                ?.companyName ||
                                                `${dispatchedClient.firstname} ${dispatchedClient.lastname}`}
                                        </Select.Option>
                                    ))}
                            </Select>
                        </Space>
                        <Space direction="vertical">
                            <Title>Gateway</Title>
                            <Select
                                placeholder="Gateway"
                                allowClear
                                showSearch
                                value={gatewaySearch}
                                onChange={(value: any) =>
                                    setGatewaySearch(value)
                                }
                            >
                                <Select.Option value="">All</Select.Option>
                                <Select.Option value="openpayd">
                                    OpenPayd
                                </Select.Option>
                                <Select.Option value="currencycloud">
                                    CurrencyCloud
                                </Select.Option>
                            </Select>
                        </Space>
                    </>
                )}
            </Row>
            {loading ? (
                <Spinner
                    style={{ width: "50px", height: "50px", fontSize: "16px" }}
                />
            ) : (
                <>
                    <Row style={{ marginTop: "25px" }}>
                        {pageInfo.total_entries > 0
                            ? `Transactions ${
                                  (pageInfo.current_page - 1) *
                                      pageInfo.per_page +
                                  1
                              } - ${Math.min(
                                  pageInfo.current_page * pageInfo.per_page,
                                  pageInfo.total_entries
                              )} of ${pageInfo.total_entries}`
                            : "No entries found"}
                    </Row>
                    <ResponsiveContainer>
                        <Table style={{ marginTop: "10px" }}>
                            <TableHeadWithItems items={tableColumns} />
                            <TableBody>
                                {transactions.map((transaction, index) => (
                                    <TableRow key={transaction.id}>
                                        <TableCell>
                                            {allowsTxBrowsing &&
                                            !(
                                                transaction.action ==
                                                    "payment" &&
                                                transaction.status == "deleted"
                                            ) ? (
                                                <Link
                                                    to={
                                                        "/dashboard/" +
                                                        transaction.related_entity_type +
                                                        "/" +
                                                        transaction.related_entity_id
                                                    }
                                                >
                                                    {" "}
                                                    {
                                                        transaction.related_entity_short_reference
                                                    }{" "}
                                                </Link>
                                            ) : (
                                                transaction.related_entity_short_reference
                                            )}
                                            {!!transaction.gateway && (
                                                <>
                                                    <br />
                                                    {transaction.gateway}
                                                </>
                                            )}
                                        </TableCell>
                                        {/* <TableCell> {transaction.created_at} </TableCell> */}
                                        {currentUser?.role == "admin:super" && (
                                            <TableCell>
                                                {" "}
                                                {transaction.account_name}{" "}
                                            </TableCell>
                                        )}
                                        <TableCell>
                                            {transaction.creator}
                                        </TableCell>
                                        <TableCell>
                                            {" "}
                                            {transaction.gateway_created_at ||
                                            transaction.created_at
                                                ? dateToHumanDate(
                                                      transaction.created_at,
                                                      false
                                                  )
                                                : ""}{" "}
                                        </TableCell>
                                        {currentUser?.role !==
                                            "admin:super" && (
                                            <>
                                                <TableCell>
                                                    {" "}
                                                    {transaction.settles_at
                                                        ? dateToHumanDate(
                                                              transaction.settles_at,
                                                              false
                                                          )
                                                        : ""}{" "}
                                                </TableCell>
                                                <TableCell>
                                                    {" "}
                                                    {transaction.completed_at
                                                        ? dateToHumanDate(
                                                              transaction.completed_at,
                                                              false
                                                          )
                                                        : ""}{" "}
                                                </TableCell>
                                            </>
                                        )}
                                        <TableCell>
                                            {" "}
                                            {ucFirst(transaction.status)}{" "}
                                        </TableCell>
                                        <TableCell>
                                            {" "}
                                            {transaction.reason
                                                ? snakeToWords(
                                                      transaction.action +
                                                          " / " +
                                                          transaction.reason
                                                  )
                                                : snakeToWords(
                                                      transaction.action
                                                  )}{" "}
                                        </TableCell>
                                        <TableCell
                                            style={
                                                failedStatus.includes(
                                                    transaction.status?.toLowerCase()
                                                )
                                                    ? CellStyle.failed
                                                    : CellStyle.success
                                            }
                                        >
                                            {transaction.type === "credit"
                                                ? transaction.amount +
                                                  " " +
                                                  transaction.currency
                                                : null}
                                            {transaction.buy_amount
                                                ? transaction.buy_amount +
                                                  " " +
                                                  transaction.buy_currency
                                                : null}
                                        </TableCell>
                                        <TableCell
                                            style={
                                                failedStatus.includes(
                                                    transaction.status?.toLowerCase()
                                                )
                                                    ? CellStyle.failed
                                                    : CellStyle.red
                                            }
                                        >
                                            {transaction.type === "debit"
                                                ? transaction.amount +
                                                  " " +
                                                  transaction.currency
                                                : null}
                                            {transaction.sell_amount
                                                ? transaction.sell_amount +
                                                  " " +
                                                  transaction.sell_currency
                                                : null}
                                        </TableCell>
                                        {currentUser?.role == "admin:super" && (
                                            <TableCell>
                                                {transaction.action ==
                                                    "conversion" && (
                                                    <>
                                                        Client rate:{" "}
                                                        {
                                                            transaction.client_rate
                                                        }
                                                        <br />
                                                        CDAX rate:{" "}
                                                        {transaction.core_rate}
                                                        <br />
                                                        {!!transaction.fee_amount && (
                                                            <>
                                                                Spread:{" "}
                                                                {Number(
                                                                    (Math.round(
                                                                        (Number(
                                                                            transaction.buy_amount
                                                                        ) /
                                                                            (Number(
                                                                                transaction.buy_amount
                                                                            ) -
                                                                                Number(
                                                                                    transaction.fee_amount
                                                                                ))) *
                                                                            10000
                                                                    ) -
                                                                        10000) /
                                                                        100
                                                                )}
                                                                %<br />
                                                            </>
                                                        )}
                                                        {!transaction.fee_amount && (
                                                            <>
                                                                Spread:{" "}
                                                                {Math.round(
                                                                    (transaction.core_rate /
                                                                        transaction.client_rate -
                                                                        1) *
                                                                        100000
                                                                ) / 1000}
                                                                <br />
                                                            </>
                                                        )}
                                                        Configured Spread:{" "}
                                                        {
                                                            transaction.gateway_spread_table
                                                        }{" "}
                                                        <br />
                                                    </>
                                                )}
                                                {!!transaction.fee_amount && (
                                                    <>
                                                        Fee:{" "}
                                                        {transaction.fee_amount}{" "}
                                                        {
                                                            transaction.fee_currency
                                                        }
                                                    </>
                                                )}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ResponsiveContainer>
                    <Pagination
                        current={pageInfo.current_page}
                        total={pageInfo.total_entries}
                        pageSize={pageInfo.per_page}
                        showSizeChanger={false}
                        style={{ float: "right", marginTop: "15px" }}
                        onChange={onPageChange}
                    />
                </>
            )}
        </Layout>
    );
}
const Title = styled.span`
    display: block;
`;
interface Props {
    size?: string;
    color?: string;
    hover?: string;
}
const Text = styled.a<Props>`
    color: ${(props) => props.color};
    font-size: ${(props) => props.size};
    &:hover {
        color: ${(props) => (props.hover ? props.hover : "#f49c0e")};
    }
`;
const SearchButton = styled(Button)`
    cursor: pointer;
    border: 3px solid #00a2e8;
    border-radius: 5px;
    width: 200px;
    padding: 0px;
    color: #ffffff;
    background: #00a2e8;
    text-align: center;
    font-size: 1.2em;
    -webkit-transition: background-color 200ms, box-shadow 200ms;
    transition: background-color 200ms, box-shadow 200ms;
    @media ${device.xs} {
        width: 100%;
    }
`;
const Input = styled(DefaultInput)`
    width: 200px;
    @media ${device.xs} {
        width: 100%;
    }
`;
const Select = styled(DefaultSelect)`
    width: 200px;
    @media ${device.xs} {
        width: 100%;
    }
`;
const DatePicker = styled(DefaultDatePicker)`
    width: 200px;
    @media ${device.xs} {
        width: 100%;
    }
`;
const ResponsiveContainer = styled.div`
    overflow-x: auto;
    width: 100%;
`;
const Row = styled(DefaultRow)`
    @media ${device.xs} {
        flex-direction: column;
        row-gap: 8px;
        align-items: start;
    }
    row-gap: 8px !important;
    justify-content: space-between;
    align-items: end;
`;
const Space = styled(DefaultSpace)`
    @media ${device.xs} {
        width: 100%;
    }
`;
