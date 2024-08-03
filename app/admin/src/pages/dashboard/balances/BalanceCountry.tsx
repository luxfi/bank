import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import RequireAuth, { Loading } from "../../../features/auth/RequireAuth";
import {
    UserPaymentRoles,
    UserRoles,
} from "../../../features/auth/user-role.enum";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Button from "../../../components/Button";
import { useEffect, useState } from "react";
import moment from "moment";
import CurrencyFlag from "react-currency-flags";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
    loadAccount,
    loadActiveAccount,
    loadSettleAccountList,
    selectActiveAccount,
    selectTransaction,
    selectTransactionPages,
} from "../../../features/accounts/AccountsListSlice";
import {
    loadCurrenciesList,
    selectCurrencies,
} from "../../../features/balances/BalancesListSlice";
import UserRoleChecker from "../../../utils/UserRoleChecker";
import { useQuery } from "../../../utils/use-query";
import Search from "../search/Search";
export default function BalanceCountry() {
    const navigate = useNavigate();
    const query = useQuery();
    const deletedConversionId = query.get("deleted_conversion_id");
    const deletedPaymentId = query.get("deleted_payment_id");
    const dispatch = useAppDispatch();
    const [pending_date, setPendingDate] = useState("");
    const [pending_begin_date, setPendingBeginDate] = useState("");
    const [complete_date, setCompleteDate] = useState(
        moment(new Date()).format("YYYY-MM-DD")
    );
    const [complete_begin_date, setCompleteBeginDate] = useState(
        moment(new Date()).subtract(3, "M").format("YYYY-MM-DD")
    );
    // const bungi_date = moment(new Date()).subtract(3, 'M').format("YYYY-MM-DD");
    // const currentAccount = useAppSelector(selectAccount)
    const activeAccount = useAppSelector(selectActiveAccount);
    const transactions = useAppSelector(selectTransaction);
    const transaction_page = useAppSelector(selectTransactionPages);
    const { currency, account_id } = useParams();
    const currencies = useAppSelector(selectCurrencies);
    useEffect(() => {
        if (!currencies.length) {
            dispatch(loadCurrenciesList());
        }
    }, [dispatch, currencies]);
    const [activePage, setCurrentPage] = useState(1);
    const [dateFilter, setDateFilter] = useState({
        startDate: null,
        endDate: null,
    });

    useEffect(() => {
        dispatch(loadActiveAccount());
        if (account_id && currency) {
            dispatch(loadAccount({ account_id: account_id }));
            dispatch(
                loadSettleAccountList({
                    currency: String(currency),
                    account_id: account_id,
                })
            );
        }
    }, []);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };
    const currencyDetails = currencies?.filter((c) => c.code == currency)[0];
    if (!currencies || !currencies.length) {
        return <Loading />;
    }
    return (
        <RequireAuth roles={UserRoles}>
            <DashboardLayout>
                {!!deletedPaymentId && (
                    <>
                        <RowContainer>
                            <BorderLabel>
                                <NextButton>
                                    <img
                                        src={`${process.env.PUBLIC_URL}/images/currencies/check.svg`}
                                        width="30px"
                                        height="30px"
                                        alt="pending"
                                    />
                                </NextButton>
                                <LargeTitle>
                                    Payment was successfully deleted!
                                </LargeTitle>
                            </BorderLabel>
                        </RowContainer>
                    </>
                )}
                {!!deletedConversionId && (
                    <>
                        <RowContainer>
                            <BorderLabel>
                                <NextButton>
                                    <img
                                        src={`${process.env.PUBLIC_URL}/images/currencies/check.svg`}
                                        width="30px"
                                        height="30px"
                                        alt="pending"
                                    />
                                </NextButton>
                                <LargeTitle>
                                    Conversion was successfully deleted!
                                </LargeTitle>
                            </BorderLabel>
                        </RowContainer>
                    </>
                )}
                {/* {breadcrumbs.map(({ breadcrumb, match }, index) => (
                <div className="bc" >
                    <Link to={match.url || ""}>
                        {breadcrumb}    
                    </Link> 
                    {index <breadcrumb.length -1 && ">"}
                </div>
            ))}   */}
                <Container>
                    <RowContainer>
                        {/* <img src={`${process.env.PUBLIC_URL}/images/balances/euro.png`} width="50" alt="Euro" /> */}
                        <CurrencyFlag
                            style={{ borderRadius: "50%" }}
                            currency={String(currency)}
                            width={50}
                            height={50}
                        />
                        <TitleContaier>
                            <LargeTitle>
                                {activeAccount.active_currency_amount}{" "}
                                {currency}
                            </LargeTitle>
                            <SmallTitle>{currencyDetails?.name}</SmallTitle>
                        </TitleContaier>
                    </RowContainer>
                    <ImageGroupContainer>
                        <UserRoleChecker roles={UserPaymentRoles}>
                            {currencyDetails.can_deposit && (
                                <ImageItemContainer>
                                    <Link
                                        to={`/dashboard/balances/${currency}/account_details/${account_id}`}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            flexDirection: "column",
                                            width: "70px",
                                        }}
                                    >
                                        <img
                                            src={`${process.env.PUBLIC_URL}/images/balances/plus-circle.png`}
                                            width="42"
                                            alt="Plus"
                                        />
                                        <LinkDescription>
                                            Add {currency}
                                        </LinkDescription>
                                    </Link>
                                </ImageItemContainer>
                            )}
                            <ImageItemContainer>
                                <Link
                                    to={
                                        "/dashboard/payments/wizard/" +
                                        (activeAccount.active_id || currency)
                                    }
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        flexDirection: "column",
                                        width: "70px",
                                    }}
                                >
                                    <img
                                        src={`${process.env.PUBLIC_URL}/images/balances/right-circle.png`}
                                        width="42"
                                        alt="Plus"
                                    />
                                    <LinkDescription>
                                        Pay {currency}
                                    </LinkDescription>
                                </Link>
                            </ImageItemContainer>
                            <ImageItemContainer>
                                <Link
                                    to={
                                        "/dashboard/currencies/" +
                                        (activeAccount.active_id || currency)
                                    }
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        flexDirection: "column",
                                        width: "70px",
                                    }}
                                >
                                    <img
                                        src={`${process.env.PUBLIC_URL}/images/balances/convert-circle.png`}
                                        width="42"
                                        alt="Plus"
                                    />
                                    <LinkDescription>
                                        Convert {currency}
                                    </LinkDescription>
                                </Link>
                            </ImageItemContainer>
                        </UserRoleChecker>
                    </ImageGroupContainer>
                    {currencyDetails.can_deposit && (
                        <Link
                            to={`/dashboard/balances/${currency}/account_details/${account_id}`}
                            style={{ color: "#000" }}
                        >
                            My {currency} account details {">"}
                        </Link>
                    )}
                    <ActivityTitle>Activity</ActivityTitle>
                    <>
                        <Search integrated currency={currency} />
                    </>
                    <></>
                    <NextButton>
                        <Button
                            sky
                            style={{ width: "50vh", margin: "50px 0px" }}
                            onClick={() => navigate("/dashboard/balances")}
                        >
                            Back to Balances
                        </Button>
                    </NextButton>
                </Container>
            </DashboardLayout>
        </RequireAuth>
    );
}
const LinkDescription = styled.p`
    font-size: 0.8em;
    text-align: center;
    font-weight: normal;
    color: black;
`;
const ImageGroupContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    flex-direction: row;
`;
const ImageItemContainer = styled.div`
    padding: 0 5px;
    flex-direction: column;
`;
const Container = styled.div`
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    padding: 10px 20px 10px 0;
`;
const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
`;
const TitleContaier = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 0 10px;
    margin: 0;
`;
const LargeTitle = styled.h2`
    padding: 10px auto;
    margin: 0;
`;
const ActivityTitle = styled.h1`
    padding: 15px auto;
    margin: 10px 0;
    font-size: 2rem;
`;
const SmallTitle = styled.p`
    padding: 0;
    margin: 0;
`;
const NextButton = styled.div`
    @media (max-width: 768px) {
        flex-direction: row;
        justify-content: center;
        margin: 0;
    }
    @media (max-width: 992px) {
        flex-direction: row;
        justify-content: center;
        margin: 0;
    }
    margin-right: 10px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    border-radius: 100%;
`;
const BorderLabel = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    border: 1px solid ${(props) => props.theme.colors.secondary};
    padding: 15px;
    border-radius: 5px;
    align-items: center;
`;
const ResponsiveContainer = styled.div`
    overflow-x: auto;
    width: 100%;
`;
