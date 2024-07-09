import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../../../../components/Button";
import { Formik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { useEffect, useState } from "react";
import moment from "moment";
import CheckboxField from "../../../../components/CheckboxField";
import BaseSlide, { StyledForm } from "../../../registration/slides/BaseSlide";
import { SlideProps } from "../../../registration/helpers/slide-types";
import * as yup from "yup";
import CurrencyComplete from "./CurrencyComplete";
import CurrencyDate from "./CurrencyDate";
import {
    loadCurrencyQuote,
    postCurrencyQuote,
    resetQuoteFromResponseData,
    resetQuotePostResponseData,
    selectCurrencyApiStatus,
    selectCurrencyConvert,
    selectCurrencyDate,
    selectCurrencyQuote,
    selectQuoteData,
} from "../../../../features/accountview/ViewCurrencySlice";
import { ErrorText } from "../../components/ErrorText";
import { dateToHuman } from "../../../../utils/text-helpers";
import CurrencyConvert from "./CurrencyConvert";
import { loadBalancesList } from "../../../../features/balances/BalancesListSlice";
import { Spinner } from "../../../../components/Spinner";
import { openErrorNotification } from "../../../../components/Notifications";
let currency_timeout: NodeJS.Timeout;

export default function CurrencyQuote({
    goToSlide,
    selectedSlide,
}: SlideProps) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const currencyConvert = useAppSelector(selectCurrencyConvert);
    const currencyDate = useAppSelector(selectCurrencyDate);
    const gateway = window.localStorage.getItem("gateway");
    const allowsDateChange = gateway !== "openpayd";
    const START_SECOND = allowsDateChange ? 15 : 10;
    useEffect(() => {
        if (selectedSlide == 2 - (allowsDateChange ? 0 : 1)) {
            dispatch(resetQuoteFromResponseData());
            dispatch(
                loadCurrencyQuote({
                    ...currencyConvert,
                    ...currencyDate,
                    term_agreement: true,
                })
            );
        }
    }, [currencyConvert, selectedSlide]);
    const quote = useAppSelector(selectCurrencyQuote);
    const loadedQuote = useAppSelector(selectQuoteData);
    const status = useAppSelector(selectCurrencyApiStatus);
    const [quote_date, setDate] = useState(
        moment(new Date()).format("YYYY-MM-DD")
    );
    const [quoteRunning, setQuoteRunning] = useState(false);
    const [quoteInProcess, setQuoteInProcess] = useState(false);

    const [currentSecond, setCurrentSecond] = useState(START_SECOND);
    const [quoteError, setQuoteError] = useState("");
    const ele = document.getElementById("convert");
    const [submitting, setSubmitting] = useState(false);
    useEffect(() => {
        if (
            quote?.client_rate &&
            quoteRunning &&
            selectedSlide == 2 - (allowsDateChange ? 0 : 1)
        ) {
            clearTimeout(currency_timeout);
            currency_timeout = setTimeout(() => {
                if (currentSecond > 0) {
                    setCurrentSecond(currentSecond - 1);
                } else {
                    setQuoteRunning(false);
                }
            }, 1000);
        } else {
            clearTimeout(currency_timeout);
        }
    }, [currentSecond, selectedSlide, quoteRunning, quote]);
    useEffect(() => {
        if (selectedSlide == 2 - (allowsDateChange ? 0 : 1)) {
            if (quote?.client_rate) {
                setQuoteRunning(true);
                setQuoteInProcess(false);
                setCurrentSecond(START_SECOND);
                setQuoteError("");
            } else if (
                quote?.client_rate !== "" &&
                loadedQuote?.client_rate !== ""
            ) {
                setQuoteError(
                    "Failed to create a quote for selected date. Please select a different date."
                );
            }
        }
    }, [selectedSlide, quote, loadedQuote]);
    const requote = async () => {
        await dispatch(resetQuotePostResponseData());
        await dispatch(resetQuoteFromResponseData());
        setQuoteInProcess(true);
        await dispatch(
            loadCurrencyQuote({
                ...currencyConvert,
                ...currencyDate,
                term_agreement: true,
            })
        );
        setQuoteInProcess(false);
        setQuoteRunning(true);
        setCurrentSecond(START_SECOND);
    };
    const formSubmit = async (
        values: any,
        { setValues }: { setValues: any }
    ) => {
        setSubmitting(true);
        setValues(
            {
                quote: false,
            },
            false
        );
        dispatch(resetQuoteFromResponseData());
        ele?.setAttribute("disabled", "true");
        setQuoteRunning(false);
        setQuoteInProcess(true);
        const quoteFromResponse = await dispatch(
            postCurrencyQuote({
                ...currencyConvert,
                conversion_date: currencyDate.conversion_date,
                quoteId: quote.quoteId || "",
                term_agreement: true,
            })
        ).unwrap();
        setQuoteInProcess(false);
        if (quoteFromResponse) {
            await dispatch(loadBalancesList());
            ele?.setAttribute("disabled", "false");
            goToSlide(CurrencyComplete);
            setSubmitting(false);
        } else {
            ele?.setAttribute("disabled", "false");
            setSubmitting(false);
            requote();
            openErrorNotification("Quote expired", "Please try again.");
        }
    };
    return (
        <BaseSlide key="currency-quote" title="empty" sort="payment">
            <Formik
                initialValues={{ quote: false }}
                validationSchema={yup.object({
                    quote: yup
                        .boolean()
                        .isTrue("You have to agree to the quote")
                        .required("You have to agree to the quote"),
                })}
                onSubmit={formSubmit}
            >
                {({ values, setValues }) => (
                    <StyledForm>
                        <RowBetweenContainer>
                            <LargeTitle>Quote</LargeTitle>
                        </RowBetweenContainer>
                        <RowContainer>
                            <TableContainer style={{ width: "100%" }}>
                                {(status.host === "loadCurrencyQuote" &&
                                    status.status === "loading") ||
                                submitting ? (
                                    <Spinner />
                                ) : status.host === "loadCurrencyQuote" &&
                                  status.status === "error" ? (
                                    status.error
                                ) : (
                                    <tbody style={{ width: "100%" }}>
                                        {!!quote?.client_sell_amount && (
                                            <tr>
                                                <th>Selling:</th>
                                                <td>
                                                    {Number(
                                                        quote?.client_sell_amount
                                                    ).toFixed(2)}{" "}
                                                    {
                                                        quote?.client_sell_currency
                                                    }
                                                </td>
                                            </tr>
                                        )}
                                        {!!quote?.client_buy_amount && (
                                            <tr>
                                                <th>Buying:</th>
                                                <td>
                                                    {Number(
                                                        quote?.client_buy_amount
                                                    ).toFixed(2)}{" "}
                                                    {quote?.client_buy_currency}
                                                </td>
                                            </tr>
                                        )}
                                        {!!quote?.client_rate && (
                                            <tr>
                                                <th>Your Exchange Rate:</th>
                                                <td>{quote?.client_rate}</td>
                                            </tr>
                                        )}
                                        {!!quote?.settlement_cut_off_time && (
                                            <tr>
                                                <th>Settlement Date:</th>
                                                <td>
                                                    {dateToHuman(
                                                        quote?.settlement_cut_off_time
                                                    )}
                                                </td>
                                            </tr>
                                        )}
                                        <tr>
                                            <th>Conversion Date:</th>
                                            <td>
                                                {dateToHuman(
                                                    currencyDate.conversion_date
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                )}
                            </TableContainer>
                        </RowContainer>
                        <RowContainer>
                            <ItemContainer>
                                {quote?.deposit_required && (
                                    <p>
                                        {quote.deposit_amount}{" "}
                                        {quote.deposit_currency} deposit is
                                        required for this conversion
                                    </p>
                                )}
                            </ItemContainer>
                        </RowContainer>
                        {status.status !== "loading" && !!quoteError && (
                            <RowContainer>
                                <ErrorText>{quoteError} </ErrorText>
                            </RowContainer>
                        )}
                        {quoteRunning &&
                            quote?.client_rate &&
                            !quoteInProcess && (
                                <>
                                    <RowContainer>
                                        <BorderLabel>
                                            <NextButton>
                                                <img
                                                    src={`${process.env.PUBLIC_URL}/images/currencies/pending.svg`}
                                                    width="30px"
                                                    height="30px"
                                                    alt="pending"
                                                />
                                            </NextButton>
                                            <NextButton>
                                                <LargeTitle>
                                                    {currentSecond > 0 ? (
                                                        <>
                                                            Quote Expires in{" "}
                                                            <span
                                                                style={{
                                                                    color: "#FF0000",
                                                                }}
                                                            >
                                                                {currentSecond}
                                                            </span>{" "}
                                                            seconds
                                                        </>
                                                    ) : (
                                                        <>
                                                            Quote Expired, Get
                                                            Another Quote
                                                        </>
                                                    )}
                                                </LargeTitle>
                                            </NextButton>
                                        </BorderLabel>
                                    </RowContainer>
                                    <RowContainer
                                        style={{ marginLeft: "30px" }}
                                    >
                                        <CheckboxField
                                            name="quote"
                                            labeltext="I am happy with this quote"
                                        />
                                    </RowContainer>
                                </>
                            )}
                        <RowContainer>
                            {!submitting &&
                                (!quoteInProcess || quoteError !== "") && (
                                    <>
                                        <NextButton>
                                            <Button
                                                sky
                                                style={{
                                                    borderRadius: "5px",
                                                    padding: "5px 20px",
                                                    margin: "10px 10px 10px 0",
                                                }}
                                                onClick={(e) => {
                                                    setValues(
                                                        { quote: false },
                                                        false
                                                    );
                                                    e.preventDefault();
                                                    goToSlide(
                                                        allowsDateChange
                                                            ? CurrencyDate
                                                            : CurrencyConvert
                                                    );
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
                                                    margin: "10px 10px 10px 0",
                                                }}
                                                onClick={(e) => {
                                                    setValues(
                                                        { quote: false },
                                                        false
                                                    );
                                                    e.preventDefault();
                                                    dispatch(
                                                        resetQuoteFromResponseData()
                                                    );
                                                    navigate("/dashboard");
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </NextButton>
                                    </>
                                )}
                            {quoteRunning &&
                            quote?.client_rate &&
                            !quoteInProcess ? (
                                <NextButton>
                                    <Button
                                        sky
                                        style={{
                                            margin: "10px 10px 10px 0",
                                            padding: "5px 20px",
                                            borderRadius: "5px",
                                        }}
                                        type="submit"
                                        id="convert"
                                    >
                                        Convert
                                    </Button>
                                </NextButton>
                            ) : null}
                            {!quoteRunning &&
                            quote?.client_rate &&
                            !quoteInProcess ? (
                                <NextButton>
                                    <Button
                                        sky
                                        style={{
                                            padding: "5px 20px",
                                            borderRadius: "5px",
                                            margin: "10px 10px 10px 0",
                                        }}
                                        type="button"
                                        onClick={requote}
                                    >
                                        Requote
                                    </Button>
                                </NextButton>
                            ) : null}
                        </RowContainer>
                    </StyledForm>
                )}
            </Formik>
        </BaseSlide>
    );
}
const ItemContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    flex-basis: 100vw;
    padding: 0px 20px 0px 30px;
    text-align: left;
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
    @media (max-width: 540px) {
        display: block;
    }
`;
const BorderLabel = styled.div`
    display: flex;
    flex-direction: row;
    /* width: 100%; */
    border: 1px solid ${(props) => props.theme.colors.bgrey};
    padding: 15px;
    margin-left: 20px;
    align-items: center;
    /* border-radius: 15px; */
    justify-content: flex-start;
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
    margin-left: 10px;
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
