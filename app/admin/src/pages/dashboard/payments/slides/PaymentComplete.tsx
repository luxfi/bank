import styled from "styled-components";
import Button from "../../../../components/Button";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import BaseSlide, { StyledForm } from "../../../registration/slides/BaseSlide";
import { setActiveState } from "../../../../features/auth/ViewCarouselSlice";
import { SlideProps } from "../../../registration/helpers/slide-types";
import {
    selectBeneficiaryId,
    selectCurrencyBeneficiaries,
} from "../../../../features/beneficiaries/BeneficiariesListSlice";
import SelectCurrency from "./SelectCurrency";
import {
    deletePaymentAndReload,
    loadPayer,
    resetPayment,
    selectCurrencyInformation,
    selectPayer,
    selectPayerInformation,
    selectPayment,
    selectPaymentFees,
} from "../../../../features/accountview/ViewPaymentSlice";
import { useNavigate } from "react-router-dom";
import { selectAccount } from "../../../../features/accounts/AccountsListSlice";
import { useEffect, useMemo, useState } from "react";
import {
    dateToHuman,
    snakeCaseToHumanCase,
} from "../../../../utils/text-helpers";
import { snakeToWords } from "../../../../utils/functions";
import { BtnRowContainer } from "../../../../components/Containers";
import { selectCurrentUser } from "../../../../features/auth/AuthSlice";

const imgCheck = `${process.env.PUBLIC_URL}/images/currencies/check.svg`;

export default function PaymentComplete({
    goToSlide,
    selectedSlide,
}: SlideProps) {
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(selectCurrentUser);
    const navigate = useNavigate();
    const currency_beneficiaries = useAppSelector(selectCurrencyBeneficiaries);
    const pay_account = useAppSelector(selectAccount);
    //console.log(currency_beneficiaries);
    const selectedBeneficiary = useAppSelector(selectBeneficiaryId);
    const current_beneficiary = currency_beneficiaries.filter(
        (item) => item.id == selectedBeneficiary.uuid
    )[0];
    // dispatch(setActiveState({activeState: 4}));
    const payment = useAppSelector(selectPayment);
    const fees = useAppSelector(selectPaymentFees);
    const payerinfo = useAppSelector(selectPayerInformation);
    const currencyinfo = useAppSelector(selectCurrencyInformation);
    const payer = useAppSelector(selectPayer);
    const gateway = window.localStorage.getItem("gateway");
    const isCustomPayerAvailable = gateway !== "openpayd";

    // useEffect(() => {
    //     if (payment.payer_id) {
    //         dispatch(loadPayer(payment.payer_id));
    //     }
    // }, [payment.payer_id]);

    const statusLabelMap = {
        pending: "Waiting approval",
        done: "Completed",
        expired: "Expired",
        rejected: "Rejected",
    };

    if (!current_beneficiary) return <></>;
    return (
        <BaseSlide key="currency-quote" title="empty" sort="payment">
            <Container>
                <>
                    <RowContainer>
                        <BorderLabel>
                            <NextButton>
                                <img
                                    src={imgCheck}
                                    width="30px"
                                    height="30px"
                                    alt="pending"
                                />
                            </NextButton>
                            <LargeTitle>
                                Great, payment of {payment?.amount}{" "}
                                {payment?.currency} to{" "}
                                {current_beneficiary
                                    ? current_beneficiary.name
                                    : ""}{" "}
                                was successfully{" "}
                                <span style={{ color: "green" }}>
                                    {payment.status_approval === "pending"
                                        ? "submitted for approval"
                                        : "created"}
                                    !
                                </span>
                            </LargeTitle>
                        </BorderLabel>
                    </RowContainer>
                </>
                <>
                    <RowBetweenContainer>
                        <LargeTitle>Receipt</LargeTitle>
                    </RowBetweenContainer>
                    <RowContainer>
                        <TableContainer style={{ width: "100%" }}>
                            <tbody style={{ width: "100%" }}>
                                <tr>
                                    <th>Amount:</th>
                                    <td>
                                        {payment?.amount} (
                                        <b>{payment?.currency}</b>)
                                    </td>
                                </tr>
                                {!!payment.fee_amount && (
                                    <tr>
                                        <th>Fee:</th>
                                        <td>
                                            {!fees
                                                ? payment?.fee_amount
                                                : Number(
                                                      fees[
                                                          payerinfo.payment_type
                                                      ]?.fee_amount || "0"
                                                  ).toFixed(2)}{" "}
                                            (<b>{payment?.currency}</b>)
                                        </td>
                                    </tr>
                                )}
                                <tr>
                                    <th>Payment Type:</th>
                                    <td>
                                        {snakeToWords(payment?.payment_type)}
                                    </td>
                                </tr>
                                {!!payment?.charge_type && (
                                    <tr>
                                        <th>Charge Type:</th>
                                        <td>{payment?.charge_type}</td>
                                    </tr>
                                )}
                                <tr>
                                    <th>Payment Date:</th>
                                    <td>
                                        {payment.payment_date
                                            ? dateToHuman(payment.payment_date)
                                            : ""}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Payment Reason:</th>
                                    <td>{payment?.reason}</td>
                                </tr>
                                <tr>
                                    <th>Payment Reference:</th>
                                    <td>{payment?.reference}</td>
                                </tr>
                                <tr>
                                    <th>Payment Status:</th>
                                    <td>
                                        {
                                            statusLabelMap[
                                                payment?.status_approval
                                            ]
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <th>Reference Number:</th>
                                    <td>{payment?.short_reference}</td>
                                </tr>
                            </tbody>
                        </TableContainer>
                    </RowContainer>

                    {isCustomPayerAvailable && (
                        <>
                            <RowBetweenContainer>
                                <LargeTitle>Payer</LargeTitle>
                            </RowBetweenContainer>
                            <RowContainer>
                                {payment?.payer?.companyName ? (
                                    <>
                                        <TableContainer
                                            style={{ width: "100%" }}
                                        >
                                            <tbody style={{ width: "100%" }}>
                                                <tr>
                                                    <th>Company Name:</th>
                                                    <td>
                                                        {payment?.payer
                                                            .companyName || ""}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <th>Country:</th>
                                                    <td>
                                                        {payment?.payer
                                                            .countryOfRegistration ||
                                                            ""}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </TableContainer>
                                    </>
                                ) : (
                                    <>
                                        <TableContainer
                                            style={{ width: "100%" }}
                                        >
                                            <tbody style={{ width: "100%" }}>
                                                {payment.payer?.firstname && (
                                                    <tr>
                                                        <th>First Name:</th>
                                                        <td>
                                                            {
                                                                payment.payer
                                                                    .firstname
                                                            }
                                                        </td>
                                                    </tr>
                                                )}
                                                {payment.payer?.lastname && (
                                                    <tr>
                                                        <th>Last Name:</th>
                                                        <td>
                                                            {
                                                                payment.payer
                                                                    .lastname
                                                            }
                                                        </td>
                                                    </tr>
                                                )}
                                                {payment.payer?.country && (
                                                    <tr>
                                                        <th>Country:</th>
                                                        <td>
                                                            {
                                                                payment.payer
                                                                    .country
                                                            }
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </TableContainer>
                                    </>
                                )}
                            </RowContainer>
                        </>
                    )}
                    <RowBetweenContainer>
                        <LargeTitle>Beneficiary Details</LargeTitle>
                    </RowBetweenContainer>
                    <RowContainer>
                        <TableContainer style={{ width: "100%" }}>
                            <tbody style={{ width: "100%" }}>
                                <tr>
                                    <th>Beneficiary Name</th>
                                    <td>
                                        {current_beneficiary
                                            ? current_beneficiary.name
                                            : ""}
                                    </td>
                                </tr>
                            </tbody>
                        </TableContainer>
                    </RowContainer>
                </>
                <>
                    <RowBetweenContainer>
                        <LargeTitle>Beneficiary Bank Details</LargeTitle>
                    </RowBetweenContainer>
                    <RowContainer>
                        <TableContainer style={{ width: "100%" }}>
                            <tbody style={{ width: "100%" }}>
                                <tr>
                                    <th>Entity Type:</th>
                                    <td>
                                        {current_beneficiary
                                            ? current_beneficiary.beneficiary_entity_type
                                            : ""}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Company Name:</th>
                                    <td>
                                        {current_beneficiary
                                            ? current_beneficiary.beneficiary_company_name
                                            : ""}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Beneficiary Address:</th>
                                    <td>
                                        {current_beneficiary
                                            ? current_beneficiary
                                                  .beneficiary_address[0]
                                            : ""}
                                    </td>
                                </tr>
                                <tr>
                                    <th>City:</th>
                                    <td>
                                        {current_beneficiary
                                            ? current_beneficiary.beneficiary_city
                                            : ""}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Beneficiary Country:</th>
                                    <td>
                                        {current_beneficiary
                                            ? current_beneficiary.beneficiary_country
                                            : ""}
                                    </td>
                                </tr>
                                {!!current_beneficiary.account_number && (
                                    <tr>
                                        <th>Account Number:</th>
                                        <td>
                                            {current_beneficiary
                                                ? current_beneficiary.account_number
                                                : ""}
                                        </td>
                                    </tr>
                                )}
                                {!!current_beneficiary.routing_code_value_1 && (
                                    <tr>
                                        <th>Sort Code:</th>
                                        <td>
                                            {" "}
                                            {current_beneficiary
                                                ? current_beneficiary.routing_code_value_1
                                                : ""}
                                        </td>
                                    </tr>
                                )}
                                {!!current_beneficiary.bic_swift && (
                                    <tr>
                                        <th>BIC/SWIFT Code:</th>
                                        <td>{current_beneficiary.bic_swift}</td>
                                    </tr>
                                )}
                                {!!current_beneficiary.iban && (
                                    <tr>
                                        <th>IBAN:</th>
                                        <td>{current_beneficiary.iban}</td>
                                    </tr>
                                )}
                            </tbody>
                        </TableContainer>
                    </RowContainer>
                </>

                <BtnRowContainer>
                    <NextButton>
                        {(payment.status == "ready_to_send" ||
                            payment.status == "PENDING") && (
                            <Button
                                danger
                                style={{
                                    borderRadius: "5px",
                                    padding: "5px 20px",
                                }}
                                onClick={async (e) => {
                                    e.preventDefault();
                                    await deletePaymentAndReload(
                                        String(
                                            payment.related_entity_id ||
                                                payment.id
                                        )
                                    )(dispatch);
                                    dispatch(
                                        setActiveState({ activeState: 0 })
                                    );
                                    goToSlide(SelectCurrency);
                                    navigate(
                                        "/dashboard/balances/" +
                                            payment.currency +
                                            "/transactions/" +
                                            payment.payer_id +
                                            "?deleted_payment_id=" +
                                            payment.id
                                    );
                                }}
                            >
                                Cancel
                            </Button>
                        )}
                        <Button
                            primary
                            style={{
                                borderRadius: "5px",
                                padding: "5px 20px",
                                // margin: "10px 10px 10px 0",
                            }}
                            onClick={(e) => {
                                dispatch(resetPayment({}));
                                e.preventDefault();
                                dispatch(setActiveState({ activeState: 0 }));
                                goToSlide(SelectCurrency);
                            }}
                        >
                            Make Another Payment
                        </Button>
                    </NextButton>
                    <NextButton>
                        <Button
                            primary
                            style={{
                                padding: "5px 20px",
                                // margin: "10px 10px",
                                borderRadius: "5px",
                            }}
                            onClick={(e) => {
                                dispatch(resetPayment({}));
                                e.preventDefault();
                                dispatch(setActiveState({ activeState: 0 }));
                                navigate("/dashboard");
                            }}
                        >
                            View Dashboard
                        </Button>
                    </NextButton>
                </BtnRowContainer>
            </Container>
        </BaseSlide>
    );
}

const BorderLabel = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    border: 1px solid ${(props) => props.theme.colors.secondary};
    padding: 15px;
    border-radius: 5px;
    align-items: center;
`;
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
    justify-content: flex-start;
    margin: 10px;
    align-items: center;
`;
const PaddingContainer = styled.div`
    padding-left: 20px;
    color: ${(props) => props.theme.colors.detail};
    margin-bottom: 5px;
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
    margin-left: 20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    border-radius: 100%;
    align-items: center;
`;
const LargeTitle = styled.h2`
    padding: 10px auto;
    margin: 0;
    margin-left: 20px;
`;
const RowBetweenContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;
const ItemContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    flex-basis: 100vw;
    padding: 0px 20px 0px 30px;
    text-align: left;
`;
const TableContainer = styled.table`
    @media (min-width: 1023px) {
        margin-left: 26px;
    }
    margin-top: 10px;
    margin-bottom: 10px;
    tr {
        flex: 1;
        width: 100%;
        text-align: left;
        th {
            width: 50%;
        }
        td {
            width: 50%;
        }
    }
`;
