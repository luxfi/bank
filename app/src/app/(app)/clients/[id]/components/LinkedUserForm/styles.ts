import styled from 'styled-components';

export const LinkedUserForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.gap.xl.value};
  width: 810px;
`;
