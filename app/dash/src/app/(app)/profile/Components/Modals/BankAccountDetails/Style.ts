import styled from 'styled-components';

export const ContentModal = styled.form`
  display: grid;

  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

export const ContentButton = styled.div`
  width: 100%;
  display: flex;
  justify-content: end;
  margin-top: 24px;
  grid-column: 1 / 3;
`;
