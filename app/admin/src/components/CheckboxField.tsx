import { Field, FieldAttributes, FieldHelperProps, useField } from 'formik';
import React, { CSSProperties } from 'react';
import styled from 'styled-components';

interface Props {
    name: string;
    labeltext: string;
    helpText?: string;
    options?: Map<string, string>;
    containerStyle?: CSSProperties;
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    margin: 20px;
`;

const Label = styled.label`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 3px 10px;
    font-size: 0.8em;
    font-weight: bold;
    text-align: left;
`;

const HelpText = styled.div`
    padding: 3px 10px;
    font-size: 0.8em;
`;
const Spacing = styled.div`
    padding: 3px 10px;
`;
const ErrorText = styled.span`
    color: ${props => props.theme.colors.danger};
    padding: 3px 10px;
    font-size: 0.8em;
`;

const RadioButtonsWrapper = styled.div`
    display: flex;
    flex-direction: row;
`;

export default function CheckboxField(
    { children, options, labeltext, helpText, containerStyle, ...props }: FieldAttributes<Props>
) {
    const [field, meta, helpers] = useField(props);

    return (
        <Container style={containerStyle ? containerStyle : undefined}>
            <Label>
                <Field
                    style={{width:'25px', height:'25px'}}
                    type='checkbox'
                    hasError={!!(meta.touched && meta.error)}
                    {...props}
                    name={props.name}
                />
                <Spacing>{labeltext}</Spacing>
            </Label>
            {helpText ? <HelpText>{helpText}</HelpText> : null}

            {meta.touched && meta.error ? <ErrorText>{meta.error}</ErrorText> : null}
        </Container>
    );
}


function getValue(value: string): string | boolean {
    if (value === 'true') {
        return true;
    } else if (value === 'false') {
        return false;
    } else {
        return value;
    }
}
