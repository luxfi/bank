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
    @media(max-width: 768px){
        align-items: center;
        align-items: flex-start;
        justify-content: flex-start;
        display: flex;
    }
    display: flex;
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 20px;
    color: ${(props)=>props.theme.colors.label};
`;

const Label = styled.label`
    @media(max-width: 768px){
        width: 45%;
        text-align: center;
        justify-content: flex-start;
    }
    padding: 3px 10px;
    font-size: 0.8em;
    font-weight: bold;
    text-align: left;

`;
const TextLabel = styled.label`
    @media(max-width: 768px){
        width: 90%;
        text-align: left;
    }
    padding: 3px 10px;
    font-size: 0.8em;
    font-weight: bold;
    text-align: left;

`;

const HelpText = styled.div`
    padding: 3px 10px;
    font-size: 0.8em;
    
`;

const ErrorText = styled.span`
    color: ${props => props.theme.colors.danger};
    padding: 3px 10px;
    font-size: 0.8em;
`;

const RadioButtonsWrapper = styled.div`
@media(max-width: 768px){
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
    flex-wrap: nowrap;
    display: flex;
    flex-direction: row;
`;

export default function RadioButtonChoiceField(
    { children, options, labeltext, helpText, containerStyle, ...props }: FieldAttributes<Props>
) {
    const [field, meta, helpers] = useField(props);

    return (
        <Container style={containerStyle ? containerStyle : undefined}>
            <TextLabel htmlFor={props.id || props.name}>{labeltext}</TextLabel>
            {helpText ? <HelpText>{helpText}</HelpText> : null}

            <RadioButtonsWrapper>
                {children ? children : (options ?
                    Array.from(options).map(([key, value]) => (
                        <Label key={key}>
                            <Field
                                type='radio'
                                id={(props.id || props.name) + key}
                                value={key}
                                checked={getValue(key) === getValue(meta.value as unknown as string)}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    (helpers as unknown as FieldHelperProps<string | boolean>)
                                        .setValue(getValue(e.target.value), true);
                                }}
                                {...props}
                            />
                            {value}
                        </Label>
                    )) : null)}
            </RadioButtonsWrapper>

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
