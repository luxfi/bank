import { Formik, FormikHelpers, useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import Button from "../../../../components/Button";
import InputField from "../../../../components/InputField";
import SelectInputField from "../../../../components/SelectInputField";
import { paymentCurrencyInfoSchema } from "../../../../features/accountview/model/paymentCurrencyInforSchema";
import { setActiveState } from "../../../../features/auth/ViewCarouselSlice";
import { SlideProps } from "../../../registration/helpers/slide-types";
import BaseSlide, { StyledForm } from "../../../registration/slides/BaseSlide";
import { FormRow } from "../../components/FormRow";
import { HalfWidth } from "../../components/HalfWidth";
import PaymentPayer from "./PaymentPayer";

import Decimal from "decimal.js";
import SearchBox from "../../../../components/SearchBox";
import {
    loadActiveAccount,
    loadConversion,
    selectConversion,
} from "../../../../features/accounts/AccountsListSlice";
import {
    Conversion,
    PaymentResponse,
} from "../../../../features/accounts/model/account-response";
import {
    getFees,
    loadBeneficiary,
    loadPayer,
    loadPayment,
    resetPayment,
    selectBeneficiary,
    selectCurrencyInformation,
    selectPayerInformation,
    selectPayment,
    selectPaymentFees,
    setCurrencyInfomation,
} from "../../../../features/accountview/ViewPaymentSlice";
import {
    loadBalancesList,
    loadCurrenciesList,
    selectBalances,
    selectCurrencies,
} from "../../../../features/balances/BalancesListSlice";
import {
    loadCurrencyBeneficiariesList,
    selectBeneficiaryId,
    selectCurrencyBeneficiaries,
    setBeneficiary,
} from "../../../../features/beneficiaries/BeneficiariesListSlice";
import { snakeToWords } from "../../../../utils/functions";
import { useQuery } from "../../../../utils/use-query";
interface FormikInterface {
    amount: string;
}
const LinkedPaymentDescription = ({
    conversion,
}: {
    conversion: Conversion;
}) => {
    const query = useQuery();
    const conversionId = query.get("conversion_id");
    const { values, setFieldValue, handleBlur } =
        useFormikContext<FormikInterface>();
    const [remainingAmount, setRemainingAmount] = useState("0.00");
    React.useEffect(() => {
        if (conversionId && conversion.client_buy_amount) {
            setFieldValue("amount", conversion.client_buy_amount);
        }
    }, [conversion.client_buy_amount]);
    React.useEffect(() => {
        if (conversionId) {
            if (
                Number(values.amount) >=
                    Number(conversion?.client_buy_amount) ||
                Number(values.amount) < 0
            ) {
                setRemainingAmount("0.00");
            } else if (conversion) {
                setRemainingAmount(
                    String(
                        Decimal.sum(
                            conversion?.client_buy_amount || "0.00",
                            -values.amount || 0.0
                        ).toFixed(2)
                    )
                );
            }
        }
    }, [values, conversion]);
    if (!conversionId || !conversion) return <></>;
    return (
        <>
            <RowContainer>
                {remainingAmount} funds without a linked payment from conversion{" "}
                {conversion.short_reference} after this payment
            </RowContainer>
        </>
    );
};
const ErroredPayment = ({ payment }: { payment: PaymentResponse }) => {
    const payerinfo = useAppSelector(selectPayerInformation);
    const currencyinfo = useAppSelector(selectCurrencyInformation);
    const { setErrors } = useFormikContext<FormikInterface>();
    React.useEffect(() => {
        if (payment && payment.error) {
            let error = payment.error?.errorCode;
            if (
                payment.error.errorCode ==
                "RESTRICTION_INSUFFICIENT_BALANCE_EXCEPTION"
            ) {
                error = "Insufficient funds for sending the transaction.";
                let amount = Number(currencyinfo.amount);
                if (payerinfo?.payment_type == "CHAPS") {
                    amount += 20.0;
                }
                if (payerinfo?.payment_type == "FASTER_PAYMENTS") {
                    amount += 0.6;
                }
                if (payerinfo?.payment_type == "SWIFT") {
                    amount += 20.0;
                }
                if (payerinfo?.payment_type == "ACH") {
                    amount += 2.0;
                }
                if (payerinfo?.payment_type == "SEPA") {
                    amount += 0.6;
                }
                if (payerinfo?.payment_type == "SEPA_INSTANT") {
                    amount += 0.6;
                }
                if (payerinfo?.payment_type == "TARGET2") {
                    amount += 0.0;
                }
                error += ` Please make sure you have at least ${amount.toFixed(
                    2
                )} ${currencyinfo.currency} in your account.`;
            }
            if (error) {
                setErrors({ amount: error });
            }
        }
    }, [payment.error, payerinfo, currencyinfo]);
    return <></>;
};
export default function SelectCurrency({ goToSlide }: SlideProps) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const query = useQuery();
    const gateway = window.localStorage.getItem("gateway");
    const verifyBalance = gateway === "openpayd";
    //const fixedSellOnly = gateway === 'openpayd';
    //const allowsDateChange = gateway !== 'openpayd';
    const allowsPayerChange = gateway !== "openpayd";
    const allowsLinkingPayments = gateway !== "openpayd";

    const conversionId = allowsLinkingPayments
        ? query.get("conversion_id")
        : "";
    const paymentId = allowsLinkingPayments ? query.get("payment_id") : "";
    const beneficiaryId = query.get("beneficiary");
    const conversion = useAppSelector(selectConversion);
    const payment: PaymentResponse = useAppSelector(selectPayment);
    const beneficiary = useAppSelector(selectBeneficiary);
    const fees = useAppSelector(selectPaymentFees);
    const feesText = fees
        ? Object.keys(fees)
              .sort((a, b) => a.localeCompare(b))
              .map((payment_type: string, index) => {
                  const payment_cost = fees[payment_type];
                  return (
                      <>
                          {`${snakeToWords(payment_type)}: ${
                              payment_cost.fee_amount
                          } ${payment_cost.fee_currency}.`}
                          <br />
                      </>
                  );
              })
        : "";
    const balances = useAppSelector(selectBalances);
    const available_currencies = useAppSelector(selectCurrencies);

    useEffect(() => {
        dispatch(loadBalancesList());
        dispatch(loadCurrenciesList());
    }, []);

    React.useEffect(() => {
        if (beneficiaryId) {
            dispatch(
                loadBeneficiary({
                    uuid: beneficiaryId,
                })
            );
        }
    }, [beneficiaryId]);
    React.useEffect(() => {
        if (conversionId) {
            dispatch(
                loadConversion({
                    uuid: conversionId,
                })
            );
        }
    }, [conversionId]);
    React.useEffect(() => {
        if (paymentId) {
            dispatch(
                loadPayment({
                    uuid: paymentId,
                })
            );
        } else {
            dispatch(resetPayment({}));
        }
    }, [paymentId]);
    useEffect(() => {
        if (payment.currency) {
            setCurrencyValue(payment.currency);
        }
        if (payment.beneficiary_id) {
            dispatch(loadBeneficiary({ uuid: payment.beneficiary_id }));
        }
        if (payment.payer_id) {
            dispatch(loadPayer(String(payment.payer_id)));
        }
    }, [payment.currency, payment.payer_id, payment.beneficiary_id]);
    useEffect(() => {
        if (beneficiary.id) {
            dispatch(
                setBeneficiary({
                    uuid: beneficiary.id,
                })
            );
            showBeneficiary();
        }
    }, [beneficiary.id]);
    const [isBeneficiaryVisible, setIsBeneficiaryVisible] = useState(false);
    // const [selectBeneficiaryValue, setSelectBeneficiaryValue] = useState("");
    const selectBeneficiaryValue = useAppSelector(selectBeneficiaryId);
    const { selCurrency } = useParams();
    const [selectCurrencyValue, setCurrencyValue] = useState(selCurrency);
    const initialValues = {
        currency: payment?.currency || "GBP",
        amount: payment?.amount || "",
        beneficiary: "",
    };
    const showBeneficiary = () => {
        setIsBeneficiaryVisible(true);
    };
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        window.addEventListener("resize", () => setWidth(window.innerWidth));
        if (selectCurrencyValue)
            dispatch(
                loadCurrencyBeneficiariesList(
                    selectCurrencyValue.substring(0, 3)
                )
            );
        dispatch(loadActiveAccount());
    }, []);
    //  const active_id = useAppSelector(selectActiveAccount);
    //  console.log(currency);
    const currency_beneficiaries = useAppSelector(selectCurrencyBeneficiaries);
    let beneficiaris: Map<string, string> = new Map();
    beneficiaris.set("", "Select Existing Beneficiaries");

    currency_beneficiaries.map((item) => beneficiaris.set(item.id, item.name));

    const selectBeneficiaryItem =
        selectBeneficiaryValue.uuid != ""
            ? currency_beneficiaries.filter(
                  (item) => item.id == selectBeneficiaryValue.uuid
              )[0]
            : null;
    const [currentAmount, setCurrentAmount] = useState("1.00");
    React.useEffect(() => {
        const currentBalance = balances.filter(
            (b) => b.id == selectCurrencyValue
        )[0];
        if (verifyBalance && currentBalance) {
            if (selectBeneficiaryValue.uuid == "") return;
            dispatch(
                getFees({
                    currency: currentBalance.currency,
                    account_id: currentBalance.account_id,
                    amount: currentAmount,
                    beneficiary_id: selectBeneficiaryValue.uuid,
                    payment_types: selectBeneficiaryItem?.payment_types || [],
                })
            );
        }
    }, [selectBeneficiaryItem]);
    const addNewBeneficiary = () => {
        navigate(`/dashboard/beneficiaries/new`);
    };
    let basic_currencies: Map<string, string> = new Map();
    basic_currencies.set("", "Select Existing Currencies");
    balances.forEach((balance, i, balances) => {
        available_currencies.every((item, n, available_currencies) => {
            if (
                item.code == balance.currency &&
                item.can_sell &&
                item.online_trading
            ) {
                basic_currencies.set(
                    balance.id,
                    `${item.name} (${item.code}) - ${balance.amount}`
                );
                return false;
            }
            return true;
        });
    });

    return (
        <BaseSlide key="currency-slide" title="empty" sort="payment">
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={paymentCurrencyInfoSchema}
                onSubmit={async (values, formikHelpers: FormikHelpers<any>) => {
                    const currentBalance = balances.filter(
                        (b) => b.id == selectCurrencyValue
                    )[0];
                    if (verifyBalance) {
                        let minFee = 0;
                        if (fees) {
                            Object.keys(fees).map((fee) => {
                                if (
                                    !minFee ||
                                    Number(fees[fee].fee_amount) < minFee
                                ) {
                                    minFee = Number(fees[fee].fee_amount);
                                }
                            });
                        }
                        if (
                            new Decimal(currentBalance.amount).comparedTo(
                                Decimal.sum(values.amount, minFee)
                            ) == -1
                        ) {
                            formikHelpers.setTouched({ amount: true }, false);
                            formikHelpers.setErrors({
                                amount: `Not enough money in the ${
                                    currentBalance.currency
                                } account (min. fee is ${Number(minFee).toFixed(
                                    2
                                )} ${currentBalance.currency})`,
                            });
                            return;
                        }
                    }
                    if (
                        selectBeneficiaryValue.uuid == "" ||
                        !selectBeneficiaryValue.uuid
                    )
                        return;
                    await dispatch(
                        setCurrencyInfomation({
                            currency: currentBalance.currency,
                            account_id: currentBalance.account_id,
                            amount: values.amount,
                            beneficiary: selectBeneficiaryValue.uuid,
                        })
                    );
                    dispatch(setActiveState({ activeState: 1 }));
                    goToSlide(PaymentPayer);
                }}
            >
                {({ values, setFieldValue }) => (
                    <StyledForm>
                        <Container>
                            <FormRow style={{ paddingLeft: "5px" }}>
                                <HalfWidth>
                                    <SearchBox
                                        name="currency"
                                        labeltext="Currency"
                                        disabled={!!conversionId}
                                        value={
                                            basic_currencies.get(
                                                selectCurrencyValue || ""
                                            ) || ""
                                        }
                                        isSearchable={true}
                                        options={basic_currencies}
                                        isMulti={true}
                                        placeHolder="Select Currency..."
                                        callFunc={async (currency: any) => {
                                            setFieldValue("currency", currency);
                                            setCurrencyValue(currency);
                                            setIsBeneficiaryVisible(false);
                                            // setSelectBeneficiaryValue('');
                                            await dispatch(
                                                setBeneficiary({ uuid: "" })
                                            );
                                            dispatch(
                                                loadCurrencyBeneficiariesList(
                                                    currency.substring(0, 3)
                                                )
                                            );
                                        }}
                                    />
                                </HalfWidth>
                            </FormRow>
                            <FormRow>
                                <HalfWidth>
                                    <InputField
                                        labeltext="Amount"
                                        name="amount"
                                        placeholder="0.00"
                                        onBlur={(
                                            e: React.FocusEvent<HTMLInputElement>
                                        ) => {
                                            const input =
                                                e.target.value.replace(
                                                    /[^0-9.]/g,
                                                    ""
                                                ) || 0;
                                            setFieldValue(
                                                "amount",
                                                Number(input).toFixed(2)
                                            );
                                            setCurrentAmount(String(input));
                                        }}
                                    />
                                    {allowsLinkingPayments && (
                                        <LinkedPaymentDescription
                                            conversion={conversion}
                                        />
                                    )}
                                    {payment && payment.error && (
                                        <ErroredPayment payment={payment} />
                                    )}
                                </HalfWidth>
                            </FormRow>
                            {width < 768 ? (
                                <>
                                    <RowContainer>
                                        <HalfWidth>
                                            <SelectInputField
                                                labeltext="Beneficiary Name"
                                                name="beneficiary"
                                                options={beneficiaris}
                                                value={values.beneficiary}
                                                onChange={async (
                                                    e: React.ChangeEvent<HTMLSelectElement>
                                                ) => {
                                                    setFieldValue(
                                                        "beneficiary",
                                                        e.target.value
                                                    );
                                                    // console.log('val', e.target.value);
                                                    setIsBeneficiaryVisible(
                                                        false
                                                    );
                                                    // setSelectBeneficiaryValue(e.target.value);
                                                    await dispatch(
                                                        setBeneficiary({
                                                            uuid: e.target
                                                                .value,
                                                        })
                                                    );
                                                    showBeneficiary();
                                                }}
                                            />
                                        </HalfWidth>
                                    </RowContainer>
                                    <RowContainer>
                                        <HalfWidth>
                                            <Button
                                                sky
                                                style={{
                                                    padding: "5px 10px",
                                                    borderRadius: "10px",
                                                }}
                                                onClick={addNewBeneficiary}
                                            >
                                                Add New Beneficiary
                                            </Button>
                                        </HalfWidth>
                                    </RowContainer>
                                </>
                            ) : (
                                <RowContainer>
                                    <HalfWidth>
                                        <SelectInputField
                                            labeltext="Beneficiary Name"
                                            name="beneficiary"
                                            options={beneficiaris}
                                            value={values.beneficiary}
                                            onChange={async (
                                                e: React.ChangeEvent<HTMLSelectElement>
                                            ) => {
                                                setFieldValue(
                                                    "beneficiary",
                                                    e.target.value
                                                );
                                                // console.log('val', e.target.value);
                                                setIsBeneficiaryVisible(false);
                                                // setSelectBeneficiaryValue(e.target.value);
                                                await dispatch(
                                                    setBeneficiary({
                                                        uuid: e.target.value,
                                                    })
                                                );
                                                showBeneficiary();
                                            }}
                                        />
                                    </HalfWidth>
                                    <NextButton>
                                        <Button
                                            sky
                                            style={{
                                                padding: "5px 10px",
                                                borderRadius: "5px",
                                            }}
                                            onClick={addNewBeneficiary}
                                        >
                                            Add New Beneficiary
                                        </Button>
                                    </NextButton>
                                </RowContainer>
                            )}
                            {isBeneficiaryVisible ? (
                                <RowContainer
                                    style={{
                                        backgroundColor: "#F2F2F2",
                                        alignItems: "flex-start",
                                        padding: "5px 10px",
                                    }}
                                >
                                    <NextButton>
                                        Bank Account Holder Name:
                                        <br />
                                        Bank Name:
                                        <br />
                                        {!!selectBeneficiaryItem
                                            ?.bank_address[0] && (
                                            <>
                                                Bank Address:
                                                <br />
                                            </>
                                        )}
                                        Bank Account Country:
                                        <br />
                                        {feesText.length ? "Fees:" : ""}
                                    </NextButton>
                                    <NextButton>
                                        {
                                            selectBeneficiaryItem?.bank_account_holder_name
                                        }
                                        <br />
                                        {selectBeneficiaryItem?.bank_name}
                                        <br />
                                        {!!selectBeneficiaryItem
                                            ?.bank_address[0] && (
                                            <>
                                                {
                                                    selectBeneficiaryItem?.bank_address
                                                }
                                                <br />
                                            </>
                                        )}
                                        {selectBeneficiaryItem?.bank_country}
                                        <br />
                                        {feesText.length ? feesText : ""}
                                    </NextButton>
                                </RowContainer>
                            ) : null}
                            {width < 768 ? (
                                <>
                                    <RowContainer>
                                        <HalfWidth>
                                            <Button
                                                danger
                                                style={{
                                                    padding: "5px 20px",
                                                    // margin: "10px 10px 10px 0",
                                                    borderRadius: "10px",
                                                }}
                                                onClick={() =>
                                                    navigate(
                                                        "/dashboard/balances"
                                                    )
                                                }
                                            >
                                                Cancel
                                            </Button>
                                        </HalfWidth>
                                    </RowContainer>
                                    <RowContainer>
                                        <HalfWidth>
                                            <Button
                                                sky
                                                style={{
                                                    padding: "5px 20px",
                                                    // margin: "10px 10px",
                                                    borderRadius: "10px",
                                                }}
                                                type="submit"
                                            >
                                                {allowsPayerChange
                                                    ? "Select a Date"
                                                    : "Select a Date"}
                                            </Button>
                                        </HalfWidth>
                                    </RowContainer>
                                </>
                            ) : (
                                <RowContainer style={{ paddingLeft: "25px" }}>
                                    <NextButton>
                                        <Button
                                            danger
                                            style={{
                                                padding: "5px 20px",
                                                margin: "10px 10px 10px 0",
                                                borderRadius: "5px",
                                            }}
                                            onClick={() =>
                                                navigate("/dashboard")
                                            }
                                        >
                                            Cancel
                                        </Button>
                                    </NextButton>
                                    <NextButton>
                                        <Button
                                            sky
                                            style={{
                                                padding: "5px 20px",
                                                margin: "10px 10px",
                                                borderRadius: "5px",
                                            }}
                                            type="submit"
                                        >
                                            {allowsPayerChange
                                                ? "Select a Date"
                                                : "Select a Date"}
                                        </Button>
                                    </NextButton>
                                </RowContainer>
                            )}
                        </Container>
                    </StyledForm>
                )}
            </Formik>
        </BaseSlide>
    );
}

const Container = styled.div`
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    /* flex-basis: 100vw; */
    padding: 10px 10px 10px 0;
`;
const RowContainer = styled.div`
    @media (max-width: 992px) {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin: 10px;
        align-items: center;
    }
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
`;

const NextButton = styled.div`
    @media (max-width: 768px) {
        flex-direction: row;
        justify-content: center;
        margin: 0;
        align-items: center;
    }
    @media (max-width: 992px) {
        flex-direction: row;
        justify-content: center;
        margin: 0;
        align-items: center;
    }
    /* margin-top: 20px; */
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    border-radius: 100%;
    text-align: left;
`;
