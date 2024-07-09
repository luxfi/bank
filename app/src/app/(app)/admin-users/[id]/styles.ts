import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  flex: 1;
`;

export const ContainerForm = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${(props) => props.theme.size['32px']};

  padding: ${(props) =>
    `${props.theme.size['24px']} ${props.theme.size['80px']}`};
`;

export const ContentInput = styled.div`
  display: flex;
  gap: 2rem;

  div {
    width: 50%;
  }
`;

export const ActionContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${(props) => props.theme.size['24px']};
`;

export const ButtonsContainer = styled.div`
  display: flex;
  gap: ${(props) => props.theme.size['24px']};
  width: ${(props) => props.theme.size['624px']};
`;
