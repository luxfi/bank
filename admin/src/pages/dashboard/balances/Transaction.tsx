import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import RequireAuth from "../../../features/auth/RequireAuth";
import { UserRoles } from "../../../features/auth/user-role.enum";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Button from "../../../components/Button";
import { loadAccount, loadActiveAccount, loadContact, loadConversion, loadSender, loadSettleAccountList, loadTransactionbyRef, selectAccount, selectContact, selectConversion, selectSender, selectSettleAccount, selectTransaction, selectTransactionRef, setCurrencyAccount } from "../../../features/accounts/AccountsListSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { dateToHuman, snakeCaseToHumanCase } from '../../../utils/text-helpers';
export default function Transaction({init}:any) {
    const navigate = useNavigate();
    const dispatch =useAppDispatch();
    const activeAccount = useAppSelector(selectAccount);
    const transaction = useAppSelector(selectTransactionRef);
    const sender = useAppSelector(selectSender);
    const {uuid} = useParams();
    // console.log('conversion', conversion, 'transaction', transaction);
    useEffect(() => {
        dispatch(loadTransactionbyRef({
            short_ref: String(uuid)
        }));
    }, [uuid])
    useEffect(()=>{
        if(transaction.related_entity_id){
            dispatch(loadSender({entity_id: transaction.related_entity_id}));
        }
        if(transaction.account_id){
            dispatch(loadAccount({
                account_id: transaction.account_id
            }))
        }
    }, [transaction]);
    return(
        <RequireAuth roles={UserRoles}>
            <DashboardLayout>
            {/* {breadcrumbs.map(({ breadcrumb, match }, index) => (
                <div className="bc" >
                    <Link to={match.url || ""}>
                        {breadcrumb}    
                    </Link> 
                    {index <breadcrumb.length -1 && ">"}
                </div>
            ))}   */}
            {
                <Container>
                <>
                    <RowBetweenContainer>
                        <Title>
                            Funding Details
                        </Title>
                    </RowBetweenContainer>
                    <RowBetweenContainer>
                        <LargeTitle>
                            Transaction
                        </LargeTitle>
                    </RowBetweenContainer>
                    <RowContainer>
                        <Container>
                            <BoldTitle>Account Name:</BoldTitle>
                            <BoldTitle>Amount:</BoldTitle>
                            <BoldTitle>Status:</BoldTitle>
                            <BoldTitle>Type/Reason:</BoldTitle>
                            <BoldTitle>Credit/Debit:</BoldTitle>
                            <BoldTitle>Created Date:</BoldTitle>
                            {!!transaction.pay_in_details?.paymentType &&
                            <BoldTitle>Payment type:</BoldTitle>}
                            {!!transaction.pay_in_details?.transactionReference &&
                            <BoldTitle>Payment reference:</BoldTitle>}
                        </Container>

                        <Container>
                            <BoldTitle>{transaction.account_name || activeAccount.account_name}</BoldTitle>
                            <BoldTitle>{transaction.amount}({transaction.currency})</BoldTitle>
                            <BoldTitle> {snakeCaseToHumanCase(transaction.status)} </BoldTitle>
                            <BoldTitle>{transaction.action} </BoldTitle>
                            <BoldTitle>{transaction.type}</BoldTitle>
                            <BoldTitle>{new Date(transaction.created_at).toDateString()}</BoldTitle>
                            <BoldTitle>{transaction.pay_in_details?.paymentType}</BoldTitle>
                            <BoldTitle>{transaction.pay_in_details?.transactionReference}</BoldTitle>
                            
                        </Container>
                        
                    </RowContainer>
                </>
                {transaction.pay_in_details && <>
                    <RowBetweenContainer>
                        <LargeTitle>
                           Sender
                        </LargeTitle>
                    </RowBetweenContainer>
                    <RowContainer>
                        <Container>
                            {!!transaction.pay_in_details.senderName &&
                            <BoldTitle>Name:</BoldTitle>
                            }
                            {!!transaction.pay_in_details.senderAddress &&
                            <BoldTitle>Address:</BoldTitle>}
                            {!!transaction.pay_in_details.senderBic &&
                            <BoldTitle>BIC:</BoldTitle>}
                            {!!transaction.pay_in_details.senderIban &&
                            <BoldTitle>IBAN:</BoldTitle>}
                            {!!transaction.pay_in_details.routingCodeEntries[0]?.routingCodeValue &&
                                <BoldTitle>Sort code:</BoldTitle>
                            }
                            {!!transaction.pay_in_details.senderAccountNumber &&
                                <BoldTitle>Account number:</BoldTitle>
                            }
                        </Container>
                        <Container>
                            <BoldTitle>{transaction.pay_in_details.senderName}</BoldTitle>
                            {!!transaction.pay_in_details.senderAddress &&
                            <BoldTitle>{transaction.pay_in_details.senderAddress}</BoldTitle>}
                            <BoldTitle>{transaction.pay_in_details.senderBic}</BoldTitle>
                            <BoldTitle>{transaction.pay_in_details.senderIban}</BoldTitle>
                            <BoldTitle>{transaction.pay_in_details.routingCodeEntries[0]?.routingCodeValue}</BoldTitle>
                            <BoldTitle>{transaction.pay_in_details.senderAccountNumber}</BoldTitle>
                        </Container>
                    </RowContainer>
                </>}
                {sender && sender.amount && <>
                    <RowBetweenContainer>
                        <LargeTitle>
                           Sender
                        </LargeTitle>
                    </RowBetweenContainer>
                    <RowContainer>
                        <Container>
                            <BoldTitle>Amount:</BoldTitle>
                            <BoldTitle>Additional Information:</BoldTitle>
                            <BoldTitle>Value Date:</BoldTitle>
                            <BoldTitle>Sender:</BoldTitle>
                            <BoldTitle>Created Date:</BoldTitle>
                        </Container>
                        <Container>
                            <BoldTitle>{sender.amount}({sender.currency})</BoldTitle>
                            <BoldTitle>{sender.additional_information}</BoldTitle>
                            <BoldTitle>{dateToHuman(sender.value_date)}</BoldTitle>
                            <BoldTitle>{sender.sender}</BoldTitle>
                            <BoldTitle>{dateToHuman(sender.created_at)}</BoldTitle>
                        </Container>
                    </RowContainer>
                </>}
                
                
                </Container>
            }
           
                <NextButton>
                    <Button sky style = {{width: '50vh', margin:'50px 0px', borderRadius: '10px'}} onClick={() => navigate('/dashboard/balances')}>Back to my Balances</Button>
                </NextButton>
            </DashboardLayout>
        </RequireAuth >
    )
};


const Container = styled.div`
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    flex-basis: 100vw;
    padding: 10px 20px 10px 0;
`
const RowContainer = styled.div`
    padding-left: 25px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`
const RowBetweenContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`

const LargeTitle = styled.h3`
    font-size: 18px;
    font-weight: bold;
    padding: 10px auto;
    margin: 0;
`
const Title = styled.h2`
    padding: 10px auto;
    margin: 0;
`
const BoldTitle = styled.h4`
    padding: 10px auto;
    margin: 0;
`

const NextButton =styled.div`
    @media(max-width: 768px) {
        flex-direction: row;
        justify-content: center;
        margin: 0;
    }
    @media(max-width: 992px) {
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
