import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

export const ContainerAdmin = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: ${(props) => props.theme.size['32px']};
`;

export const ContainersDataGridAdmin = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.size['32px']};
  margin-top: ${(props) => props.theme.size['48px']};
`;

export const Content = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1;
`;

export const SimpleContainerGrid = styled.div`
  display: grid;
  grid-template-columns: 130px 1fr;
  grid-template-rows: 32px;
`;

export const ContentItem = styled.div``;
export const Title = styled.h1`
  font-size: ${(props) => props.theme.size['24px']};
  text-align: center;
`;
export const Text = styled.p`
  font-size: ${(props) => props.theme.size['24px']};
  font-weight: 400;
`;

export const ContentModal = styled.div`
  display: flex;
  gap: 1.5rem;
`;
