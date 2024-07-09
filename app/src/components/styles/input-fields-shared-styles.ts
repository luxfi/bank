import { css } from "styled-components";

const InputFieldsSharedStyles = css`
border: 1px solid ${(props) => props.theme.colors.fg};
border-radius: 5px;
appearance: none;
color: ${(props) => props.theme.colors.placecolor} !important;
opacity: 1;
padding: 10px;
width: 100%;
background-color: ${props => props.theme.colors.bg};
margin-bottom: 0px;
font-size: 1em;

&:focus {
  outline: none;
  border-bottom: 1px solid ${(props) => props.theme.colors.primary};
}

&::placeholder {
  color: ${(props) => props.theme.colors.fg};
  opacity: 0.4;
}
`;

export default InputFieldsSharedStyles;
