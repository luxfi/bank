import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import RequireAuth from "../../../features/auth/RequireAuth";
import { UserRoles } from "../../../features/auth/user-role.enum";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Button from "../../../components/Button";
import copy from "copy-to-clipboard";
import {
    loadAccount,
    loadSettleAccountList,
    selectAccount,
    selectSettleAccount,
} from "../../../features/accounts/AccountsListSlice";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
    FundingAccountResponse,
    ReferenceSettleAccountResponse,
} from "../../../features/accounts/model/account-response";

export const AccountNumberTypeDictionary = {
    iban: "IBAN",
    account_number: "Account Number",
};

export const RoutingCodeTypeDictionary = {
    bic_swift: "BIC",
    sort_code: "Sort Code",
};

export default function BalanceDetails() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const account = useAppSelector(selectAccount);
    const { currency, account_id } = useParams();

    useEffect(() => {
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

    const { funding_accounts } = useAppSelector(selectSettleAccount);

    const handleCopyFundingAccountText = (
        funding_account: FundingAccountResponse
    ) => {
        copy(`
        Account Holder Name: ${funding_account.account_holder_name} 
        ${AccountNumberTypeDictionary[funding_account.account_number_type]}: ${
            funding_account.account_number
        } 
        ${RoutingCodeTypeDictionary[funding_account.routing_code_type]}: ${
            funding_account.routing_code
        }        
        Bank Name: ${funding_account.bank_name} 
        Bank Address: ${funding_account.bank_address}
        Bank Country: ${funding_account.bank_country}`);
    };

    const handleCopySettlementAccountsText = (
        settle_account: ReferenceSettleAccountResponse
    ) => {
        copy(`
        Payment Reference: ${account.short_reference} 
        Account Holder Name: ${settle_account.bank_account_holder_name} 
        IBAN: ${settle_account.iban} 
        BIC: ${settle_account.bic_swift} 
        Account Number: ${settle_account.account_number}
        ${RoutingCodeTypeDictionary[settle_account.routing_code_type_1]}: ${
            settle_account.routing_code_value_1
        } 
        Bank Name: ${settle_account.bank_name} 
        Bank Address: ${settle_account.bank_address}`);
    };

    return (
        <RequireAuth roles={UserRoles}>
            <DashboardLayout>
                <Container>
                    <LargeTitle>
                        <strong>{currency} account details</strong>
                    </LargeTitle>
                    <>
                        {funding_accounts.map((funding_account) => (
                            <>
                                <RowBetweenContainer>
                                    <Link
                                        to="#"
                                        onClick={() =>
                                            handleCopyFundingAccountText(
                                                funding_account
                                            )
                                        }
                                    >
                                        Copy account details
                                    </Link>
                                </RowBetweenContainer>
                                <RowContainer key={funding_account.id}>
                                    <Container>
                                        <BoldTitle>
                                            Account Holder Name
                                        </BoldTitle>
                                        <p>
                                            {
                                                funding_account.account_holder_name
                                            }
                                        </p>
                                        <BoldTitle>
                                            {
                                                AccountNumberTypeDictionary[
                                                    funding_account
                                                        .account_number_type
                                                ]
                                            }
                                        </BoldTitle>
                                        <p>{funding_account.account_number}</p>
                                        <BoldTitle>
                                            {
                                                RoutingCodeTypeDictionary[
                                                    funding_account
                                                        .routing_code_type
                                                ]
                                            }
                                        </BoldTitle>
                                        <p>{funding_account.routing_code}</p>
                                    </Container>
                                    <Container>
                                        <BoldTitle>Bank Name</BoldTitle>
                                        <p>{funding_account.bank_name}</p>
                                        <BoldTitle>Bank Address</BoldTitle>
                                        <p>{funding_account.bank_address}</p>
                                        <BoldTitle>Bank Country</BoldTitle>
                                        <p>{funding_account.bank_country}</p>
                                    </Container>
                                </RowContainer>
                            </>
                        ))}
                    </>
                    {/* {settlement_accounts.map((settle_account, idx) => (
                        <>
                            <RowBetweenContainer>
                                <Link
                                    to="#"
                                    onClick={() =>
                                        handleCopySettlementAccountsText(
                                            settle_account
                                        )
                                    }
                                >
                                    Copy account details
                                </Link>
                            </RowBetweenContainer>
                            <RowContainer key={`${idx}-settlement-accounts`}>
                                <Container>
                                    <BoldTitle>Payment Reference</BoldTitle>
                                    <p>{account.short_reference}</p>
                                    <BoldTitle>Account Holder Name</BoldTitle>
                                    <p>
                                        {
                                            settle_account.bank_account_holder_name
                                        }
                                    </p>
                                    <BoldTitle>IBAN</BoldTitle>
                                    <p>{settle_account.iban}</p>
                                    <BoldTitle>BIC</BoldTitle>
                                    <p>{settle_account.bic_swift}</p>
                                </Container>
                                <Container>
                                    <BoldTitle>Account Number</BoldTitle>
                                    <p>{settle_account.account_number}</p>
                                    <BoldTitle>
                                        {
                                            RoutingCodeTypeDictionary[
                                                settle_account
                                                    .routing_code_type_1
                                            ]
                                        }
                                    </BoldTitle>
                                    <p>{settle_account.routing_code_value_1}</p>
                                    <BoldTitle>Bank Name</BoldTitle>
                                    <p>{settle_account.bank_name}</p>
                                    <BoldTitle>Bank Address</BoldTitle>
                                    <p>{settle_account.bank_address}</p>
                                </Container>
                            </RowContainer>
                        </>
                    ))} */}
                    <NextButton>
                        <Button
                            sky
                            style={{
                                width: "50vh",
                                margin: "50px 0px",
                                borderRadius: "10px",
                            }}
                            onClick={() => navigate("/dashboard/balances")}
                        >
                            Back to my {currency} Balances
                        </Button>
                    </NextButton>
                </Container>
            </DashboardLayout>
        </RequireAuth>
    );
}

const Container = styled.div`
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    flex-basis: 100vw;
    padding: 10px 20px 10px 0;
`;
const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;
const RowBetweenContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 20px;
`;

const LargeTitle = styled.h2`
    padding: 10px auto;
    margin: 0;
`;
const BoldTitle = styled.h3`
    padding: 10px auto;
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
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    border-radius: 100%;
`;
