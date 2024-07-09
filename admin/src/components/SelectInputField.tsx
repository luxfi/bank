import { Field, FieldAttributes, useField } from 'formik';
import React, { CSSProperties } from 'react';
import styled from 'styled-components';
import InputFieldsSharedStyles from './styles/input-fields-shared-styles';

interface SelectInputFieldProps extends React.HTMLProps<HTMLSelectElement> {
    name: string;
    labeltext: string;
    options?: Map<string, string>;
    containerStyle?: CSSProperties;
}

interface SelectProps {
    hasError: boolean;
    children: React.ReactNode;
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    text-align: left;
`;

const Label = styled.label`
    color: ${(props) => props.theme.colors.label};
    padding: 3px 10px;
    margin-left:5px;
    font-size: 0.8em;
    font-weight: bold;
`;

const ErrorText = styled.span`
    color: ${props => props.theme.colors.danger};
    padding: 3px 10px;
    font-size: 0.8em;
`;

const Select = styled(Field) <FieldAttributes<SelectProps>>`
    ${InputFieldsSharedStyles}
    border: none;
    border: 1px solid ${(props) => props.hasError ? props.theme.colors.danger : props.theme.colors.borderlabel};
    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='%23414042'><polygon points='0,0 100,0 50,50'/></svg>") no-repeat;
    background-size: 12px;
    background-position: calc(100% - 5px) 17px;
    padding-right: 30px;
    // width: auto !important;
    background-repeat: no-repeat;
    background-color: white;
    border-radius: 5px;
    margin: 0 5px 15px 5px !important;
    @media (max-width: 768px) {
        width: auto;
    }
`;

export default function SelectInputField(
    { children, labeltext, options, containerStyle, ...props }: FieldAttributes<SelectInputFieldProps>
) {
    const [field, meta] = useField(props);

    return (
        <Container style={containerStyle ? containerStyle : undefined}>
            <Label htmlFor={props.id || props.name}>{labeltext}</Label>
            <Select {...field} {...props} id={props.id || props.name} hasError={!!(meta.touched && meta.error)} forwardedAs={'select'}>
                {children ? children : (options ?
                    Array.from(options).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                    )) : null)}
            </Select>
            {meta.touched && meta.error ? <ErrorText>{meta.error}</ErrorText> : null}
        </Container>
    );
}
