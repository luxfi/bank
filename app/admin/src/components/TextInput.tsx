import styled from 'styled-components';
import InputFieldsSharedStyles from './styles/input-fields-shared-styles';

interface Props {
    hasError: boolean;
}

const TextInput = styled.input<Props>`
    ${InputFieldsSharedStyles}
    border: none;
    border-bottom: 1px solid ${(props) => props.hasError ? props.theme.colors.danger : props.theme.colors.fg};
`;

export default TextInput;
