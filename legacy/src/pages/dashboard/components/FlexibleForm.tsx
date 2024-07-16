import { Form } from "formik";
import styled from "styled-components";
import InputField from "../../../components/InputField";
import SelectInputField from "../../../components/SelectInputField";
import { FormRow } from "./FormRow";
import { HalfWidth } from "./HalfWidth";

export const FlexibleForm = styled(Form)`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    flex-basis: 100%;
    text-align: left;

    * {
        &:disabled {
            cursor: not-allowed;
        }
    }
`;

export interface FlexibleFormFieldProps {
    labeltext: string;
    name: string;
    placeholder: string;
    type?: string;
    helpText?: string;
    style?: any;
    onBlur?: any;
    onFocus?: any;
    disabled?: boolean;
}

export function FlexibleFormField(props: FlexibleFormFieldProps) {
    return (
        <FormRow>
            <HalfWidth>
                <InputField {...props} />
            </HalfWidth>
        </FormRow>
    );
}
export function FlexibleFormFieldWithPadding(props: FlexibleFormFieldProps) {
    return (
        <FormRow style={{ padding: "10px 20px" }}>
            <InputField containerStyle={{ width: "100%" }} {...props} />
        </FormRow>
    );
}

export interface FlexibleFormSelectFieldProps extends FlexibleFormFieldProps {
    options?: Map<string, string>;
}

export function FlexibleFormSelectField(props: FlexibleFormSelectFieldProps) {
    return (
        <FormRow>
            <HalfWidth>
                <SelectInputField {...props} />
            </HalfWidth>
        </FormRow>
    );
}
