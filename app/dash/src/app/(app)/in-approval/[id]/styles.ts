import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
`;

export const List = styled.table`
  width: 100%;

  th,
  tr {
    display: flex;
    align-items: center;
    padding: 0 1rem;
    color: #0b1936;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    letter-spacing: 0.08px;
    word-wrap: break-word;
  }

  tr {
    height: 28px;
    justify-content: space-between;
    background-color: #f5f8ff;
  }

  .title {
    justify-content: flex-start;
    background-color: #edf1f5;
    height: 40px;
    font-weight: 600;
  }

  .light {
    background-color: #fff;
  }
`;

export const DisclaimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  gap: ${(props) => props.theme.gap.sm.value};
  padding: 8px;
  border-radius: ${(props) => props.theme.borderRadius['radius-lg'].value};
  background-color: ${(props) =>
    props.theme.backgroundColor.interactive['primary-disabled'].value};
`;
