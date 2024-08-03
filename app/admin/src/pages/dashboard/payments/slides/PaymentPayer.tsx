import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../../../../components/Button";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { HalfWidth } from "../../components/HalfWidth";
import SelectInputField from "../../../../components/SelectInputField";
import { Formik, useFormikContext } from "formik";
import { FormRow } from "../../components/FormRow";
import InputField from "../../../../components/InputField";
import moment from "moment";
import { useState, useEffect } from "react";
import { Radio } from "antd";
import RadioButtonChoiceField from "../../../../components/RadioButtonChoiceField";
import { paymentPayerMetadataSchema } from "../../../../features/accountview/model/paymentPayerMetadataSchema";
import { countries } from "../../../../features/registration/model/countries";
import BaseSlide, { StyledForm } from "../../../registration/slides/BaseSlide";
import { SlideProps } from "../../../registration/helpers/slide-types";
import SelectCurrency from "./SelectCurrency";
import PaymentReview from "./PaymentReview";
import { setActiveState } from "../../../../features/auth/ViewCarouselSlice";
import {
    selectBeneficiaryId,
    selectCurrencyBeneficiaries,
} from "../../../../features/beneficiaries/BeneficiariesListSlice";
import {
    getDeliveryDateSlice,
    resetPayment,
    selectDeliveryDate,
    selectPayer,
    selectPayment,
    selectPaymentFees,
} from "../../../../features/accountview/ViewPaymentSlice";
import { setPayerInformation } from "../../../../features/accountview/ViewPaymentSlice";
import { dateToHuman, dateToHumanDate } from "../../../../utils/text-helpers";
import DateInputField from "../../../../components/DateInputField";
import { getPaymentReasonOptions } from "./paymentReasons";
import { BtnRowContainer } from "../../../../components/Containers";
interface FormikInterface {
    payment_date: string;
}
const PaymentDatePicker = ({ selectedSlide }: { selectedSlide: number }) => {
    const { values, setFieldValue, handleBlur } =
        useFormikContext<FormikInterface>();
    const currency_beneficiaries = useAppSelector(selectCurrencyBeneficiaries);
    const selectedBeneficiary = useAppSelector(selectBeneficiaryId);
    const current_beneficiary = currency_beneficiaries.filter(
        (item) => item.id == selectedBeneficiary.uuid
    )[0];
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (selectedSlide !== 1) return;
        if (current_beneficiary) {
            dispatch(
                getDeliveryDateSlice({
                    payment_date: moment(values.payment_date).format(
                        "YYYY-MM-DD"
                    ),
                    payment_type:
                        current_beneficiary?.payment_types?.slice(0).pop() ||
                        "",
                    currency: current_beneficiary.currency,
                    bank_country: current_beneficiary.bank_country,
                })
            );
        }
    }, [current_beneficiary, selectedSlide, values.payment_date]);
    return (
        <FormRow>
            <HalfWidth>
                <BoldTitle>Payment Date</BoldTitle>
                <DateInputField
                    defaultValue={values.payment_date}
                    labeltext="Please remember to offset your payment date against GMT."
                    name="payment_date"
                    type="date"
                    helpText="To ensure your payment is made on the date intended, please make applicable adjustments to payment date to reflect the offset against GMT. You are not able to make payments on a date preceding the local time of payment destination"
                />
            </HalfWidth>
        </FormRow>
    );
};

export default function PaymentPayer({ goToSlide, selectedSlide }: SlideProps) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const payer = useAppSelector(selectPayer);
    const payment = useAppSelector(selectPayment);
    const currency_beneficiaries = useAppSelector(selectCurrencyBeneficiaries);
    const selectedBeneficiary = useAppSelector(selectBeneficiaryId);
    const deliveryDate = useAppSelector(selectDeliveryDate);

    //const [paytype, setPayType] = useState('false');
    const fees = useAppSelector(selectPaymentFees);
    const current_beneficiary = currency_beneficiaries.filter(
        (item) => item.id == selectedBeneficiary.uuid
    )[0];

    const gateway = window.localStorage.getItem("gateway") || "";
    const paymentReasonCodes = getPaymentReasonOptions(
        gateway,
        current_beneficiary?.bank_country,
        current_beneficiary?.currency,
        current_beneficiary?.beneficiary_entity_type
    );
    const initialValues = {
        payment_date:
            payment.payment_date || moment(new Date()).format("YYYY-MM-DD"),
        payment_type: current_beneficiary?.payment_types?.slice(0).pop() || "",
        pay_type: payment.payer_details_source !== "account" ? "true" : "false",
        pay_reason: payment?.reason || "",
        pay_reference: payment?.reference || "",
        purpose_code: payment?.purpose_code || "-1",
        payer_type: "true",
        payer_country: payer?.country || "GB",
        payer_company_name: payer?.company_name || "",
        payer_address: payer?.address || "",
        payer_city: payer?.city || "",
        payer_first_name: payer?.first_name || "",
        payer_last_name: payer?.last_name || "",
        payer_birth: payer?.date_of_birth || "",
    };
    const [payer_birth, setBirth] = useState("");
    const YesNoSelection = new Map([
        ["true", "Yes"],
        ["false", "No"],
    ]);
    const PayerSelection = new Map([
        ["true", "Company"],
        ["false", "Individual"],
    ]);

    function formatDate(date: string) {
        var d = new Date(date),
            month = "" + (d.getMonth() + 1),
            day = "" + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;

        return [year, month, day].join("-");
    }
    const isPaymentDateAvailable = true;
    const isCustomPayerAvailable = false;
    const isDeliveryDateAvailable = gateway !== "openpayd";
    return (
        <BaseSlide key="payer-slide" title="empty" sort="payment">
            <Formik
                initialValues={initialValues}
                validationSchema={paymentPayerMetadataSchema}
                enableReinitialize
                onSubmit={async (values) => {
                    await dispatch(
                        setPayerInformation({
                            payment_date: moment(values.payment_date).format(
                                "YYYY-MM-DD"
                            ),
                            payment_type: values.payment_type
                                ? values.payment_type
                                : current_beneficiary.payment_types
                                      .slice(0)
                                      .pop() || "",
                            pay_type: values.pay_type,
                            pay_reason: values.pay_reason,
                            pay_reference: values.pay_reference,
                            purpose_code: values.purpose_code || "",
                            payer_type:
                                values.pay_type == "false"
                                    ? values.payer_type
                                    : "",
                            payer_country:
                                values.payer_type != undefined
                                    ? values.payer_country
                                    : "",
                            payer_company_name:
                                values.payer_type == "true"
                                    ? values.payer_company_name
                                    : "",
                            payer_address:
                                values.payer_type != undefined
                                    ? values.payer_address
                                    : "",
                            payer_city: values.payer_address,
                            payer_first_name:
                                values.payer_type == "false"
                                    ? values.payer_first_name
                                    : "",
                            payer_last_name:
                                values.payer_type == "false"
                                    ? values.payer_last_name
                                    : "",
                            payer_birth:
                                values.payer_type == "false"
                                    ? formatDate(payer_birth)
                                    : "",
                        })
                    );
                    dispatch(setActiveState({ activeState: 2 }));
                    goToSlide(PaymentReview);
                }}
            >
                {({ values, setFieldValue }) => (
                    <StyledForm>
                        <Container>
                            {isPaymentDateAvailable && (
                                <PaymentDatePicker
                                    selectedSlide={selectedSlide}
                                />
                            )}
                            <FormRow>
                                <HalfWidth>
                                    <BoldTitle>Payment Type</BoldTitle>
                                </HalfWidth>
                            </FormRow>
                            <FormRow>
                                <NextButton>
                                    <Radio.Group
                                        value={
                                            values.payment_type ||
                                            current_beneficiary
                                                ?.payment_types[0]
                                        }
                                        onChange={(e) => {
                                            setFieldValue(
                                                "payment_type",
                                                e.target.value
                                            );
                                            {
                                                isPaymentDateAvailable &&
                                                    isDeliveryDateAvailable &&
                                                    dispatch(
                                                        getDeliveryDateSlice({
                                                            payment_date:
                                                                values.payment_date,
                                                            payment_type:
                                                                e.target.value,
                                                            currency: "GBP",
                                                            bank_country: "GB",
                                                        })
                                                    );
                                            }
                                        }}
                                    >
                                        {current_beneficiary?.payment_types.indexOf(
                                            "regular"
                                        ) !== -1 && (
                                            <Radio value={"regular"}>
                                                Regular
                                            </Radio>
                                        )}
                                        {current_beneficiary?.payment_types.indexOf(
                                            "SWIFT"
                                        ) !== -1 && (
                                            <Radio value={"SWIFT"}>SWIFT</Radio>
                                        )}
                                        {current_beneficiary?.payment_types.indexOf(
                                            "ACH"
                                        ) !== -1 && (
                                            <Radio value={"ACH"} checked>
                                                ACH
                                            </Radio>
                                        )}
                                        {current_beneficiary?.payment_types.indexOf(
                                            "WIRE"
                                        ) !== -1 && (
                                            <Radio value={"WIRE"} checked>
                                                WIRE
                                            </Radio>
                                        )}
                                        {current_beneficiary?.payment_types.indexOf(
                                            "EXPRESS_SWIFT"
                                        ) !== -1 && (
                                            <Radio
                                                value={"EXPRESS_SWIFT"}
                                                checked
                                            >
                                                EXPRESS SWIFT
                                            </Radio>
                                        )}
                                        {current_beneficiary?.payment_types.indexOf(
                                            "FASTER_PAYMENTS"
                                        ) !== -1 && (
                                            <Radio
                                                value={"FASTER_PAYMENTS"}
                                                checked
                                            >
                                                FASTER PAYMENTS
                                            </Radio>
                                        )}
                                        {current_beneficiary?.payment_types.indexOf(
                                            "SEPA"
                                        ) !== -1 && (
                                            <Radio value={"SEPA"} checked>
                                                SEPA
                                            </Radio>
                                        )}
                                        {current_beneficiary?.payment_types.indexOf(
                                            "SEPA_INSTANT"
                                        ) !== -1 && (
                                            <Radio
                                                value={"SEPA_INSTANT"}
                                                checked
                                            >
                                                SEPA INSTANT
                                            </Radio>
                                        )}
                                        {current_beneficiary?.payment_types.indexOf(
                                            "TARGET2"
                                        ) !== -1 && (
                                            <Radio value={"TARGET2"} checked>
                                                TARGET2
                                            </Radio>
                                        )}
                                        {current_beneficiary?.payment_types.indexOf(
                                            "CHAPS"
                                        ) !== -1 && (
                                            <Radio value={"CHAPS"}>CHAPS</Radio>
                                        )}
                                        {current_beneficiary?.payment_types.indexOf(
                                            "priority"
                                        ) !== -1 && (
                                            <Radio value={"priority"}>
                                                Priority
                                            </Radio>
                                        )}
                                    </Radio.Group>
                                    {isDeliveryDateAvailable && (
                                        <small>
                                            Your payment should arrive on{" "}
                                            {dateToHuman(
                                                deliveryDate?.payment_cutoff_time
                                            )}{" "}
                                            as long as you have sufficient{" "}
                                            {deliveryDate?.currency} before{" "}
                                            {dateToHumanDate(
                                                deliveryDate?.payment_delivery_date
                                            )}{" "}
                                            GMT .
                                        </small>
                                    )}
                                </NextButton>
                            </FormRow>
                            {!!fees && fees[values.payment_type] && (
                                <small>
                                    Payment fee:{" "}
                                    {fees[values.payment_type].fee_amount}
                                </small>
                            )}
                            {typeof current_beneficiary === "object" &&
                            current_beneficiary.iban ? (
                                <RowContainer>
                                    <TableContainer style={{ width: "100%" }}>
                                        <tbody style={{ width: "100%" }}>
                                            <tr>
                                                <th>IBAN Number:</th>
                                                <td>
                                                    {current_beneficiary
                                                        ? current_beneficiary.iban
                                                        : ""}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Entity Type:</th>
                                                <td>
                                                    {current_beneficiary
                                                        ? current_beneficiary.beneficiary_entity_type
                                                        : ""}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </TableContainer>
                                </RowContainer>
                            ) : (
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
                                            {!!current_beneficiary
                                                ?.beneficiary_address[0] && (
                                                <tr>
                                                    <th>
                                                        Beneficiary Address:
                                                    </th>
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
                                                        {current_beneficiary
                                                            ? current_beneficiary.beneficiary_city
                                                            : ""}
                                                    </td>
                                                </tr>
                                            )}
                                            <tr>
                                                <th>Beneficiary Country:</th>
                                                <td>
                                                    {current_beneficiary
                                                        ? current_beneficiary.beneficiary_country
                                                        : ""}
                                                </td>
                                            </tr>
                                            {!!current_beneficiary?.routing_code_value_1 && (
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
                                            {!!current_beneficiary?.account_number && (
                                                <tr>
                                                    <th>Account Number:</th>
                                                    <td>
                                                        {current_beneficiary
                                                            ? current_beneficiary.account_number
                                                            : ""}
                                                    </td>
                                                </tr>
                                            )}
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
                                            {!!current_beneficiary?.iban && (
                                                <tr>
                                                    <th>IBAN:</th>
                                                    <td>
                                                        {current_beneficiary
                                                            ? current_beneficiary.iban
                                                            : ""}
                                                    </td>
                                                </tr>
                                            )}
                                            {!!current_beneficiary?.bic_swift && (
                                                <tr>
                                                    <th>BIC/SWIFT Code:</th>
                                                    <td>
                                                        {current_beneficiary
                                                            ? current_beneficiary.bic_swift
                                                            : ""}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </TableContainer>
                                </RowContainer>
                            )}
                            {isCustomPayerAvailable && (
                                <>
                                    <RowContainer>
                                        <HalfWidth>
                                            <BoldTitle>
                                                I am the payer
                                            </BoldTitle>
                                        </HalfWidth>
                                    </RowContainer>
                                    <RowContainer>
                                        <HalfWidth>
                                            <RadioButtonChoiceField
                                                options={YesNoSelection}
                                                name="pay_type"
                                                labeltext=""
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>
                                                ) => {
                                                    setFieldValue(
                                                        "pay_type",
                                                        e.target.value
                                                    );
                                                }}
                                            />
                                        </HalfWidth>
                                    </RowContainer>
                                </>
                            )}

                            {values.pay_type === "true" ? null : (
                                <HalfWidth>
                                    <RadioButtonChoiceField
                                        options={PayerSelection}
                                        name="payer_type"
                                        labeltext="Payer Type"
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                            setFieldValue(
                                                "payer_type",
                                                e.target.value
                                            );
                                        }}
                                    />
                                </HalfWidth>
                            )}

                            {values.pay_type === "true" ||
                            !isCustomPayerAvailable ? null : (
                                <HalfWidth>
                                    <SelectInputField
                                        labeltext="Country"
                                        name="payer_country"
                                        placeholder="Select country"
                                        options={countries}
                                    />
                                </HalfWidth>
                            )}
                            {isCustomPayerAvailable &&
                            values.payer_type === "true" &&
                            values.pay_type == "false" ? (
                                <HalfWidth>
                                    <InputField
                                        placeholder="Company Name"
                                        name="payer_company_name"
                                        labeltext="Company Name"
                                        helpText=""
                                    />
                                    <InputField
                                        placeholder="Address"
                                        name="payer_address"
                                        labeltext="Address"
                                        helpText=""
                                    />
                                    <InputField
                                        placeholder="City"
                                        name="payer_city"
                                        labeltext="City"
                                        helpText=""
                                    />
                                </HalfWidth>
                            ) : isCustomPayerAvailable &&
                              values.payer_type === "false" &&
                              values.pay_type == "false" ? (
                                <HalfWidth>
                                    <InputField
                                        placeholder="First Name"
                                        name="payer_first_name"
                                        labeltext="First Name"
                                        helpText=""
                                    />
                                    <InputField
                                        placeholder="Last Name"
                                        name="payer_last_name"
                                        labeltext="Address"
                                        helpText=""
                                    />
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "start",
                                            padding: "5px",
                                        }}
                                    >
                                        <Label>Date of Birth</Label>
                                        <input
                                            type="date"
                                            name="payer_birth"
                                            style={{
                                                width: "15vw",
                                                marginLeft: "20px",
                                            }}
                                            value={payer_birth}
                                            onChange={(e) => {
                                                setBirth(e.target.value);
                                            }}
                                        />
                                    </div>
                                    <InputField
                                        placeholder="Address"
                                        name="payer_address"
                                        labeltext="Address"
                                        helpText=""
                                    />
                                    <InputField
                                        placeholder="City"
                                        name="payer_city"
                                        labeltext="City"
                                        helpText=""
                                    />
                                </HalfWidth>
                            ) : null}
                            <hr />
                            <HalfWidth>
                                <InputField
                                    placeholder="Enter payment reason"
                                    name="pay_reason"
                                    labeltext="Payment Reason"
                                    helpText="Information that will be provided  to compliance"
                                />
                                <InputField
                                    placeholder="Enter payment reference"
                                    name="pay_reference"
                                    labeltext="Payment reference"
                                    helpText="Information that will be provided to the beneficiary bank and should appear on their statement. Please note this text may be truncated or removed."
                                />
                            </HalfWidth>
                            {paymentReasonCodes.size > 1 && (
                                <HalfWidth>
                                    <SelectInputField
                                        labeltext="Payment Purpose"
                                        name="purpose_code"
                                        options={paymentReasonCodes}
                                    />
                                </HalfWidth>
                            )}
                            <BtnRowContainer>
                                <NextButton>
                                    <Button
                                        sky
                                        style={{
                                            borderRadius: "5px",
                                            padding: "5px 20px",
                                            // margin: "10px 10px 10px 0",
                                        }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            dispatch(resetPayment({}));
                                            dispatch(
                                                setActiveState({
                                                    activeState: 0,
                                                })
                                            );
                                            goToSlide(SelectCurrency);
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
                                            dispatch(
                                                setActiveState({
                                                    activeState: 0,
                                                })
                                            );
                                            goToSlide(SelectCurrency);
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
                                        type="submit"
                                    >
                                        Review Payment
                                    </Button>
                                </NextButton>
                            </BtnRowContainer>
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
    flex-basis: 100vw;
    padding: 10px 20px 10px 0;
`;
const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin: 10px 10px -20px 0px;
    align-items: center;
    @media (max-width: 768px) {
        display: block;
        margin: auto;
    }
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
    align-items: center;
    margin-left: 27px;
`;
const BoldTitle = styled.h3`
    /* padding: 10px auto; */
    margin-left: 10px;
    text-align: left;
    margin-top: 20px;
`;
const SubHeader = styled.h3`
    padding-top: 2.6em;
    font-size: 1em;
    text-align: left;
    color: ${(props) => props.theme.colors.fg};
`;
const Label = styled.label`
    color: ${(props) => props.theme.colors.label};
    font-size: 0.8em;
    font-weight: bold;
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
        tr {
            width: 50%;
        }
        td {
            width: 50%;
        }
    }
`;
