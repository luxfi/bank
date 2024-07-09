import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { format } from "date-fns";

import { Button as AntdButton } from "antd";

import {
    faExclamationCircle,
    faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DatePicker, Input, Select, Table, Tooltip } from "antd";
import moment from "moment";
import CurrencyFlag from "react-currency-flags";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Button from "../../../components/Button";
import { openErrorNotification } from "../../../components/Notifications";
import { Spinner } from "../../../components/Spinner";
import { selectCurrentUser } from "../../../features/auth/AuthSlice";
import RequireAuth from "../../../features/auth/RequireAuth";
import {
    UserAdminRoles,
    UserRoles,
} from "../../../features/auth/user-role.enum";
import {
    loadCurrenciesList,
    selectCurrencies,
} from "../../../features/balances/BalancesListSlice";
import {
    pendingTransactions,
    selectPendingPagination,
    selectPendingStatus,
    selectPendingTransactions,
    setPageInfo,
} from "../../../features/pending/PendingSlice";
import { ITransaction } from "../../../features/pending/models/Transaction";
import { setQuery } from "../../../features/search/SearchSlice";
import { device } from "../../../utils/media-query-helpers";
import { useQuery } from "../../../utils/use-query";
import DashboardLayout from "../components/DashboardLayout";
import { ResponsiveTableContainer } from "../components/Table";
import { statusMap } from "./helpers";

const antdCols = [
    {
        title: "Reference",
        dataIndex: "reference",
        render: (data: string) => {
            if (!data) return "--";
            return data;
        },
    },
    {
        title: "Created",
        dataIndex: "created_at",
        render: (data: string) => {
            if (!data) return "--";
            const date = new Date(data);
            return format(date, "MM/dd/yyyy");
        },
    },
    {
        title: "Settlement",
        dataIndex: "settles_at",
        render: (data: string) => {
            if (!data) return "--";
            const date = new Date(data);
            return format(date, "MM/dd/yyyy");
        },
    },
    {
        title: "Status",
        dataIndex: "status_approval",
        render: (data: string) => {
            if (!data) return "--";
            return statusMap[data];
        },
    },
    {
        title: "Type/Reason",
        dataIndex: "reason",
        render: (data: string) => {
            if (!data) return "--";
            return data;
        },
    },
    /* {
        title: "In",
        render: (data: ITransaction) => {
            if (!data.amount_in) return "--";
            return `${data.amount_in} ${data.currency}`;
        },
    }, */
    {
        title: "Out",
        render: (data: ITransaction) => {
            if (!data.amount_out) return "--";
            return `${data.amount_out} ${data.currency}`;
        },
    },
];

const statusOptions = [
    { value: "", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "done", label: "Completed" },
    { value: "rejected", label: "Rejected" },
];
interface IFilters {
    reference?: string;
    kindOfDate?: string;
    startDate?: string;
    endDate?: string;
    currency?: string;
    minAmount?: string;
    maxAmount?: string;
    status?: string;
}

export default function PendingPayments() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const q = useQuery();
    const queryString = useLocation().search;
    const currentUser = useAppSelector(selectCurrentUser);
    const currenciesOptions = useAppSelector(selectCurrencies);

    const [gateway, setGateway] = useState(
        window.localStorage.getItem("gateway") || "currencycloud"
    );

    const transactions = useAppSelector(selectPendingTransactions);
    const pageInfo = useAppSelector(selectPendingPagination);
    const loading =
        useAppSelector(selectPendingStatus) === "loading" ? true : false;

    const [dataSource, setDataSource] = useState<any[]>([]);
    const [showFilters, setShowFilters] = useState(true);
    const [filters, setFilters] = useState<IFilters>({
        reference: undefined,
        currency: undefined,
        kindOfDate: undefined,
        startDate: undefined,
        endDate: undefined,
        maxAmount: undefined,
        minAmount: undefined,
        status: q.get("status_approval") || "pending",
    });

    const tooltipText =
        currentUser && UserAdminRoles.includes(currentUser.role)
            ? "Items performed by your team member that require your approval"
            : "Items that you sent for approval to your team manager or admin, if an item remains in the table for a long time, contact your team manager";

    const handleFilters = (key: keyof IFilters | "RESET", value?: string) => {
        if (key === "RESET") {
            setFilters({
                reference: undefined,
                currency: undefined,
                kindOfDate: undefined,
                startDate: undefined,
                endDate: undefined,
                maxAmount: undefined,
                minAmount: undefined,
                status: "pending",
            });
            navigate("/dashboard/pending");
            return;
        }
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleKindOfDate: { start: string; end: string } = useMemo(() => {
        const created = filters.kindOfDate === "created";
        const settlement = filters.kindOfDate === "settlement";
        const completed = filters.kindOfDate === "completed";

        if (created) {
            return {
                start: "created_at_from",
                end: "created_at_to",
            };
        }
        if (settlement) {
            return {
                start: "settles_at_from",
                end: "settles_at_to",
            };
        }

        if (completed) {
            return {
                start: "completed_at_from",
                end: "completed_at_to",
            };
        }

        return {
            start: "",
            end: "",
        };
    }, [filters]);

    const getQuery = useMemo(() => {
        const {
            reference,
            currency,
            startDate,
            endDate,
            maxAmount,
            minAmount,
            status,
        } = filters;

        let query = "?";

        reference && (query += `&reference=${reference}`);
        currency && (query += `&currency=${currency}`);
        startDate && (query += `&${handleKindOfDate.start}=${startDate}`);
        endDate && (query += `&${handleKindOfDate.end}=${endDate}`);
        maxAmount && (query += `&amount_from=${maxAmount}`);
        minAmount && (query += `&amount_to=${minAmount}`);
        status && (query += `&status_approval=${status}`);

        query += "&action=payment";

        query = query.replace("?&", "?");

        return query;
    }, [filters]);

    const handleSearch = () => {
        navigate(`/dashboard/pending${getQuery}`);
    };

    const processQuery = () => {
        const searchquery = getQuery;
        setQuery(queryString);
        if (gateway) {
            dispatch(
                pendingTransactions({
                    query: searchquery !== "?" ? searchquery : queryString,
                    gateway,
                })
            );
        } else {
            openErrorNotification(
                "Pending Transactions",
                "You do not have a trading account associated. Please contact the consultant to get one."
            );
        }
    };

    const updateStates = () => {
        const reference = q.get("reference");
        const currency = q.get("currency");
        const startDate = q.get("startDate");
        const endDate = q.get("endDate");
        const minAmount = q.get("amount_from");
        const maxAmount = q.get("amount_to");
        const status = q.get("status_approval");

        reference && handleFilters("reference", reference);
        currency && handleFilters("currency", currency);
        startDate && handleFilters("startDate", startDate);
        endDate && handleFilters("endDate", endDate);
        minAmount && handleFilters("minAmount", minAmount);
        maxAmount && handleFilters("maxAmount", maxAmount);
        status && handleFilters("status", status);
    };

    useEffect(() => {
        if (currentUser?.role == "admin:super") {
            setGateway("transactions");
        }
    }, [currentUser]);

    useEffect(() => {
        setDataSource(transactions);
    }, [transactions]);

    useEffect(() => {
        if (currentUser && gateway) {
            updateStates();
            processQuery();
        }
    }, [currentUser, queryString, gateway]);

    const onChangePage = (page: number) => {
        dispatch(setPageInfo({ ...pageInfo, current_page: page }));
        let qs = getQuery;
        if (qs.indexOf("page=") !== -1)
            qs = qs.replace(/page=[0-9]/, `page=${page}`);
        else qs += `&page=${page}`;
        if (gateway) dispatch(pendingTransactions({ query: qs, gateway }));
        else
            openErrorNotification(
                "Pending Transactions",
                "You do not have a trading account associated. Please contact the consultant to get one."
            );
    };

    useEffect(() => {
        dispatch(loadCurrenciesList());
    }, [dispatch]);

    return (
        <RequireAuth roles={UserRoles}>
            <DashboardLayout>
                <TitleContainer>
                    <Title>
                        Pending of Approval
                        <Tooltip title={tooltipText}>
                            <FontAwesomeIcon icon={faExclamationCircle} />
                        </Tooltip>
                    </Title>

                    <Button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        secondary
                        style={{
                            display: "inline-flex",
                            gap: "1rem",
                            alignItems: "center",
                        }}
                    >
                        <FontAwesomeIcon icon={faFilter} />
                        {`${showFilters ? "Hide" : "Show"} Filters`}
                    </Button>
                </TitleContainer>
                {showFilters && (
                    <FiltersContainer>
                        <Input
                            placeholder="Reference"
                            allowClear
                            value={filters.reference}
                            onChange={(e) =>
                                handleFilters("reference", e.target.value)
                            }
                        />

                        <Select
                            placeholder="Kind of Date"
                            allowClear
                            showSearch
                            value={filters.kindOfDate}
                            onChange={(e) => handleFilters("kindOfDate", e)}
                        >
                            <Select.Option value="settlement">
                                Settlement Date
                            </Select.Option>
                            <Select.Option value="created">
                                Created Date
                            </Select.Option>
                            <Select.Option value="completed">
                                Completed Date
                            </Select.Option>
                        </Select>
                        <DatePicker
                            disabled={!filters.kindOfDate}
                            placeholder="Start Date"
                            allowClear
                            disabledDate={(date) => {
                                if (date > moment(new Date())) return true;
                                if (date > moment(filters.endDate)) return true;
                                return false;
                            }}
                            value={
                                filters.startDate
                                    ? moment(filters.startDate)
                                    : undefined
                            }
                            onChange={(e) => {
                                const date = e?.toDate()?.toISOString() || "";
                                handleFilters("startDate", date);
                            }}
                        />
                        <DatePicker
                            disabled={!filters.kindOfDate}
                            placeholder="End Date"
                            allowClear
                            disabledDate={(date) => {
                                if (date > moment(new Date())) return true;
                                if (date < moment(filters.startDate))
                                    return true;
                                return false;
                            }}
                            value={
                                filters.endDate
                                    ? moment(filters.endDate)
                                    : undefined
                            }
                            onChange={(e) => {
                                const date = e?.toDate()?.toISOString() || "";
                                handleFilters("endDate", date);
                            }}
                        />
                        {/* <Select
                            placeholder="Status"
                            allowClear
                            showSearch
                            value={filters.status}
                            onChange={(e) => handleFilters("status", e)}
                        >
                            {statusOptions?.map(
                                (status: any, index: number) => (
                                    <Select.Option
                                        value={status.value}
                                        key={index}
                                    >
                                        {status.label}
                                    </Select.Option>
                                )
                            )}
                        </Select> */}
                        <Select
                            placeholder="Currency"
                            allowClear
                            showSearch
                            value={filters.currency}
                            onChange={(e) => handleFilters("currency", e)}
                        >
                            <Select.Option value="default" disabled>
                                Select Currency
                            </Select.Option>
                            {currenciesOptions.map((currency, index) => (
                                <Select.Option
                                    value={currency.code}
                                    key={index}
                                >
                                    <CurrencyFlag
                                        style={{ marginRight: "5px" }}
                                        currency={currency.code}
                                    />
                                    {`${currency.name} (${currency.code})`}
                                </Select.Option>
                            ))}
                        </Select>
                        <Input
                            placeholder="Min Amount"
                            allowClear
                            value={filters.minAmount}
                            onChange={(e) =>
                                handleFilters("minAmount", e.target.value)
                            }
                        />
                        <Input
                            placeholder="Max Amount"
                            allowClear
                            value={filters.maxAmount}
                            onChange={(e) =>
                                handleFilters("maxAmount", e.target.value)
                            }
                        />

                        <div style={{ display: "flex", gap: "1rem" }}>
                            <SearchButton onClick={() => handleSearch()}>
                                Search
                            </SearchButton>
                            <AntdButton
                                onClick={() => handleFilters("RESET")}
                                type="link"
                                style={{ width: "50%", fontWeight: "600" }}
                            >
                                Reset Filters
                            </AntdButton>
                        </div>
                    </FiltersContainer>
                )}
                <ResponsiveTableContainer>
                    {loading ? (
                        <Spinner
                            style={{
                                width: "50px",
                                height: "50px",
                                fontSize: "16px",
                            }}
                        />
                    ) : (
                        <StyledTable
                            dataSource={dataSource}
                            columns={antdCols}
                            loading={loading}
                            rowKey={(item: any) => item.uuid}
                            onRow={(record: any) => {
                                return {
                                    onClick: () => {
                                        navigate(
                                            `/dashboard/pending/${record.id}`
                                        );
                                    },
                                };
                            }}
                            pagination={{
                                current: pageInfo.current_page,
                                total: pageInfo.total_entries,
                                pageSize: pageInfo.per_page,
                                onChange: onChangePage,
                            }}
                        />
                    )}
                </ResponsiveTableContainer>
            </DashboardLayout>
        </RequireAuth>
    );
}

const StyledTable = styled(Table)`
    margin-top: 2rem;
    .ant-table-thead tr th {
        background-color: ${(props) => props.theme.colors.primary};
        color: #fff;
        font-weight: 600;
        padding: 0.3rem 1rem;
    }

    .ant-table-cell {
        cursor: pointer;
        padding: 0.3rem 1rem;
    }
`;
export const TitleContainer = styled.div`
    display: flexbox;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

export const Title = styled.h1`
    color: ${(props) => props.theme.colors.primary};
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 0;
`;

const FiltersContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    padding: 1rem 0;
    gap: 1rem;
`;

const SearchButton = styled(Button)`
    cursor: pointer;
    border: 3px solid #00a2e8;
    border-radius: 5px;
    width: 50%;
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
