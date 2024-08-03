'use client';

import styled from 'styled-components';

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
  align-items: center;

  span {
    color: red;
    font-size: 14px;
  }
`;

export const InputsContainer = styled.div`
  display: flex;
  gap: 12px;
`;

export const StyledInput = styled.input`
  width: 45px;
  height: 53px;
  border-radius: 6px;
  text-align: center;
  font-size: 28px;
  outline: none;
  color: #6b6b6b;

  border: 2px solid #0f244d30;

  .hasError {
    border: 2px solid red;
  }

  &:focus {
    border: 1px solid #00569f;
    box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
  }
`;
