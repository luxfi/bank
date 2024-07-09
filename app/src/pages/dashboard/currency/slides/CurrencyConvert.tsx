import { Navigate, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../../../../components/Button";
import { HalfWidth } from "../../components/HalfWidth";
import SelectInputField from "../../../../components/SelectInputField";
import { customers } from "../../../../features/beneficiaries/model/currencies";
import { Formik, FormikHelpers } from "formik";
import { FormRow } from "../../components/FormRow";
import InputField from "../../../../components/InputField";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import BaseSlide, { StyledForm } from "../../../registration/slides/BaseSlide";
import { SlideProps } from "../../../registration/helpers/slide-types";
import CurrencyDate from "./CurrencyDate";
import { currencyAmountSchema } from "../../../../features/accountview/model/currencyAmountSchema";
import {
    loadCurrencyQuote,
    quoteFromResponseInitData,
    selectCurrencyApiStatus,
    selectCurrencyQuote,
    setCurrencyAmount,
} from "../../../../features/accountview/ViewCurrencySlice";
import {
    loadBalancesList,
    loadCurrenciesList,
    selectBalances,
    selectCurrencies,
} from "../../../../features/balances/BalancesListSlice";
import { useEffect, useState } from "react";
import { select_quote } from "../../../../features/accountview/ViewCurrencyApi";
import { QuoteFromResponse } from "../../../../features/accountview/model/currencyQuote-response";
import SearchBox from "../../../../components/SearchBox";
import CurrencyQuote from "./CurrencyQuote";
import { Spinner } from "../../../../components/Spinner";

export default function CurrencyConvert({
    goToSlide,
    selectedSlide,
}: SlideProps) {
    const navigate = useNavigate();
    const { selCurrency } = useParams();
    const [selectSellValue, setSellValue] = useState(selCurrency);
    const [selectBuyValue, setBuyValue] = useState(selCurrency);
    const [unavailableCurrency, setUnavailableCurrency] = useState(false);
    const [fixedSideValue, setFixedSideValue] = useState("buy");
    const balances = useAppSelector(selectBalances);
    const avaialble_currencies = useAppSelector(selectCurrencies);
    const status = useAppSelector(selectCurrencyApiStatus);

    const initialValues = {
        sell_currency: selectSellValue ? selectSellValue : "GBP",
        buy_currency: "",
        fixed_side: fixedSideValue,
        amount: "",
    };
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(loadBalancesList());
        dispatch(loadCurrenciesList());
    }, []);
    const quotePreview = useAppSelector(selectCurrencyQuote);
    useEffect(() => {
        if (
            !quotePreview &&
            selectSellValue &&
            selectBuyValue &&
            selectSellValue != selectBuyValue
        ) {
            setUnavailableCurrency(true);
        } else {
            setUnavailableCurrency(false);
        }
    }, [quotePreview, selectSellValue, selectBuyValue]);
    useEffect(() => {
        const sell_currency = (
            selectSellValue ? selectSellValue : initialValues.sell_currency
        ).substring(0, 3);
        const buy_currency = (
            selectBuyValue ? selectBuyValue : initialValues.buy_currency
        ).substring(0, 3);
        if (sell_currency == buy_currency) return;
        dispatch(
            loadCurrencyQuote({
                conversion_date: "",
                amount: "10.00",
                sell_currency: sell_currency,
                buy_currency: buy_currency,
                fixed_side: fixedSideValue,
                sell_account_id: selectSellValue,
                buy_account_id: selectBuyValue,
                term_agreement: true,
            })
        );
    }, [selectBuyValue, selectSellValue, fixedSideValue]);

    let basic_currencies: Map<string, string> = new Map();
    basic_currencies.set("", "Select Existing Currencies");
    const gateway = window.localStorage.getItem("gateway");
    const verifyBalance = gateway === "openpayd";
    const fixedSellOnly = gateway === "openpayd";
    const allowsDateChange = gateway !== "openpayd";
    let currencies: Map<string, string> = new Map();
    currencies.set("", "Select Existing Currencies");

    balances.forEach((balance, i, balances) => {
        avaialble_currencies.every((item, n, avaialble_currencies) => {
            if (
                item.code == balance.currency &&
                item.can_sell &&
                item.online_trading &&
                balance.status !== "PENDING"
            ) {
                if (
                    balance.id !== selectSellValue &&
                    balance.currency !== selectSellValue?.substring(0, 3)
                ) {
                    currencies.set(
                        balance.id,
                        item.name + " (" + item.code + `) - ${balance.amount}`
                    );
                }
                if (verifyBalance) {
                    if (Number(balance.amount) <= 0.0) {
                        return false;
                    }
                }
                basic_currencies.set(
                    balance.id,
                    `${item.name} (${item.code}) - ${balance.amount}`
                );
                return false;
            }
            return true;
        });
    });
    const submitForm = async (
        data: { amount: string; buy_currency: string; fixed_side: string },
        formikHelpers: FormikHelpers<any>
    ) => {
        if (Number(data.amount) > 0 && data.buy_currency !== "") {
            if (fixedSellOnly && data.fixed_side == "buy") {
                //data.amount = String(Number(Number(data.amount) * Number(1 / Number(quotePreview?.client_rate))).toFixed(2));
            }

            const rightHand = Number(
                Number(data.amount) *
                    Number(
                        (quotePreview?.fixed_side == "buy" &&
                            quotePreview?.currency_pair.indexOf(
                                quotePreview.client_sell_currency
                            ) !== 0) ||
                            (quotePreview?.fixed_side == "sell" &&
                                quotePreview?.currency_pair.indexOf(
                                    quotePreview.client_sell_currency
                                ) === 0)
                            ? quotePreview?.client_rate
                            : 1 / (Number(quotePreview?.client_rate) || 1)
                    )
            ).toFixed(2);
            if (verifyBalance) {
                const currentBalance = balances.filter(
                    (b) => b.id == selectSellValue
                )[0];
                if (
                    data.fixed_side == "sell" &&
                    Number(currentBalance?.amount) < Number(data.amount)
                ) {
                    formikHelpers.setTouched({ amount: true }, false);
                    formikHelpers.setErrors({
                        amount: `Not enough money in the ${selectSellValue?.substring(
                            0,
                            3
                        )} account`,
                    });
                    return;
                } else if (
                    data.fixed_side == "buy" &&
                    Number(currentBalance?.amount) < Number(rightHand)
                ) {
                    formikHelpers.setTouched({ amount: true }, false);
                    formikHelpers.setErrors({
                        amount: `Not enough money in the ${selectSellValue?.substring(
                            0,
                            3
                        )} account`,
                    });
                    return;
                }
                if (data.fixed_side == "buy" && Number(data.amount) < 3.0) {
                    formikHelpers.setTouched({ amount: true }, false);
                    formikHelpers.setErrors({
                        amount: `Minimum amount to buy is 3.00 ${selectBuyValue?.substring(
                            0,
                            3
                        )}, please increase the amount you want to buy.`,
                    });
                    return;
                }
                if (data.fixed_side == "sell" && Number(rightHand) < 3.0) {
                    formikHelpers.setTouched({ amount: true }, false);
                    formikHelpers.setErrors({
                        amount: `Minimum amount to buy is 3.00 ${selectBuyValue?.substring(
                            0,
                            3
                        )}, please increase the amount you want to sell.`,
                    });
                    return;
                }
            } else {
                if (data.fixed_side == "buy" && Number(rightHand) < 1.0) {
                    formikHelpers.setTouched({ amount: true }, false);
                    formikHelpers.setErrors({
                        amount: `Minimum amount to sell is 1.00 ${selectSellValue?.substring(
                            0,
                            3
                        )}, please increase the amount you want to buy.`,
                    });
                    return;
                }
            }
            await dispatch(
                setCurrencyAmount({
                    sell_account_id: selectSellValue,
                    buy_account_id: data.buy_currency,
                    sell_currency: selectSellValue
                        ? selectSellValue.substring(0, 3)
                        : initialValues.sell_currency,
                    buy_currency: data.buy_currency.substring(0, 3),
                    amount: data.amount,
                    fixed_side: data.fixed_side,
                })
            );
            goToSlide(allowsDateChange ? CurrencyDate : CurrencyQuote);
            // formikHelpers.setFieldValue("amount", "0.00", false);
        }
    };
    return (
        <BaseSlide key="currency-convert" title="empty" sort="payment">
            <Formik
                initialValues={initialValues}
                validationSchema={currencyAmountSchema}
                onSubmit={submitForm}
            >
                {({ values, errors, setFieldValue, setFieldTouched }) => (
                    <StyledForm>
                        <FormRow>
                            <HalfWidth>
                                <SearchBox
                                    disabled={false}
                                    name="sell_currency"
                                    labeltext="Sell"
                                    value={
                                        basic_currencies.get(
                                            selectSellValue || ""
                                        ) || ""
                                    }
                                    isSearchable={true}
                                    options={basic_currencies}
                                    isMulti={true}
                                    placeHolder="Select Sell Currency..."
                                    callFunc={async (currency: any) => {
                                        setSellValue(currency);
                                        setFieldValue(
                                            "sell_currency",
                                            currency
                                        );
                                    }}
                                />
                            </HalfWidth>
                        </FormRow>
                        <FormRow>
                            <HalfWidth>
                                <SearchBox
                                    disabled={false}
                                    name="buy_currency"
                                    labeltext="Buy"
                                    value={
                                        currencies.get(values.buy_currency) ||
                                        ""
                                    }
                                    isSearchable={true}
                                    options={currencies}
                                    isMulti={true}
                                    placeHolder="Select Buy Currency..."
                                    callFunc={async (currency: any) => {
                                        setBuyValue(currency);
                                        setFieldValue("buy_currency", currency);
                                    }}
                                />
                            </HalfWidth>

                            {!!unavailableCurrency && (
                                <p style={{ color: "red" }}>
                                    Pair not available
                                </p>
                            )}
                        </FormRow>
                        <RowContainer>
                            <HalfWidth>
                                <SelectInputField
                                    labeltext="Amount to"
                                    name="fixed_side"
                                    options={customers}
                                    value={values.fixed_side}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLSelectElement>
                                    ) => {
                                        setFixedSideValue(e.target.value);
                                        setFieldValue(
                                            "fixed_side",
                                            e.target.value
                                        );
                                    }}
                                />
                            </HalfWidth>
                            <HalfWidth>
                                <InputField
                                    name="amount"
                                    labeltext=""
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
                                            Number(input).toFixed(2),
                                            false
                                        );
                                        setFieldTouched("amount", true, true);
                                    }}
                                />
                            </HalfWidth>
                        </RowContainer>
                        {status.status == "loading" ? (
                            <RowContainer style={{ position: "relative" }}>
                                <Spinner />
                            </RowContainer>
                        ) : (
                            <RowContainer style={{ position: "relative" }}>
                                {quotePreview?.client_rate !== "" && (
                                    <>
                                        <p
                                            style={{
                                                position: "absolute",
                                                right: "25px",
                                                bottom: "0px",
                                                fontSize: "10px",
                                                color: "#aaa",
                                            }}
                                        >
                                            {values.amount}{" "}
                                            {quotePreview?.fixed_side == "buy"
                                                ? quotePreview?.client_buy_currency
                                                : quotePreview?.client_sell_currency}{" "}
                                            ={" "}
                                            {Number(
                                                Number(values.amount) *
                                                    Number(
                                                        (quotePreview?.fixed_side ==
                                                            "buy" &&
                                                            quotePreview?.currency_pair.indexOf(
                                                                quotePreview.client_sell_currency
                                                            ) !== 0) ||
                                                            (quotePreview?.fixed_side ==
                                                                "sell" &&
                                                                quotePreview?.currency_pair.indexOf(
                                                                    quotePreview.client_sell_currency
                                                                ) === 0)
                                                            ? quotePreview?.client_rate
                                                            : 1 /
                                                                  (Number(
                                                                      quotePreview?.client_rate
                                                                  ) || 1)
                                                    )
                                            ).toFixed(2)}{" "}
                                            {quotePreview?.fixed_side == "buy"
                                                ? quotePreview?.client_sell_currency
                                                : quotePreview?.client_buy_currency}
                                        </p>
                                    </>
                                )}
                            </RowContainer>
                        )}
                        <RowContainer>
                            <NextButton>
                                <Button
                                    danger
                                    style={{
                                        padding: "5px 20px",
                                        margin: "10px 10px 10px 0",
                                        borderRadius: "5px",
                                    }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate("/dashboard");
                                    }}
                                >
                                    Cancel
                                </Button>
                            </NextButton>

                            {!Object.keys(errors).length &&
                                !unavailableCurrency &&
                                values.amount && (
                                    <NextButton>
                                        <Button
                                            primary
                                            style={{
                                                padding: "5px 20px",
                                                margin: "10px 10px 10px 0",
                                                borderRadius: "5px",
                                            }}
                                            type="submit"
                                        >
                                            {allowsDateChange
                                                ? "Select a Date"
                                                : "Get a Quote"}
                                        </Button>
                                    </NextButton>
                                )}
                        </RowContainer>
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
    flex-basis: 100vw;
    padding: 10px 20px 10px 0;
`;
const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin-top: 10px;
    margin-left: -6px;
    align-items: flex-end;
    @media (max-width: 460px) {
        display: block;
    }
`;

const NextButton = styled.div`
    @media (max-width: 768px) {
        flex-direction: row;
        justify-content: center;
        // margin: 0;
    }
    @media (max-width: 992px) {
        flex-direction: row;
        justify-content: center;
        // margin: 0;
    }
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    border-radius: 100%;
    margin-left: 26px;
`;
