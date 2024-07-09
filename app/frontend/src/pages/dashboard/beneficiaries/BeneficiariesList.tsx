import { Select } from "antd";
import Search from "antd/lib/input/Search";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Button from "../../../components/Button";
import { selectCurrentUser } from "../../../features/auth/AuthSlice";
import RequireAuth from "../../../features/auth/RequireAuth";
import {
    AdminRoles,
    UserOrAdminRoles,
    UserPaymentRoles,
    UserPaymentRolesWithoutSuperadmin,
    UserRole,
} from "../../../features/auth/user-role.enum";
import {
    approveBeneficiaryAndReload,
    deleteBeneficiaryAndReload,
    loadBeneficiariesList,
    selectBeneficiaries,
} from "../../../features/beneficiaries/BeneficiariesListSlice";
import { BeneficiaryResponse } from "../../../features/beneficiaries/model/beneficiary-response";
import { EntityType } from "../../../features/registration/RegistrationSlice";
import { onlyUnique } from "../../../utils/functions";
import { dateToHumanDate } from "../../../utils/text-helpers";
import UserRoleChecker from "../../../utils/UserRoleChecker";
import AdminDashboardLayout from "../../admin/components/AdminDashboardLayout";
import DashboardLayout from "../components/DashboardLayout";
import { DeleteButton } from "../components/DeleteButton";
import { PageTitle } from "../components/PageTitle";
import { ResponsiveTableContainer, Table } from "../components/Table";
import { TableBody } from "../components/TableBody";
import { TableCell } from "../components/TableCell";
import { TableHeadWithItems } from "../components/TableHead";
import { TableRow } from "../components/TableRow";
import { TopContainer } from "../components/TopContainer";
import styled from "styled-components";
import {
    openErrorNotification,
    openNotification,
} from "../../../components/Notifications";
import { selectBeneficiariesStatus } from "../../../features/beneficiaries/BeneficiariesSlice";
import { Progress, Spinner } from "../../../components/Spinner";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { approveBeneficiary } from "../../../features/beneficiaries/BeneficiariesApi";

const Date = styled.span`
    font-size: 9px;
`;
const { Option } = Select;
const FlexContainer = styled.div`
    display: flex;
`;

export default function BeneficiariesList() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [filters, setFilters] = useState<any>({});
    let beneficiaries = useAppSelector(selectBeneficiaries);
    const currentUser = useAppSelector(selectCurrentUser);
    useEffect(
        () => {
            dispatch(loadBeneficiariesList());
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );
    const beneficiaryStatus: { [key: string]: boolean } = {
        Pending: false,
        Approved: true,
    };
    let currencies: any[] = [],
        countries: any[] = [];
    for (const beneficiary of beneficiaries) {
        if (beneficiary.currency) currencies.push(beneficiary.currency);
        if (beneficiary.bankCountry) countries.push(beneficiary.bankCountry);
    }
    const columns =
        currentUser?.role !== "admin:super"
            ? ["Beneficiary", "Currency", "Bank Country", "Status", "Actions"]
            : [
                  "Client",
                  "Beneficiary",
                  "Currency",
                  "Bank Country",
                  "Status",
                  "Actions",
              ];

    currencies = currencies.filter(onlyUnique);
    countries = countries.filter(onlyUnique);
    beneficiaries = beneficiaries.filter((beneficiary) => {
        let flag = true;
        if (filters.company_name) {
            let name =
                beneficiary.account?.entityType === "individual"
                    ? `${beneficiary.account.individualMetadata?.firstname} ${beneficiary.account.individualMetadata?.lastname}`
                    : beneficiary.account?.businessMetadata?.companyName;
            if (!name) return false;
            flag =
                flag &&
                name.toLowerCase().includes(filters.company_name.toLowerCase());
        }
        if (filters.name) {
            let name =
                beneficiary.entityType === "individual"
                    ? `${beneficiary.firstname} ${beneficiary.lastname}`
                    : beneficiary.companyName;
            if (!name) return false;
            flag =
                flag && name.toLowerCase().includes(filters.name.toLowerCase());
        }
        if (filters.currency) {
            flag = flag && beneficiary.currency === filters.currency;
        }
        if (filters.country) {
            flag = flag && beneficiary.bankCountry === filters.country;
        }
        if (filters.status) {
            flag =
                flag &&
                beneficiaryStatus[filters.status] ===
                    (beneficiary.isApproved ? true : false);
        }
        return flag;
    });

    const Layout =
        currentUser?.role !== "admin:super"
            ? DashboardLayout
            : AdminDashboardLayout;
    const onFilter = (filter: any) => {
        setFilters({ ...filters, ...filter });
    };
    const FilterRow = () => {
        return (
            <TableRow>
                {currentUser?.role === "admin:super" && (
                    <TableCell>
                        <Search
                            placeholder="input search text"
                            onSearch={(value) => {
                                onFilter({ company_name: value });
                            }}
                            defaultValue={filters.company_name}
                            allowClear
                        />
                    </TableCell>
                )}
                <TableCell>
                    <Search
                        placeholder="input search text"
                        onSearch={(value) => {
                            onFilter({ name: value });
                        }}
                        defaultValue={filters.name}
                        allowClear
                    />
                </TableCell>
                <TableCell style={{ width: "15%" }}>
                    <Select
                        style={{ width: "100%" }}
                        showSearch={true}
                        allowClear
                        onChange={(value) => {
                            onFilter({ currency: value });
                        }}
                        onFocus={() => {
                            const el = document.getElementsByClassName(
                                "ant-select-selection-search-input"
                            );
                            for (let i = 0; i < el.length; i++) {
                                el[i].setAttribute(
                                    "autocomplete",
                                    "new-select-item"
                                );
                            }
                        }}
                        filterOption={(input, option: any) => {
                            return (
                                option?.children
                                    ?.toLocaleLowerCase()
                                    .includes(input.toLocaleLowerCase()) ||
                                option?.value
                                    .toLocaleLowerCase()
                                    .includes(input.toLocaleLowerCase())
                            );
                        }}
                        value={filters.currency}
                    >
                        {currencies.map((value, index) => (
                            <Option key={index} value={value}>
                                {value}
                            </Option>
                        ))}
                    </Select>
                </TableCell>
                <TableCell style={{ width: "15%" }}>
                    <Select
                        style={{ width: "100%" }}
                        showSearch={true}
                        allowClear
                        onChange={(value) => {
                            onFilter({ country: value });
                        }}
                        onFocus={() => {
                            const el = document.getElementsByClassName(
                                "ant-select-selection-search-input"
                            );
                            for (let i = 0; i < el.length; i++) {
                                el[i].setAttribute(
                                    "autocomplete",
                                    "new-select-item"
                                );
                            }
                        }}
                        filterOption={(input, option: any) => {
                            return (
                                option?.children
                                    ?.toLocaleLowerCase()
                                    .includes(input.toLocaleLowerCase()) ||
                                option?.value
                                    .toLocaleLowerCase()
                                    .includes(input.toLocaleLowerCase())
                            );
                        }}
                        value={filters.country}
                    >
                        {countries.map((value, index) => (
                            <Option key={index} value={value}>
                                {value}
                            </Option>
                        ))}
                    </Select>
                </TableCell>
                <TableCell style={{ width: "15%" }}>
                    <Select
                        style={{ width: "100%" }}
                        onChange={(value) => {
                            onFilter({ status: value });
                        }}
                        allowClear
                        value={filters.status}
                    >
                        {Object.keys(beneficiaryStatus).map((key) => (
                            <Option key={key} value={key}>
                                {key}
                            </Option>
                        ))}
                    </Select>
                </TableCell>
            </TableRow>
        );
    };
    return (
        <RequireAuth roles={UserOrAdminRoles}>
            <Layout>
                <PageTitle>Beneficiaries</PageTitle>
                <UserRoleChecker
                    roles={[
                        ...UserPaymentRolesWithoutSuperadmin,
                        UserRole.TeamMember,
                    ]}
                >
                    <TopContainer>
                        <Button
                            primary
                            onClick={() =>
                                navigate("/dashboard/beneficiaries/new")
                            }
                        >
                            Add Beneficiary
                        </Button>
                    </TopContainer>
                </UserRoleChecker>
                <ResponsiveTableContainer>
                    <Table>
                        <FilterRow />
                        <TableHeadWithItems items={columns} />

                        <TableBody>
                            {beneficiaries.map((beneficiary, index) => (
                                <BeneficiaryItem
                                    key={beneficiary.uuid}
                                    beneficiary={beneficiary}
                                    index={index}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </ResponsiveTableContainer>
            </Layout>
        </RequireAuth>
    );
}

const BeneficiaryItem = ({
    beneficiary,
    index,
}: {
    beneficiary: BeneficiaryResponse;
    index: number;
}) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(selectCurrentUser);
    const [loading, setLoading] = useState(false);
    return (
        <TableRow index={index}>
            {currentUser?.role === "admin:super" && (
                <TableCell>
                    {beneficiary.account?.entityType ==
                        EntityType.Individual && (
                        <>
                            {beneficiary.account?.individualMetadata?.firstname}{" "}
                            {beneficiary.account?.individualMetadata?.lastname}
                        </>
                    )}
                    {beneficiary.account?.entityType == EntityType.Business && (
                        <>
                            {beneficiary.account?.businessMetadata?.companyName}
                        </>
                    )}
                    <br />
                    <Date>
                        {dateToHumanDate(beneficiary.account?.createdAt)}
                    </Date>
                </TableCell>
            )}
            <TableCell>
                {beneficiary.entityType === "individual"
                    ? `${beneficiary.firstname} ${beneficiary.lastname}`
                    : beneficiary.companyName}
                <br />
                <Date>
                    {dateToHumanDate(
                        beneficiary.updatedAt || beneficiary.createdAt
                    )}
                </Date>
            </TableCell>
            <TableCell>{beneficiary.currency}</TableCell>
            <TableCell>{beneficiary.bankCountry}</TableCell>
            <TableCell>
                {beneficiary.isApproved ? "Approved" : "Pending"}
            </TableCell>
            <TableCell>
                <UserRoleChecker roles={UserPaymentRoles}>
                    <UserRoleChecker roles={UserPaymentRolesWithoutSuperadmin}>
                        {beneficiary.isApproved ? (
                            <Button
                                style={{ margin: "2px" }}
                                secondary
                                size="small"
                                onClick={() =>
                                    navigate(
                                        `/dashboard/payments/wizard/${
                                            beneficiary.currency
                                        }/?beneficiary=${
                                            beneficiary.currencyCloudId ||
                                            beneficiary.openPaydId
                                        }`
                                    )
                                }
                            >
                                Pay
                            </Button>
                        ) : null}
                    </UserRoleChecker>
                    <Button
                        primary
                        size="small"
                        style={{ margin: "2px" }}
                        onClick={() =>
                            navigate(
                                `/dashboard/beneficiaries/${beneficiary.uuid}`
                            )
                        }
                    >
                        Edit
                    </Button>
                    <UserRoleChecker roles={AdminRoles}>
                        {loading ? (
                            <Progress icon={faSpinner} />
                        ) : (
                            <DeleteButton
                                text={
                                    beneficiary.isApproved
                                        ? "Unapprove"
                                        : "Approve"
                                }
                                onClick={async () => {
                                    setLoading(true);
                                    approveBeneficiary(beneficiary.uuid)
                                        .then(() => {
                                            dispatch(loadBeneficiariesList())
                                                .unwrap()
                                                .finally(() => {
                                                    openNotification(
                                                        `${
                                                            beneficiary.isApproved
                                                                ? "Unpprove"
                                                                : "Approve"
                                                        } Beneficiary`,
                                                        `The beneficiary is ${
                                                            beneficiary.isApproved
                                                                ? "unapproved"
                                                                : "approved"
                                                        } successfully.`
                                                    );
                                                    setLoading(false);
                                                });
                                        })
                                        .catch((err) => {
                                            openErrorNotification(
                                                "Approve Beneficiary",
                                                err.message ||
                                                    "Something went wrong. Please check the details of the beneficiary."
                                            );
                                            setLoading(false);
                                        });
                                }}
                            />
                        )}
                    </UserRoleChecker>
                    <DeleteButton
                        onClick={() =>
                            deleteBeneficiaryAndReload(beneficiary.uuid)(
                                dispatch
                            )
                        }
                    />
                </UserRoleChecker>
            </TableCell>
        </TableRow>
    );
};
