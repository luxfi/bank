import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import RequireAuth from "../../../features/auth/RequireAuth";
import {
    AdminRoles,
    UserPaymentRoles,
    UserRoles,
} from "../../../features/auth/user-role.enum";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Button from "../../../components/Button";
import moment from 'moment';
import {
    loadAccount,
    loadActiveAccount,
    loadContact,
    loadConversion,
    loadSender,
    loadSettleAccountList,
    loadTransactionbyRef,
    selectAccount,
    selectActiveAccount,
    selectContact,
    selectConversion,
    selectSender,
    selectSettleAccount,
    selectTransaction,
    selectTransactionRef,
    setCurrencyAccount,
} from "../../../features/accounts/AccountsListSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
    deleteConversionAndReload,
    editConversion,
    selectSplitFromResponseData,
    selectSplitPreviewFromResponseData,
    splitConversion,
    splitConversionPreview,
} from "../../../features/accountview/ViewCurrencySlice";
import UserRoleChecker from "../../../utils/UserRoleChecker";
import { FlexibleForm, FlexibleFormField } from "../components/FlexibleForm";
import { Formik } from "formik";
import { ResponsiveTableContainer, Table } from "../components/Table";
import { TableBody } from "../components/TableBody";
import { TableHeadWithItems } from "../components/TableHead";
import { TableRow } from "../components/TableRow";
import { TableCell } from "../components/TableCell";
import { splitAmountSchema } from "../../../features/accountview/model/currencyAmountSchema";
import { editConversionSchema } from "../../../features/accountview/ViewCurrencyApi";
import DateInputField from "../../../components/DateInputField";
import { ErrorText } from "../components/ErrorText";
import { dateToHuman, snakeCaseToHumanCase } from "../../../utils/text-helpers";
import { device } from "../../../utils/media-query-helpers";
import { Icon } from "../components/Icon";
import { faReceipt, faSignature, faSyncAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import InputField from "../../../components/InputField";
import { snakeToWords } from "../../../utils/functions";
export default function Conversion({ init }: any) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const conversion = useAppSelector(selectConversion);
    const contact = useAppSelector(selectContact);
    const account = useAppSelector(selectAccount);
    const { uuid } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const splitPreview = useAppSelector(selectSplitPreviewFromResponseData);
    const splitResponse = useAppSelector(selectSplitFromResponseData);
    const [dateError, setDateError] = useState('');
    const editEnabled = false;
    const activeAccount = useAppSelector(selectActiveAccount);
    useEffect(()=> {
        dispatch(loadConversion({
            uuid: String(uuid)
        }));
    }, [uuid]);
    useEffect(() => {
        if (conversion.creator_contact_id) {
            dispatch(
                loadContact({ contact_id: conversion.creator_contact_id })
            );
            dispatch(loadAccount({account_id: conversion.account_id}));
        }
    }, [conversion]);
    const show = () => {
        setIsModalOpen(true);
    };
    const showSplit = () => {
        setIsSplitModalOpen(true);
    };
    const showEdit = () => {
        setIsEditModalOpen(true);
    }
    const handleEdit = ({new_settlement_date}:{new_settlement_date: string}) => {
        dispatch(editConversion({id: uuid, new_settlement_date}));
    }
    const previewSplit = ({split_amount}:{split_amount: string}) => {
        dispatch(splitConversionPreview({id: uuid, amount: split_amount}));
    }
    const handleSplit = ({split_amount}:{split_amount: string}) => {
        dispatch(splitConversion({id: uuid, amount: split_amount}));
    }
    return(
        <RequireAuth roles={UserRoles}>
            <DashboardLayout>
                <PageContainer>
                    <RowBetweenContainer>
                        <LargeTitle>
                            <Icon icon={faSyncAlt}/>
                            Conversion
                        </LargeTitle>
                    </RowBetweenContainer>
                    <RowContainer>
                        <Container>
                            <BoldTitle>Sold:</BoldTitle>
                        </Container>
                        <Container>
                            <BoldTitle>
                                {conversion.client_sell_amount} (
                                {conversion.sell_currency})
                            </BoldTitle>
                        </Container>
                    </RowContainer>
                    <RowContainer>
                        <Container>
                            <BoldTitle>Bought:</BoldTitle>
                        </Container>
                        <Container>
                            <BoldTitle>
                                {conversion.client_buy_amount} (
                                {conversion.buy_currency})
                            </BoldTitle>
                        </Container>
                    </RowContainer>
                    {!!conversion.fee_amount && 
                    <RowContainer>
                        <Container>
                            <BoldTitle>Fee:</BoldTitle>
                        </Container>
                        <Container>
                            <BoldTitle>
                                {conversion.fee_amount} (
                                {conversion.buy_currency})
                            </BoldTitle>
                        </Container>
                    </RowContainer>}
                    <RowContainer>
                        <Container>
                            <BoldTitle>Status:</BoldTitle>
                        </Container>
                        <Container>
                            <BoldTitle>
                                {" "}
                                {snakeCaseToHumanCase(conversion.status)}
                            </BoldTitle>
                        </Container>
                    </RowContainer>
                    <RowContainer>
                        <Container>
                            <BoldTitle>Created Date:</BoldTitle>
                        </Container>
                        <Container>
                            <BoldTitle>
                                {dateToHuman(conversion.created_at)}
                            </BoldTitle>
                        </Container>
                    </RowContainer>
                    {conversion.settlement_date &&
                    <RowContainer>
                        <Container>
                            <BoldTitle>Setttlement Date:</BoldTitle>
                        </Container>
                        <Container>
                            <BoldTitle>
                                {dateToHuman(new Date(
                                    conversion.settlement_date
                                ))}
                            </BoldTitle>
                        </Container>
                    </RowContainer>}
                    <RowContainer>
                        <Container>
                            <BoldTitle>Conversion Date:</BoldTitle>
                        </Container>
                        <Container>
                            <BoldTitle>
                                {dateToHuman(new Date(
                                    conversion.conversion_date
                                ))}
                            </BoldTitle>
                        </Container>
                    </RowContainer>
                    <RowContainer>
                        <Container>
                            <BoldTitle>Reference #:</BoldTitle>
                        </Container>
                        <Container>
                            <BoldTitle>{conversion.short_reference}</BoldTitle>
                        </Container>
                    </RowContainer>
                    {conversion.deposit_required && <>
                        <RowBetweenContainer>
                            <LargeTitle>
                                <Icon icon = {faReceipt} />
                                Deposit
                            </LargeTitle>
                        </RowBetweenContainer>
                        <RowContainer>
                            <Container>
                                Deposit of {Math.round(Number(conversion.deposit_amount) / Number(conversion.client_sell_amount) * 100)}% is required for this trade.
                            </Container>
                        </RowContainer>
                        <RowContainer>
                            <Container>
                                <BoldTitle>Deposit:</BoldTitle>
                            </Container>
                            <Container>
                                <BoldTitle>{conversion.deposit_amount} {conversion.deposit_currency}</BoldTitle>
                            </Container>
                        </RowContainer>
                        <RowContainer>
                            <Container>
                                <BoldTitle>Deposit must arrive by:</BoldTitle>
                            </Container>
                            <Container>
                                <BoldTitle>{dateToHuman(new Date(conversion.deposit_required_at))}</BoldTitle>
                            </Container>
                        </RowContainer>
                        <RowContainer>
                            <Container>
                                <BoldTitle>Deposit Status:</BoldTitle>
                            </Container>
                            <Container>
                                <BoldTitle>{snakeToWords(conversion.deposit_status)}</BoldTitle>
                            </Container>
                        </RowContainer>
                    </>}
                    <RowBetweenContainer>
                        <LargeTitle>
                            <Icon icon = {faSignature} />
                            Rates
                        </LargeTitle>
                    </RowBetweenContainer>
                    <RowContainer>
                        <Container>
                            <BoldTitle>Your Exchange Rate:</BoldTitle>
                        </Container>
                        <Container>
                            <BoldTitle><p>{conversion.client_rate} (Inverse: { Math.round(10000 / Number(conversion.client_rate) ) / 10000 }) on {dateToHuman(conversion.created_at)}</p></BoldTitle>
                        </Container>
                    </RowContainer>
                    {account && account.account_name && <>
                    <RowBetweenContainer>
                        <LargeTitle>
                            <Icon icon = {faUser} />
                            Creator
                        </LargeTitle>
                    </RowBetweenContainer>
                    <RowContainer>
                        <Container>
                            <BoldTitle>Account Name:</BoldTitle>
                        </Container>
                        <Container>
                            {account ? (
                                <BoldTitle>
                                    {account.account_name}{" "}
                                </BoldTitle>
                            ) : null}
                        </Container>
                    </RowContainer>
                    <RowContainer>
                        <Container>
                            <BoldTitle>Reference:</BoldTitle>
                        </Container>
                        <Container>
                            {account ? (
                                <BoldTitle>
                                    {account.short_reference}
                                </BoldTitle>
                            ) : null}
                        </Container>
                    </RowContainer>
                    <RowContainer>
                        <Container>
                            <BoldTitle>Contact:</BoldTitle>
                        </Container>
                        <Container>
                            {contact ? (
                                <BoldTitle>
                                    {contact.first_name} {contact.last_name}
                                </BoldTitle>
                            ) : null}
                        </Container>
                    </RowContainer>
                    </>
                    }
                </PageContainer>

                <UserRoleChecker roles={UserPaymentRoles}>
                    {!isModalOpen && !isSplitModalOpen && !isEditModalOpen ? 
                        <NextButton>
                            {conversion?.status == 'awaiting_funds' ? <>
                            <UserRoleChecker roles={AdminRoles}>
                                <Button danger onClick={async () => {
                                show();
                                }}>Cancel Conversion</Button>
                            </UserRoleChecker>
                            <Button sky onClick={async () => {
                               showSplit();
                            }}>Split</Button>
                            {editEnabled &&<Button sky onClick={async () => {
                               showEdit();
                            }}>Edit</Button>}
                            </> : null}

                            <Button sky onClick={() => navigate('/dashboard/payments/wizard/'+conversion.buy_currency+'?conversion_id='+uuid)}>Make Payment</Button>
                            <Button sky onClick={() => navigate('/dashboard/balances')}>Back to my Balances</Button>
                        </NextButton>
                        :
                        null
                    }
                {
                    isModalOpen?
                    <Container style={{ border: '1px solid red', borderRadius: '15px', padding: '15px' }}>
                        <RowContainer>
                            <LargeTitle style={{ marginLeft: '20px' }}><strong>Cancel Conversion</strong></LargeTitle>
                        </RowContainer>
                        <RowContainer>
                            <BoldTitle style={{ marginLeft: '20px' }}>Are you sure you want to cancel this conversion?</BoldTitle>
                        </RowContainer>
                        <RowContainer>
                            <NextButton>
                                <Button sky style = {{width: '50vh', margin:'10px 10px', borderRadius: '10px'}} onClick={() => setIsModalOpen(false)}>No, don't Cancel Conversion</Button>
                            </NextButton>
                            <NextButton>
                                <Button danger style = {{width: '50vh', margin:'10px 10px', borderRadius: '10px'}} onClick={async () => {
                                    await deleteConversionAndReload(String(uuid))(dispatch)
                                    //  dispatch(loadConversion({uuid: String(uuid)}));
                                    navigate('/dashboard/balances/'+conversion.buy_currency+'/transactions/' + (activeAccount.active_account_id || conversion.account_id) + '?deleted_conversion_id='+uuid)
                                }}>Yes, Cancel Conversion</Button>
                            </NextButton>
                        </RowContainer>
                    </Container>
                    :
                    null
                }
                {isEditModalOpen&&
                <Formik
                enableReinitialize
                initialValues={{
                    new_settlement_date: moment(new Date()).format("YYYY-MM-DD"),
                }}
                validationSchema={editConversionSchema}
                onSubmit={handleEdit}
            >
                <FlexibleForm>
            <Container>
                <LargeTitle><strong>Edit Conversion</strong></LargeTitle>
                <RowContainer>
                    <DateInputField
                        defaultValue={conversion.settlement_date}
                        labeltext="Please remember to offset your payment date against GMT."
                        name="new_settlement_date"
                        type="date"
                        helpText = "To ensure your payment is made on the date intended, please make applicable adjustments to payment date to reflect the offset against GMT. You are not able to make payments on a date preceding the local time of payment destination"
                    />
                    <ErrorText>{dateError}</ErrorText>
                </RowContainer>
                <RowContainer>
                    <NextButton>
                        <Button sky onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                        <Button danger type={'submit'}>Confirm Date Change</Button>
                    </NextButton>
                </RowContainer>
                </Container>
                </FlexibleForm>
                </Formik>}
                {
                    isSplitModalOpen?
                    <Formik
                        enableReinitialize
                        initialValues={{
                            split_amount: '0.00',
                        }}
                        validationSchema={splitAmountSchema}
                        onSubmit={!splitPreview.parent_conversion.id ? previewSplit  : handleSplit}
                    >
                    {({values, setFieldValue}) => 
                        <FlexibleForm>
                    <Container>
                        <RowContainer>
                            <LargeTitle><strong>Split Conversion</strong></LargeTitle>
                        </RowContainer>
                        {splitPreview.parent_conversion.id !== '' && !splitResponse.parent_conversion.id && <>
                        <LargeTitle>Parent Conversion</LargeTitle>
                        <ResponsiveTableContainer>
                        <Table>
                            
                            <TableHeadWithItems items={['Reference', 'Sold', 'Bought', 'Settlement Date', 'Conversion Date']} />
                            <TableBody>
                                <TableRow>
                                    <TableCell width="20%">{splitPreview.parent_conversion.short_reference}</TableCell>
                                    <TableCell>{splitPreview.parent_conversion.sell_amount} {splitPreview.parent_conversion.sell_currency}</TableCell>
                                    <TableCell>{splitPreview.parent_conversion.buy_amount} {splitPreview.parent_conversion.buy_currency}</TableCell>
                                    <TableCell>{dateToHuman(splitPreview.parent_conversion.settlement_date)}</TableCell>
                                    <TableCell>{dateToHuman(splitPreview.parent_conversion.conversion_date)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        </ResponsiveTableContainer>
                        <LargeTitle>Child Conversion</LargeTitle>
                        <ResponsiveTableContainer>
                        <Table>
                            <TableHeadWithItems items={['Reference', 'Sold', 'Bought', 'Settlement Date', 'Conversion Date']} />
                            <TableBody>
                                <TableRow>
                                    <TableCell width="20%">{splitPreview.child_conversion.short_reference}</TableCell>
                                    <TableCell>{splitPreview.child_conversion.sell_amount} {splitPreview.child_conversion.sell_currency}</TableCell>
                                    <TableCell>{splitPreview.child_conversion.buy_amount} {splitPreview.child_conversion.buy_currency}</TableCell>
                                    <TableCell>{dateToHuman(splitPreview.child_conversion.settlement_date)}</TableCell>
                                    <TableCell>{dateToHuman(splitPreview.child_conversion.conversion_date)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        </ResponsiveTableContainer>
                        </>}
                        {splitResponse.parent_conversion.id !== '' && <>
                        <LargeTitle>Parent Conversion</LargeTitle>
                        <ResponsiveTableContainer>
                        <Table>
                            <TableHeadWithItems items={['Reference', 'Sold', 'Bought', 'Settlement Date', 'Conversion Date']} />
                            <TableBody>
                                <TableRow>
                                    <TableCell width="20%">{splitResponse.parent_conversion.short_reference}</TableCell>
                                    <TableCell>{splitResponse.parent_conversion.sell_amount} {splitResponse.parent_conversion.sell_currency}</TableCell>
                                    <TableCell>{splitResponse.parent_conversion.buy_amount} {splitResponse.parent_conversion.buy_currency}</TableCell>
                                    <TableCell>{dateToHuman(splitResponse.parent_conversion.settlement_date)}</TableCell>
                                    <TableCell>{dateToHuman(splitResponse.parent_conversion.conversion_date)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        </ResponsiveTableContainer>
                        <LargeTitle>Child Conversion</LargeTitle>
                        <ResponsiveTableContainer>
                        <Table>
                            <TableHeadWithItems items={['Reference', 'Sold', 'Bought', 'Settlement Date', 'Conversion Date']} />
                            <TableBody>
                                <TableRow>
                                    <TableCell width="20%">{splitResponse.child_conversion.short_reference}</TableCell>
                                    <TableCell>{splitResponse.child_conversion.sell_amount} {splitResponse.child_conversion.sell_currency}</TableCell>
                                    <TableCell>{splitResponse.child_conversion.buy_amount} {splitResponse.child_conversion.buy_currency}</TableCell>
                                    <TableCell>{dateToHuman(splitResponse.child_conversion.settlement_date)}</TableCell>
                                    <TableCell>{dateToHuman(splitResponse.child_conversion.conversion_date)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        </ResponsiveTableContainer>
                        </>}
                        {!splitPreview.parent_conversion.id && !splitResponse.parent_conversion.id &&
                        <RowContainer>
                            <InputField 
                                labeltext="Amount"
                                name="split_amount"
                                placeholder="0.00"
                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                    const input = e.target.value.replace(/[^0-9.]/g,'') || 0;
                                    setFieldValue('amount', Number(input).toFixed(2))
                                }}
                            />
                        </RowContainer>
                        }
                        <RowContainer>
                            <NextButton>
                                <Button sky onClick={() => setIsSplitModalOpen(false)}>Cancel</Button>
                            </NextButton>
                            {!splitPreview.parent_conversion.id && !splitResponse.parent_conversion.id &&
                            <NextButton>
                                <Button danger type={'submit'} >Split</Button>
                            </NextButton>}
                            {splitPreview.parent_conversion.id !== '' && !splitResponse.parent_conversion.id &&
                            <NextButton>
                                <Button danger type={'submit'}>Confirm Split</Button>
                            </NextButton>}
                        </RowContainer>
                    </Container>
                    </FlexibleForm>
                    }
                    </Formik>:null
                }
                </UserRoleChecker>
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
const PageContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    flex-basis: 100vw;
    padding: 10px 20px 10px 0;
    @media (${device.lg}) {
        width: 60%;
    }
`;
const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-left: 25px;
`;
const RowBetweenContainer = styled.div`
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const LargeTitle = styled.h2`
    font-size: 18px;
    font-weight: bold;
    padding: 10px auto;
    margin: 0;
`;
const Title = styled.h2`
    padding: 10px auto;
    margin: 0;
`;
const BoldTitle = styled.h4`
    padding: 10px auto;
    margin: 0;
`;

const NextButton = styled.div`
    @media (max-width: 768px) {
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 0;
    }
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    border-radius: 100%;
`;
