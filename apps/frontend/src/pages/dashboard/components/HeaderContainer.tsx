import styled from "styled-components";

export const HeaderContainer = styled.div`
display: flex;
flex-direction: row;
justify-content: flex-start;
align-items: center;
padding-top: 0px;
padding-bottom: 10px;
color: ${props => props.theme.colors.fg};
`;
