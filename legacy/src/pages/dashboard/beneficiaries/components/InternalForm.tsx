import React, { PropsWithoutRef, useEffect } from "react";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import Button from "../../../../components/Button";
import InputField from "../../../../components/InputField";
import SelectInputField from "../../../../components/SelectInputField";
import { Spinner } from "../../../../components/Spinner";
import {
    selectBeneficiariesError,
    selectBeneficiariesStatus,
    selectBeneficiaryData,
    updateBeneficiaryData,
    reviewBeneficiary,
} from "../../../../features/beneficiaries/BeneficiariesSlice";
//import { currencies } from "../../../features/beneficiaries/model/currencies";
import { beneficiarySchema } from "../../../../features/beneficiaries/model/beneficiary-schema";
import { countries } from "../../../../features/registration/model/countries";
import { entityTypes } from "../../../../features/beneficiaries/model/entity-types";
import { getRoutingCodeNameByCountry, getRoutingCodePlaceholderByCountry, hasAccountBicCombination, isIBAN, isInUk, isSwift } from "../../../../utils/country-check";
import { ButtonsRow } from "../../components/ButtonsRow";
import { ErrorText } from "../../components/ErrorText";
import { HalfWidth } from "../../components/HalfWidth";
import { FormRow } from "../../components/FormRow";
import { HeaderContainer } from "../../components/HeaderContainer";
import { PageTitle } from "../../components/PageTitle";
import { FlexibleForm } from "../../components/FlexibleForm";
import styled from "styled-components";
import { selectCurrencies } from "../../../../features/balances/BalancesListSlice";
import { BeneficiaryFormStep } from "../BeneficiaryForm";
export const InternalForm = ({
    setActiveStep,
}: PropsWithoutRef<{
    setActiveStep: React.Dispatch<React.SetStateAction<BeneficiaryFormStep>>;
}>) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const status = useAppSelector(selectBeneficiariesStatus);
    const error = useAppSelector(selectBeneficiariesError);
    const beneficiaryData = useAppSelector(selectBeneficiaryData);
    const currencies = useAppSelector(selectCurrencies);
    let basic_currencies: Map<string, string> = new Map();
    currencies.forEach((currency) => {
        if (currency.online_trading) {
            basic_currencies.set(
                currency.code,
                `${currency.code} - ${currency.name}`,
            );
        }
    });
    return (
        <>
            <Formik
                enableReinitialize
                initialValues={beneficiaryData}
                validationSchema={beneficiarySchema}
                onSubmit={async (
                    rdata,
                    {
                        setErrors,
                        resetForm,
                        setTouched,
                        setFieldTouched,
                        submitForm,
                        setStatus,
                    }
                ) => {
                    const data = { ...rdata };
                    try {
                        if (!data.sortCode) {
                            if (
                                data.IBAN &&
                                isInUk(data.bankCountry) &&
                                data.currency == "GBP"
                            ) {
                                data.sortCode = data.IBAN.substring(8, 14);
                            } else {
                                delete data.sortCode;
                            }
                        } else {
                            data.sortCode = String(data.sortCode);
                        }
                        if (!data.accountNumber) {
                            if (
                                data.IBAN &&
                                isInUk(data.bankCountry) &&
                                data.currency == "GBP"
                            ) {
                                data.accountNumber = data.IBAN.substring(14);
                                if (data.accountNumber.length !== 8) {
                                    delete data.accountNumber;
                                }
                            } else {
                                delete data.accountNumber;
                            }
                        } else {
                            data.accountNumber = String(data.accountNumber);
                        }
                        if (!data.IBAN) {
                            delete data.IBAN;
                        } else {
                            data.IBAN = data.IBAN.replace(/[^a-zA-Z0-9]/g, "");
                        }
                        await dispatch(updateBeneficiaryData(data));
                        const errorData = await dispatch(
                            reviewBeneficiary()
                        ).unwrap();
                        // setActiveStep(BeneficiaryFormStep.Review);
                        if (errorData.bankCountry === data.bankCountry) {
                            setActiveStep(BeneficiaryFormStep.Review);
                            return;
                        } else {
                            setStatus(undefined);

                            setTouched({ IBAN: true }, false);
                            if (errorData.bankCountry !== "") {
                                setErrors({
                                    IBAN: `Bank country does not match bank details (Bank country - ${errorData.bankCountry})`,
                                });
                            } else {
                                setErrors({
                                    IBAN: `Bank mismatch (IBAN - ${errorData.bankName} (BIC: ${errorData.bicSwift}), SWIFT - ${errorData.bankNameMismatch || 'unknown'} (BIC: ${data.bicSwift}))`,
                                });
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }}
            >
                {(formik) => (
                    <FlexibleForm>
                        {status === "loading" ? (
                            <Spinner />
                        ) : (
                            <>
                                <HeaderContainer>
                                    <PageTitle>Beneficiaries</PageTitle>
                                </HeaderContainer>
                                <FormRow>
                                    <HalfWidth>
                                        <SelectInputField
                                            labeltext="Entity Type"
                                            name="entityType"
                                            options={entityTypes}
                                        />
                                    </HalfWidth>
                                </FormRow>
                                {formik.values.entityType !== "individual" &&
                                    <FormRow>
                                        <HalfWidth>
                                            <InputField
                                                labeltext="Company name"
                                                name="companyName"
                                                placeholder="Company name"
                                            />
                                        </HalfWidth>
                                    </FormRow>
                                }
                                <FormRow>
                                    <HalfWidth>
                                        <SelectInputField
                                            labeltext="Currency"
                                            name="currency"
                                            options={basic_currencies}
                                        />
                                    </HalfWidth>
                                </FormRow>
                                {formik.values.entityType === "individual" ? (
                                    <>
                                        <FormRow>
                                            <HalfWidth>
                                                <InputField
                                                    labeltext="First name"
                                                    name="firstname"
                                                    placeholder="John"
                                                />
                                            </HalfWidth>
                                        </FormRow>

                                        <FormRow>
                                            <HalfWidth>
                                                <InputField
                                                    labeltext="Last name"
                                                    name="lastname"
                                                    placeholder="Smith"
                                                />
                                            </HalfWidth>
                                        </FormRow>

                                        <FormRow>
                                            <HalfWidth>
                                                <InputField
                                                    labeltext="Address"
                                                    name="address"
                                                    as="textarea"
                                                    required
                                                />
                                            </HalfWidth>
                                        </FormRow>
                                    </>
                                ) : (
                                    <FormRow>
                                        <HalfWidth>
                                            <InputField
                                                labeltext="Address"
                                                name="address"
                                                as="textarea"
                                                required
                                            />
                                        </HalfWidth>
                                    </FormRow>
                                )}
                                <FormRow>
                                    <HalfWidth>
                                        <InputField
                                            labeltext="City"
                                            name="city"
                                            placeholder="City"
                                            required
                                        />
                                    </HalfWidth>
                                </FormRow>
                                <FormRow>
                                    <HalfWidth>
                                        <InputField
                                            labeltext="State"
                                            name="state"
                                            placeholder="State"
                                            required
                                        />
                                    </HalfWidth>
                                </FormRow>
                                <FormRow>
                                    <HalfWidth>
                                        <InputField
                                            labeltext="Postcode"
                                            name="postcode"
                                            placeholder="Postcode"
                                            required
                                        />
                                    </HalfWidth>
                                </FormRow>
                                <FormRow>
                                    <HalfWidth>
                                        <SelectInputField
                                            labeltext="Country"
                                            name="country"
                                            options={countries}
                                        />
                                    </HalfWidth>
                                </FormRow>
                                
                                <FormRow>
                                    <HalfWidth>
                                        <SelectInputField
                                            labeltext="Bank account country"
                                            name="bankCountry"
                                            options={countries}
                                        />
                                    </HalfWidth>
                                </FormRow>
                                {(getRoutingCodeNameByCountry(formik.values.bankCountry || '', formik.values.currency || '') !== '' || hasAccountBicCombination(formik.values.bankCountry || '')) &&
                                <FormRow>
                                    <HalfWidth>
                                        <InputField
                                            labeltext="Account number"
                                            name="accountNumber"
                                            placeholder="12345678"
                                        />
                                    </HalfWidth>
                                </FormRow>}
                                {getRoutingCodeNameByCountry(formik.values.bankCountry || '', formik.values.currency || '') !== '' && 
                                    <>
                                        <FormRow>
                                            <FormRow>
                                                <HalfWidth>
                                                    <InputField
                                                        labeltext={getRoutingCodeNameByCountry(formik.values.bankCountry || '', formik.values.currency || '')}
                                                        name="sortCode"
                                                        placeholder={getRoutingCodePlaceholderByCountry(formik.values.bankCountry || '', formik.values.currency || '')}
                                                    />
                                                </HalfWidth>
                                            </FormRow>
                                        </FormRow>
                                        <SeparatorText>OR</SeparatorText>
                                    </>
                                }
                                {isIBAN(formik.values.bankCountry) ? (
                                    <FormRow>
                                        <HalfWidth>
                                            <InputField
                                                labeltext="IBAN"
                                                name="IBAN"
                                                placeholder="AA00000000000000000000000000"
                                            />
                                        </HalfWidth>
                                    </FormRow>
                                ) : null}
                                {isIBAN(formik.values.bankCountry) ||
                                isSwift(formik.values.bankCountry) ? (
                                    <FormRow>
                                        <HalfWidth>
                                            <InputField
                                                labeltext="BIC SWIFT"
                                                name="bicSwift"
                                                placeholder="AAAABBCC123"
                                            />
                                        </HalfWidth>
                                    </FormRow>
                                ) : null}
                                {status === "error" ? (
                                    <ErrorText>{error}</ErrorText>
                                ) : null}
                                {formik.isValid === false && (
                                    <ErrorText>
                                        {formik.errors.city &&
                                            "Your must enter the beneficiary city"}
                                        {formik.errors.city && <br />}
                                        {formik.errors.address &&
                                            "Your must enter the beneficiary address"}
                                    </ErrorText>
                                )}
                                <ButtonsRow>
                                    <Button
                                        type="button"
                                        primary
                                        onClick={() =>
                                            navigate("/dashboard/beneficiaries")
                                        }
                                    >
                                        Back to Beneficiary List
                                    </Button>
                                    <Button
                                        type="button"
                                        danger
                                        onClick={() => navigate("/dashboard")}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" secondary>
                                        Confirm Beneficiary
                                    </Button>
                                </ButtonsRow>
                            </>
                        )}
                    </FlexibleForm>
                )}
            </Formik>
        </>
    );
}

const SeparatorText = styled.div`
    color: ${(props) => props.theme.colors.fg};
    padding: 8px 30px;
    font-size: 0.8em;
    font-weight: bold;
`;