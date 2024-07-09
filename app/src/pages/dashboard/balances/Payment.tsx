import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import RequireAuth from "../../../features/auth/RequireAuth";
import {
    UserPaymentRoles,
    UserRoles,
} from "../../../features/auth/user-role.enum";
import styled from "styled-components";
import Button from "../../../components/Button";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
    deletePaymentAndReload,
    loadBeneficiary,
    loadPayer,
    selectBeneficiary,
    selectPayer,
    loadPayment,
    selectPayment,
} from "../../../features/accountview/ViewPaymentSlice";
import { ResponsiveTableContainer, Table } from "../components/Table";
import { TableHeadWithItems } from "../components/TableHead";
import { TableBody } from "../components/TableBody";
import { TableRow } from "../components/TableRow";
import { TableCell } from "../components/TableCell";
import { quotePostFromResponseInitData } from "../../../features/accountview/ViewCurrencySlice";
import { getConversion } from "../../../features/accounts/AccountsApi";
import { dateToHuman, snakeCaseToHumanCase } from "../../../utils/text-helpers";
import { Icon } from "../components/Icon";
import {
    faAddressBook,
    faReceipt,
    faSyncAlt,
    faUniversity,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { device } from "../../../utils/media-query-helpers";
import { selectActiveAccount } from "../../../features/accounts/AccountsListSlice";
import UserRoleChecker from "../../../utils/UserRoleChecker";
export default function Payment({ init }: any) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [linkedConversion, setLinkedConversion] = useState(
        quotePostFromResponseInitData
    );
    const payment = useAppSelector(selectPayment);
    const payer = useAppSelector(selectPayer);
    const beneficiary = useAppSelector(selectBeneficiary);
    const { uuid } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const activeAccount = useAppSelector(selectActiveAccount);
    useEffect(() => {
        const loadConversion = async () => {
            if (payment.conversion_id) {
                const loadedconversion = await getConversion(
                    String(payment.conversion_id)
                );
                setLinkedConversion(loadedconversion);
            }
        };
        loadConversion();
    }, [payment]);
    useEffect(() => {
        dispatch(
            loadPayment({
                uuid: String(uuid),
            })
        );
    }, [uuid]);
    useEffect(() => {
        if (payment.beneficiary_id) {
            dispatch(loadBeneficiary({ uuid: payment.beneficiary_id }));
        }
        if (payment.payer_id) {
            dispatch(loadPayer(String(payment.payer_id)));
        }
    }, [payment.payer_id, payment.beneficiary_id]);
    const showEdit = () => {
        navigate(
            `/dashboard/payments/wizard/${payment.currency}?payment_id=${uuid}`
        );
    };
    return (
        <RequireAuth roles={UserRoles}>
            <DashboardLayout>
                <Container>
                    <>
                        <RowBetweenContainer>
                            <LargeTitle>
                                <Icon icon={faReceipt} />
                                Receipt
                            </LargeTitle>
                        </RowBetweenContainer>
                        <RowContainer>
                            <Container>
                                <BoldTitle>Amount:</BoldTitle>
                                <BoldTitle>Payment Type:</BoldTitle>
                                <BoldTitle>Payment Date:</BoldTitle>
                                <BoldTitle>Payment Reason:</BoldTitle>
                                <BoldTitle>Payment Reference:</BoldTitle>
                                <BoldTitle>Payment Status:</BoldTitle>
                                {payment.status == "failed" ? (
                                    <>
                                        <BoldTitle>Failure Reason:</BoldTitle>
                                        <BoldTitle>Amount Returned:</BoldTitle>
                                    </>
                                ) : null}
                                {payment.status == "completed" ? (
                                    <BoldTitle>Transferred At:</BoldTitle>
                                ) : null}

                                <BoldTitle>Reference Number:</BoldTitle>
                                {!!payment.fee_amount && (
                                    <BoldTitle>Fee:</BoldTitle>
                                )}
                            </Container>
                            {
                                <Container>
                                    <BoldTitle>
                                        {payment.amount} ({payment.currency})
                                    </BoldTitle>
                                    <BoldTitle>
                                        {payment.payment_type}
                                    </BoldTitle>
                                    <BoldTitle>
                                        {" "}
                                        {payment.payment_date
                                            ? dateToHuman(payment.payment_date)
                                            : ""}
                                    </BoldTitle>
                                    <BoldTitle>{payment.reason} </BoldTitle>
                                    <BoldTitle>{payment.reference}</BoldTitle>
                                    <BoldTitle>
                                        {snakeCaseToHumanCase(payment.status)}
                                    </BoldTitle>
                                    {payment.status == "failed" ? (
                                        <>
                                            <BoldTitle>
                                                {payment.failure_reason}
                                            </BoldTitle>
                                            <BoldTitle>
                                                {
                                                    payment.failure_returned_amount
                                                }
                                            </BoldTitle>
                                        </>
                                    ) : null}
                                    {payment.status == "completed" ? (
                                        <BoldTitle>
                                            {payment.transferred_at
                                                ? new Date(
                                                      payment.transferred_at
                                                  ).toDateString()
                                                : ""}
                                        </BoldTitle>
                                    ) : null}

                                    <BoldTitle>
                                        {payment.short_reference}
                                    </BoldTitle>
                                    {!!payment.fee_amount && (
                                        <BoldTitle>
                                            {Number(payment.fee_amount).toFixed(
                                                2
                                            )}{" "}
                                            ({payment.fee_currency})
                                        </BoldTitle>
                                    )}
                                </Container>
                            }
                        </RowContainer>
                    </>

                    {!!linkedConversion.id && (
                        <>
                            <LargeTitle>
                                <Icon icon={faSyncAlt} />
                                Linked Conversion
                            </LargeTitle>
                            <ResponsiveTableContainer>
                                <Table>
                                    <TableHeadWithItems
                                        items={[
                                            "Reference",
                                            "Sold",
                                            "Bought",
                                            "Settlement Date",
                                            "Conversion Date",
                                        ]}
                                    />
                                    <TableBody>
                                        <TableRow>
                                            <TableCell width="20%">
                                                {
                                                    linkedConversion?.short_reference
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    linkedConversion?.client_sell_amount
                                                }{" "}
                                                {
                                                    linkedConversion?.sell_currency
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    linkedConversion?.client_buy_amount
                                                }{" "}
                                                {linkedConversion?.buy_currency}
                                            </TableCell>
                                            <TableCell>
                                                {dateToHuman(
                                                    linkedConversion?.settlement_date
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {dateToHuman(
                                                    linkedConversion?.conversion_date
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </ResponsiveTableContainer>
                        </>
                    )}
                    {payer && payer.company_name && (
                        <>
                            <RowBetweenContainer>
                                <LargeTitle>
                                    <Icon icon={faUser} />
                                    Payer - {payer.company_name}
                                </LargeTitle>
                            </RowBetweenContainer>
                            <RowContainer>
                                <Container>
                                    <BoldTitle>Company: </BoldTitle>
                                    {payment.status != "ready_to_send" ? (
                                        <BoldTitle>
                                            Incorporation Number:{" "}
                                        </BoldTitle>
                                    ) : null}

                                    <BoldTitle>Address: </BoldTitle>
                                    <BoldTitle>City: </BoldTitle>
                                    <BoldTitle>Country: </BoldTitle>
                                    {payment.status != "ready_to_send" ? (
                                        <BoldTitle>Postcode: </BoldTitle>
                                    ) : null}
                                </Container>
                                <Container>
                                    <BoldTitle>{payer.company_name}</BoldTitle>
                                    {payment.status != "ready_to_send" ? (
                                        <BoldTitle>
                                            {payer.identification_value}
                                        </BoldTitle>
                                    ) : null}

                                    <BoldTitle>{payer.address}</BoldTitle>
                                    <BoldTitle>{payer.city}</BoldTitle>
                                    <BoldTitle>{payer.country}</BoldTitle>
                                    {payment.status != "ready_to_send" ? (
                                        <BoldTitle>{payer.postcode}</BoldTitle>
                                    ) : null}
                                </Container>
                            </RowContainer>
                        </>
                    )}
                    {beneficiary && beneficiary.name && (
                        <>
                            <RowBetweenContainer>
                                <LargeTitle>
                                    <Icon icon={faAddressBook} />
                                    Beneficiary Details
                                </LargeTitle>
                            </RowBetweenContainer>
                            <RowContainer>
                                <Container>
                                    <BoldTitle>Beneficiary Name:</BoldTitle>
                                </Container>
                                <Container>
                                    <BoldTitle>{beneficiary.name}</BoldTitle>
                                </Container>
                            </RowContainer>
                            <RowBetweenContainer>
                                <LargeTitle>
                                    <Icon icon={faUniversity} />
                                    Beneficiary Bank Details
                                </LargeTitle>
                            </RowBetweenContainer>
                            <RowContainer>
                                <Container>
                                    {!!beneficiary.beneficiary_entity_type && (
                                        <BoldTitle>Entity Type:</BoldTitle>
                                    )}
                                    {!!beneficiary.beneficiary_address
                                        ?.length && (
                                        <BoldTitle>
                                            Beneficiary Address:
                                        </BoldTitle>
                                    )}
                                    {!!beneficiary.beneficiary_city && (
                                        <BoldTitle>City:</BoldTitle>
                                    )}
                                    {!!beneficiary.beneficiary_country && (
                                        <BoldTitle>
                                            Beneficiary Country:
                                        </BoldTitle>
                                    )}
                                    {!!beneficiary.account_number && (
                                        <BoldTitle>Account Number:</BoldTitle>
                                    )}
                                    {!!beneficiary.routing_code_value_1 && (
                                        <BoldTitle>Sort Code:</BoldTitle>
                                    )}
                                    {!!beneficiary.beneficiary_company_name && (
                                        <BoldTitle>Company Name:</BoldTitle>
                                    )}
                                    {!!beneficiary.bic_swift && (
                                        <BoldTitle>BIC/SWIFT Code:</BoldTitle>
                                    )}
                                    {!!beneficiary.iban && (
                                        <BoldTitle>IBAN: </BoldTitle>
                                    )}
                                </Container>
                                <Container>
                                    {!!beneficiary.beneficiary_entity_type && (
                                        <BoldTitle>
                                            {
                                                beneficiary.beneficiary_entity_type
                                            }
                                        </BoldTitle>
                                    )}
                                    {!!beneficiary.beneficiary_address
                                        ?.length && (
                                        <BoldTitle>
                                            {beneficiary.beneficiary_address}
                                        </BoldTitle>
                                    )}
                                    {!!beneficiary.beneficiary_city && (
                                        <BoldTitle>
                                            {beneficiary.beneficiary_city}
                                        </BoldTitle>
                                    )}
                                    {!!beneficiary.beneficiary_country && (
                                        <BoldTitle>
                                            {beneficiary.beneficiary_country}
                                        </BoldTitle>
                                    )}
                                    {!!beneficiary.account_number && (
                                        <BoldTitle>
                                            {beneficiary.account_number}
                                        </BoldTitle>
                                    )}
                                    {!!beneficiary.routing_code_value_1 && (
                                        <BoldTitle>
                                            {beneficiary.routing_code_value_1}
                                        </BoldTitle>
                                    )}
                                    {!!beneficiary.beneficiary_company_name && (
                                        <BoldTitle>
                                            {
                                                beneficiary.beneficiary_company_name
                                            }
                                        </BoldTitle>
                                    )}
                                    {!!beneficiary.bic_swift && (
                                        <BoldTitle>
                                            {beneficiary.bic_swift}
                                        </BoldTitle>
                                    )}
                                    {!!beneficiary.iban && (
                                        <BoldTitle>
                                            {beneficiary.iban}
                                        </BoldTitle>
                                    )}
                                </Container>
                            </RowContainer>
                        </>
                    )}
                </Container>
                {!isModalOpen ? (
                    <ButtonRow>
                        <UserRoleChecker roles={UserPaymentRoles}>
                            <NextButton style={{ gap: "25px" }}>
                                {payment.status == "ready_to_send" &&
                                    [
                                        "SWIFT",
                                        "FASTER_PAYMENTS",
                                        "ACH",
                                        "CHAPS",
                                        "SEPA",
                                        "SEPA_INSTANT",
                                        "TARGET2",
                                    ].indexOf(payment.payment_type) === -1 && (
                                        <>
                                            <Button
                                                primary
                                                onClick={() => {
                                                    showEdit();
                                                }}
                                            >
                                                Edit
                                            </Button>
                                        </>
                                    )}
                                {(payment.status == "ready_to_send" ||
                                    payment.status == "PENDING") && (
                                    <Button
                                        danger
                                        onClick={() => {
                                            setIsModalOpen(true);
                                        }}
                                    >
                                        Cancel Payment
                                    </Button>
                                )}
                            </NextButton>
                        </UserRoleChecker>
                        <NextButton>
                            <Button
                                sky
                                onClick={() => navigate("/dashboard/balances")}
                            >
                                Back to my Balances
                            </Button>
                        </NextButton>
                    </ButtonRow>
                ) : null}

                {isModalOpen ? (
                    <Container
                        style={{
                            border: "1px solid red",
                            borderRadius: "15px",
                            padding: "15px",
                        }}
                    >
                        <RowContainer>
                            <LargeTitle style={{ marginLeft: "20px" }}>
                                <strong>Cancel Payment</strong>
                            </LargeTitle>
                        </RowContainer>
                        <RowContainer>
                            <BoldTitle style={{ marginLeft: "20px" }}>
                                Are you sure you want to cancel this payment?
                            </BoldTitle>
                        </RowContainer>
                        <RowContainer>
                            <NextButton>
                                <Button
                                    sky
                                    style={{
                                        width: "50vh",
                                        margin: "10px 0px",
                                        borderRadius: "10px",
                                    }}
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    No, don't Cancel Payment
                                </Button>
                            </NextButton>
                            <NextButton>
                                <Button
                                    danger
                                    style={{
                                        width: "50vh",
                                        margin: "10px 0px",
                                        borderRadius: "10px",
                                    }}
                                    onClick={() => {
                                        deletePaymentAndReload(String(uuid))(
                                            dispatch
                                        );
                                        navigate(
                                            "/dashboard/balances/" +
                                                payment.currency +
                                                "/transactions/" +
                                                (payment.account_name ||
                                                    activeAccount.active_account_id) +
                                                "?deleted_payment_id=" +
                                                uuid
                                        );
                                    }}
                                >
                                    Yes, Cancel Payment
                                </Button>
                            </NextButton>
                        </RowContainer>
                    </Container>
                ) : null}
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
    padding-left: 25px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;
const ButtonRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    @media (${device.xs}) {
        display: block;
    }
`;
const RowBetweenContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const LargeTitle = styled.h2`
    font-size: 18px;
    font-weight: bold;
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
        flex-direction: row;
        justify-content: center;
        margin: 10px;
    }
    @media (max-width: 992px) {
        flex-direction: row;
        justify-content: center;
        margin: 10px;
    }
    margin: 20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    border-radius: 100%;
`;
