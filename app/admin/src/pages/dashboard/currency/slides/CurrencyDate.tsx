import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../../../../components/Button";
import { HalfWidth } from "../../components/HalfWidth";
import { Formik } from "formik";
import { FormRow } from "../../components/FormRow";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { useCallback, useState } from "react";
import moment from "moment";
import { SlideProps } from "../../../registration/helpers/slide-types";
import BaseSlide, { StyledForm } from "../../../registration/slides/BaseSlide";
import CurrencyQuote from "./CurrencyQuote";
import CurrencyConvert from "./CurrencyConvert";
import {
    selectCurrencyQuote,
    setCurrencyDate,
} from "../../../../features/accountview/ViewCurrencySlice";
import { ErrorText } from "../../components/ErrorText";
import DateInputField from "../../../../components/DateInputField";
export default function CurrencyDate({ goToSlide }: SlideProps) {
    const navigate = useNavigate();
    const [dateError, setDateError] = useState("");
    const dispatch = useAppDispatch();
    const quotePreview = useAppSelector(selectCurrencyQuote);
    const invalid_dates = Object.keys(
        quotePreview?.invalid_conversion_dates || {}
    );

    const first_date = quotePreview?.first_conversion_date;

    const initialValues = {
        conversion_date: first_date,
    };

    const filterDate = useCallback(
        (date: Date) => {
            if (moment(date) < moment(first_date)) return false;
            if (invalid_dates.indexOf(moment(date).format("YYYY-MM-DD")) !== -1)
                return false;
            if (date.getTime() + 3600 * 24 * 1000 < Date.now()) return false;
            return true;
        },
        [invalid_dates]
    );
    return (
        <BaseSlide key="currency-date" title="empty" sort="payment">
            <Formik
                initialValues={initialValues}
                enableReinitialize
                onSubmit={(values) => {
                    var todayDate = moment(new Date()).format("YYYY-MM-DD");
                    if (
                        !values.conversion_date ||
                        new Date(todayDate).getTime() >
                            new Date(values.conversion_date).getTime()
                    ) {
                        setDateError("Please enter the date correctly");
                        return;
                    }
                    dispatch(
                        setCurrencyDate({
                            conversion_date: moment(
                                values.conversion_date
                            ).format("YYYY-MM-DD"),
                        })
                    );
                    setDateError("");
                    goToSlide(CurrencyQuote);
                }}
            >
                {({ values, setFieldValue }) => (
                    <StyledForm>
                        <FormRow>
                            <HalfWidth>
                                <BoldTitle>Select Date of Conversion</BoldTitle>
                            </HalfWidth>
                        </FormRow>
                        <RowContainer>
                            <Container>
                                <DateInputField
                                    filterDate={filterDate}
                                    defaultValue={values.conversion_date}
                                    labeltext="Please remember to offset your payment date against GMT."
                                    name="conversion_date"
                                    type="date"
                                    helpText="To ensure your payment is made on the date intended, please make applicable adjustments to payment date to reflect the offset against GMT. You are not able to make payments on a date preceding the local time of payment destination"
                                />
                                <ErrorText>{dateError}</ErrorText>
                            </Container>
                        </RowContainer>
                        <RowContainer>
                            <TextField>
                                By clicking on "Get a Quote" you agree with our{" "}
                                <a
                                    href="/terms_and_conditions"
                                    target={"_blank"}
                                    style={{ color: "#F49C0E" }}
                                >
                                    {" "}
                                    &nbsp; Term of use
                                </a>
                            </TextField>
                        </RowContainer>
                        <RowContainer>
                            <NextButton>
                                <Button
                                    sky
                                    style={{
                                        padding: "5px 20px",
                                        borderRadius: "5px",
                                        margin: "10px 10px 10px 0",
                                    }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        goToSlide(CurrencyConvert);
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
                                        e.preventDefault();
                                        navigate("/dashboard");
                                    }}
                                >
                                    Cancel
                                </Button>
                            </NextButton>
                            <NextButton>
                                <Button
                                    primary
                                    style={{
                                        padding: "5px 20px",
                                        margin: "10px 10px",
                                        borderRadius: "5px",
                                    }}
                                    type="submit"
                                >
                                    Get a Quote
                                </Button>
                            </NextButton>
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
    margin: 10px;
    align-items: center;
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
`;
const TextField = styled.div`
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
    display: flex;
    flex-direction: row;
    margin-left: 10px;
`;
const BoldTitle = styled.h3`
    padding: 10px auto;
    margin-left: 0px;
    text-align: left;
    margin-top: 20px;
    margin-bottom: -20px;
`;
