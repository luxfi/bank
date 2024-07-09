import { Field, FieldAttributes, useField } from "formik";
import { CSSProperties, useEffect } from "react";
import styled from "styled-components";
import InputFieldsSharedStyles from "./styles/input-fields-shared-styles";
import Tooltip from "./Tooltip";
import PhoneInput from "react-phone-number-input";

interface Props {
    name: string;
    labeltext: string;
    helpText?: string;
    containerStyle?: CSSProperties;
    variant?: "default" | "phone";
}

const StyledField = styled(Field)`
    ${InputFieldsSharedStyles}
    border: 1px solid ${(props) =>
        props.hasError
            ? props.theme.colors.danger
            : props.theme.colors.borderlabel};
    border-radius: 5px;
`;
const PhoneNumberInput = styled(PhoneInput)`
    .PhoneInputInput {
        ${InputFieldsSharedStyles}
        border: none;
        border-radius: 0 5px 5px 0 !important;
        border-left: 1px solid
            ${(props) =>
                props.hasError
                    ? props.theme.colors.danger
                    : props.theme.colors.borderlabel};
        border-radius: 0;
        margin-left: 8px;
    }
    padding-left: 12px;
    border: 1px solid
        ${(props) =>
            props.hasError
                ? props.theme.colors.danger
                : props.theme.colors.borderlabel};
    border-radius: 5px;
`;

const Container = styled.div`
    @media (max-width: 768px) {
        width: auto;
    }
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    text-align: left;
    margin: 0 5px 15px 5px;

    input[required] + label:after,
    textarea[required] + label:after {
        content: "*" !important;
        color: red !important;
    }
`;

const Label = styled.label`
    @media (max-width: 768px) {
        text-align: left;
    }
    color: ${(props) => props.theme.colors.label};
    padding: 3px 10px;
    font-size: 0.8em;
    font-weight: bold;
    opacity: 1;
`;

const ErrorText = styled.span`
    color: ${(props) => props.theme.colors.danger};
    padding: 3px 10px;
    font-size: 0.8em;
`;

export default function InputField({
    children,
    labeltext,
    helpText,
    containerStyle,
    variant,
    ...props
}: FieldAttributes<Props>) {
    const [field, meta] = useField(props);

    return (
        <>
            {variant === "default" ||
                (!variant && (
                    <Container
                        style={containerStyle ? containerStyle : undefined}
                    >
                        {(!!labeltext || !!helpText) && (
                            <Label htmlFor={props.id || props.name}>
                                {labeltext}
                                {helpText ? <Tooltip text={helpText} /> : null}
                            </Label>
                        )}

                        <StyledField
                            {...field}
                            className={`required-${props.name}`}
                            {...(props as any)}
                            id={props.id || props.name}
                            name={props.id || props.name}
                            required={props.required}
                            hasError={!!(meta.touched && meta.error)}
                        />
                        {meta.touched && meta.error ? (
                            <ErrorText>{meta.error}</ErrorText>
                        ) : null}
                    </Container>
                ))}
            {variant === "phone" && (
                <Container style={containerStyle ? containerStyle : undefined}>
                    {(!!labeltext || !!helpText) && (
                        <Label htmlFor={props.id || props.name}>
                            {labeltext}
                            {helpText ? <Tooltip text={helpText} /> : null}
                        </Label>
                    )}

                    <PhoneNumberInput
                        {...field}
                        {...(props as any)}
                        international
                        defaultCountry={"IM"}
                        className={`required-${props.name}`}
                        name={props.id || props.name}
                        required={props.required}
                        hasError={!!(meta.touched && meta.error)}
                        id={props.id || props.name}
                    />
                    {meta.touched && meta.error ? (
                        <ErrorText>{meta.error}</ErrorText>
                    ) : null}
                </Container>
            )}
        </>
    );
}
