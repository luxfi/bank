import { useField } from 'formik';
import React, { CSSProperties } from 'react';
import styled from 'styled-components';
import TextInput from './TextInput';

interface Props {
    name: string;
    labeltext: string;
    containerStyle?: CSSProperties;
}

type TextInputFieldProps = Props & React.HTMLProps<HTMLInputElement>;
const WrappedTextInput: any = styled(TextInput)`
    margin-bottom: 0px;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 30px;
`;

const Label = styled.label`
    padding: 3px 10px;
    font-size: 0.8em;
`

const ErrorText = styled.span`
    color: ${props => props.theme.colors.danger};
    padding: 3px 10px;
    font-size: 0.8em;
`

export default function TextInputField({ children, labeltext, containerStyle, ...props }: TextInputFieldProps) {
    const [field, meta] = useField(props);

    return (
        <Container style={containerStyle ? containerStyle : undefined}>
            <Label htmlFor={props.id || props.name}>{labeltext}</Label>
            <WrappedTextInput {...field} {...props} id={props.id || props.name} hasError={!!(meta.touched && meta.error)} />
            {meta.touched && meta.error ? <ErrorText>{meta.error}</ErrorText> : null}
        </Container>
    );
}
