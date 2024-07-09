import { Field, FieldAttributes, FieldHelperProps, useField } from "formik";
import { CSSProperties } from "react";
import ReactDatePicker from "react-datepicker";
import styled from "styled-components";
import InputFieldsSharedStyles from "./styles/input-fields-shared-styles";
import Tooltip from "./Tooltip";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

interface Props {
    name: string;
    labeltext: string;
    helpText?: string;
    containerStyle?: CSSProperties;
    filterDate?: (date: Date) => boolean;
}

const StyledField = styled(Field)`
    ${InputFieldsSharedStyles}
    border: 1px solid ${(props) =>
        props.hasError
            ? props.theme.colors.danger
            : props.theme.colors.borderlabel};
    border-radius: 5px;
`;

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    text-align: left;
    margin: 0 5px 15px 5px;
`;

const Label = styled.label`
    @media (max-width: 768px) {
        text-align: left;
    }
    color: ${(props) => props.theme.colors.label};
    padding: 3px 10px;
    font-size: 0.8em;
    font-weight: bold;
    opacity: 0.5;
`;

const ErrorText = styled.span`
    color: ${(props) => props.theme.colors.danger};
    padding: 3px 10px;
    font-size: 0.8em;
`;
const isWeekday = (date: Date) => {
    if (date.getTime() + 3600 * 24 * 1000 < Date.now()) return false;
    if (date.getDay() == 0 || date.getDay() == 6) return false;
    //if date is a holiday return false;
    return true;
};
export default function DateInputField({
    children,
    labeltext,
    helpText,
    containerStyle,
    ...props
}: FieldAttributes<Props>) {
    const [field, meta, helper] = useField(props);
    return (
        <Container style={containerStyle ? containerStyle : undefined}>
            <Label htmlFor={props.id || props.name}>
                {labeltext}
                {helpText ? <Tooltip text={helpText} /> : null}
            </Label>
            <ReactDatePicker
                dateFormat={"dd MMM yyyy"}
                className={"datepicker"}
                onChange={(date) =>
                    (
                        helper as unknown as FieldHelperProps<string | boolean>
                    ).setValue(
                        date
                            ? date.toLocaleString("en")
                            : new Date().toLocaleString("en")
                    )
                }
                selected={
                    field.value
                        ? moment(String(field.value)).toDate()
                        : undefined
                }
                filterDate={!props.filterDate ? isWeekday : props.filterDate}
                placeholderText="Select a day"
            />
            {meta.touched && meta.error ? (
                <ErrorText>{meta.error}</ErrorText>
            ) : null}
        </Container>
    );
}
