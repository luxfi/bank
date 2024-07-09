import { useNavigate } from "react-router-dom";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Button from "../../../../components/Button";
import BaseSlide from "../../../registration/slides/BaseSlide";
import { SlideProps } from "../../../registration/helpers/slide-types";
import PaymentPayer from "./PaymentPayer";
import { HalfWidth } from "../../components/HalfWidth";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { setActiveState } from "../../../../features/auth/ViewCarouselSlice";
import {
    loadPayer,
    selectCurrencyInformation,
    selectPayerInformation,
    createPayment,
    validatePaymentSlice,
    selectPayment,
    editPayment,
    resetPayment,
    selectPaymentFees,
} from "../../../../features/accountview/ViewPaymentSlice";
import {
    selectBeneficiaryId,
    selectCurrencyBeneficiaries,
} from "../../../../features/beneficiaries/BeneficiariesListSlice";
import { selectAccount } from "../../../../features/accounts/AccountsListSlice";
import PaymentComplete from "./PaymentComplete";
import { useQuery } from "../../../../utils/use-query";
import { dateToHuman } from "../../../../utils/text-helpers";
import { loadBalancesList } from "../../../../features/balances/BalancesListSlice";
import SelectCurrency from "./SelectCurrency";
import { snakeToWords } from "../../../../utils/functions";
import { BtnRowContainer } from "../../../../components/Containers";
import { PaymentResponse } from "../../../../features/accounts/model/account-response";
import { openNotification } from "../../../../components/Notifications";
export default function PaymentReview({ goToSlide }: SlideProps) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const payerinfo = useAppSelector(selectPayerInformation);
    const currencyinfo = useAppSelector(selectCurrencyInformation);
    const currency_beneficiaries = useAppSelector(selectCurrencyBeneficiaries);
    const selectedBeneficiary = useAppSelector(selectBeneficiaryId);
    const current_beneficiary = currency_beneficiaries.filter(
        (item) => item.id == selectedBeneficiary.uuid
    )[0];
    const fees = useAppSelector(selectPaymentFees);
    const payment = useAppSelector(selectPayment);
    const account = useAppSelector(selectAccount);
    const query = useQuery();
    const conversionId = query.get("conversion_id");
    const ele = document.getElementById("payment");
    const validate = async (e: any) => {
        e.preventDefault();
        const paymentData =
            payerinfo.pay_type === "false"
                ? {
                      id: payment?.id || "",
                      currency: currencyinfo.currency,
                      account_id: currencyinfo.account_id,
                      beneficiary_id: currencyinfo.beneficiary,
                      amount: currencyinfo.amount,
                      reason: payerinfo.pay_reason,
                      reference: payerinfo.pay_reference,
                      purpose_code: payerinfo.purpose_code,
                      payment_type: payerinfo.payment_type,
                      payment_date: payerinfo.payment_date,
                      conversion_id: conversionId || "",
                      payer_entity_type:
                          payerinfo.payer_type == "true"
                              ? "company"
                              : "individual",
                      payer_company_name:
                          payerinfo.payer_type == "true"
                              ? payerinfo.payer_company_name
                              : "",
                      payer_first_name:
                          payerinfo.payer_type == "false"
                              ? payerinfo.payer_first_name
                              : "",
                      payer_last_name:
                          payerinfo.payer_type == "false"
                              ? payerinfo.payer_last_name
                              : "",
                      payer_city:
                          payerinfo.payer_type != undefined
                              ? payerinfo.payer_city
                              : "",
                      payer_address:
                          payerinfo.payer_type != undefined
                              ? payerinfo.payer_address
                              : "",
                      payer_country:
                          payerinfo.payer_type != undefined
                              ? payerinfo.payer_country
                              : "",
                      payer_date_of_birth:
                          payerinfo.payer_type == "false"
                              ? payerinfo.payer_birth
                              : "",
                  }
                : {
                      id: payment?.id || "",
                      currency: currencyinfo.currency,
                      account_id: currencyinfo.account_id,
                      beneficiary_id: currencyinfo.beneficiary,
                      amount: currencyinfo.amount,
                      reason: payerinfo.pay_reason,
                      reference: payerinfo.pay_reference,
                      purpose_code: payerinfo.purpose_code,
                      payment_type: payerinfo.payment_type,
                      payment_date: payerinfo.payment_date,
                      conversion_id: conversionId || "",
                  };
        ele?.setAttribute("disabled", "true");
        await dispatch(validatePaymentSlice(paymentData));
        await dispatch(setActiveState({ activeState: 3 }));
        //FIXME: return error if validation failed;
        // console.log('currency info**************', currencyinfo,' ', payerinfo.pay_reason, ' ', payerinfo.pay_reference);
        try {
            const paymentFromServer: PaymentResponse = !paymentData.id
                ? await dispatch(createPayment(paymentData)).unwrap()
                : await dispatch(editPayment(paymentData)).unwrap();
            if (paymentFromServer?.error) {
                openNotification(
                    "Error creating payment",
                    "We were unable to create your payment. Please try again later."
                );
            }
            if (paymentFromServer && !paymentFromServer.error) {
                await dispatch(loadBalancesList());
                await dispatch(setActiveState({ activeState: 4 }));
                goToSlide(PaymentComplete);
            } else {
                await dispatch(setActiveState({ activeState: 0 }));
                goToSlide(SelectCurrency);
            }
        } catch (error) {
            openNotification(
                "Error creating payment",
                "We were unable to create your payment. Please try again later."
            );
            await dispatch(setActiveState({ activeState: 0 }));
            goToSlide(SelectCurrency);
        }

        ele?.removeAttribute("disabled");
    };
    return (
        <BaseSlide key="reviewer-slide" title="empty" sort="payment">
            {/* {breadcrumbs.map(({ breadcrumb, match }, index) => (
                <div className="bc" >
                    <Link to={match.url || ""}>
                        {breadcrumb}    
                    </Link> 
                    {index <breadcrumb.length -1 && ">"}
                </div>
            ))}   */}
            <Container>
                <>
                    <HalfWidth>
                        <LargeTitle>Receipt</LargeTitle>
                    </HalfWidth>
                    <RowContainer>
                        <TableContainer style={{ width: "100%" }}>
                            <tbody style={{ width: "100%" }}>
                                <tr>
                                    <th>Amount</th>
                                    <td>
                                        {Number(
                                            currencyinfo?.amount || "0"
                                        ).toFixed(2)}{" "}
                                        <b>{currencyinfo?.currency}</b>
                                    </td>
                                </tr>
                                {!!fees &&
                                    !!fees[payerinfo.payment_type] &&
                                    payerinfo.payment_type && (
                                        <tr>
                                            <th>Fee</th>
                                            <td>
                                                {Number(
                                                    fees[payerinfo.payment_type]
                                                        .fee_amount || "0"
                                                ).toFixed(2)}{" "}
                                                <b>{currencyinfo?.currency}</b>
                                            </td>
                                        </tr>
                                    )}
                                <tr>
                                    <th>Payment Type</th>
                                    <td>
                                        {snakeToWords(payerinfo.payment_type)}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Payment Date</th>
                                    <td>
                                        {payerinfo
                                            ? dateToHuman(
                                                  payerinfo.payment_date
                                              )
                                            : ""}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Payment Reason</th>
                                    <td>
                                        {payerinfo ? payerinfo.pay_reason : ""}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Payment Reference</th>
                                    <td>
                                        {payerinfo
                                            ? payerinfo.pay_reference
                                            : ""}
                                    </td>
                                </tr>
                            </tbody>
                        </TableContainer>
                    </RowContainer>
                </>
                {payerinfo.pay_type !== "true" && (
                    <>
                        <HalfWidth>
                            <LargeTitle>Payer</LargeTitle>
                        </HalfWidth>
                        <RowContainer>
                            {payerinfo.payer_type == "true" &&
                            payerinfo.pay_type == "false" ? (
                                <>
                                    <TableContainer style={{ width: "100%" }}>
                                        <tbody style={{ width: "100%" }}>
                                            <tr>
                                                <th>Company Name:</th>
                                                <td>
                                                    {payerinfo
                                                        ? payerinfo.payer_company_name
                                                        : ""}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Address:</th>
                                                <td>
                                                    {payerinfo
                                                        ? payerinfo.payer_address
                                                        : ""}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>City:</th>
                                                <td>
                                                    {payerinfo
                                                        ? payerinfo.payer_address
                                                        : ""}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Country:</th>
                                                <td>
                                                    {payerinfo
                                                        ? payerinfo.payer_country
                                                        : ""}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </TableContainer>
                                </>
                            ) : payerinfo.payer_type == "false" &&
                              payerinfo.pay_type == "false" ? (
                                <>
                                    <TableContainer style={{ width: "100%" }}>
                                        <tbody style={{ width: "100%" }}>
                                            <tr>
                                                <th>First Name:</th>
                                                <td>
                                                    {payerinfo
                                                        ? payerinfo.payer_first_name
                                                        : ""}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Last Name:</th>
                                                <td>
                                                    {payerinfo
                                                        ? payerinfo.payer_last_name
                                                        : ""}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Date Of Birth:</th>
                                                <td>
                                                    {payerinfo.payer_birth
                                                        ? new Date(
                                                              payerinfo.payer_birth
                                                          ).toDateString()
                                                        : ""}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>City:</th>
                                                <td>
                                                    {payerinfo
                                                        ? payerinfo.payer_city
                                                        : ""}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Country:</th>
                                                <td>
                                                    {payerinfo
                                                        ? payerinfo.payer_country
                                                        : ""}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </TableContainer>
                                </>
                            ) : null}
                        </RowContainer>
                    </>
                )}
                <>
                    <HalfWidth>
                        <LargeTitle>Beneficiary Details</LargeTitle>
                    </HalfWidth>
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
                <HalfWidth>
                    <LargeTitle>Beneficiary Bank Details</LargeTitle>
                </HalfWidth>
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
                            {!!current_beneficiary?.beneficiary_company_name && (
                                <tr>
                                    <th>Company Name:</th>
                                    <td>
                                        {current_beneficiary
                                            ? current_beneficiary.beneficiary_company_name
                                            : ""}
                                    </td>
                                </tr>
                            )}
                            {!!current_beneficiary?.beneficiary_address[0] && (
                                <tr>
                                    <th>Beneficiary Address:</th>
                                    <td>
                                        {current_beneficiary
                                            ? current_beneficiary
                                                  .beneficiary_address[0]
                                            : ""}
                                    </td>
                                </tr>
                            )}
                            {!!current_beneficiary?.beneficiary_city && (
                                <tr>
                                    <th>City:</th>
                                    <td>
                                        {current_beneficiary.beneficiary_city}
                                    </td>
                                </tr>
                            )}
                            {!!current_beneficiary?.beneficiary_country && (
                                <tr>
                                    <th>Beneficiary Country:</th>
                                    <td>
                                        {
                                            current_beneficiary.beneficiary_country
                                        }
                                    </td>
                                </tr>
                            )}
                            {!!current_beneficiary?.account_number && (
                                <tr>
                                    <th>Account Number:</th>
                                    <td>
                                        {current_beneficiary.account_number}
                                    </td>
                                </tr>
                            )}
                            {!!current_beneficiary?.routing_code_value_1 && (
                                <tr>
                                    <th>Sort Code:</th>
                                    <td>
                                        {
                                            current_beneficiary.routing_code_value_1
                                        }
                                    </td>
                                </tr>
                            )}
                            {!!current_beneficiary?.bic_swift && (
                                <tr>
                                    <th>BIC/SWIFT Code:</th>
                                    <td>{current_beneficiary.bic_swift}</td>
                                </tr>
                            )}
                            {!!current_beneficiary?.iban && (
                                <tr>
                                    <th>IBAN:</th>
                                    <td>{current_beneficiary.iban}</td>
                                </tr>
                            )}
                        </tbody>
                    </TableContainer>
                </RowContainer>
                <BtnRowContainer style={{ marginTop: "30px" }}>
                    <NextButton>
                        <Button
                            sky
                            style={{
                                borderRadius: "5px",
                                padding: "5px 20px",
                                // margin: "10px 10px 10px 0",
                            }}
                            onClick={(e) => {
                                dispatch(resetPayment({}));
                                e.preventDefault();
                                dispatch(setActiveState({ activeState: 1 }));
                                goToSlide(PaymentPayer);
                            }}
                        >
                            Back
                        </Button>
                    </NextButton>
                    <NextButton>
                        <Button
                            danger
                            style={{
                                padding: "5px 20px",
                                borderRadius: "5px",
                                // margin: "10px 10px 10px 0",
                            }}
                            onClick={() => {
                                dispatch(resetPayment({}));
                                dispatch(setActiveState({ activeState: 0 }));
                                navigate("/dashboard");
                            }}
                        >
                            Cancel
                        </Button>
                    </NextButton>
                    <NextButton>
                        <Button
                            sky
                            style={{
                                padding: "5px 20px",
                                // margin: "10px 10px",
                                borderRadius: "5px",
                            }}
                            onClick={(e) => validate(e)}
                            id="payment"
                        >
                            Complete Payment
                        </Button>
                    </NextButton>
                </BtnRowContainer>
            </Container>
        </BaseSlide>
    );
}

const Container = styled.div`
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    flex-basis: 100vw;
    padding: 10px 20px 10px 0px;
`;
const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin: 10px 10px -20px 10px;
    align-items: center;
`;
const ItemContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    flex-basis: 100vw;
    padding: 0px 20px 0px 30px;
    text-align: left;
`;

const LargeTitle = styled.h2`
    padding: 10px auto;
    margin-left: 10px;
    text-align: left;
    margin-top: 20px;
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
    text-align: left;
    border-radius: 100%;
    margin-left: 25px;
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
