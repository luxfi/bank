'use client';

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  .ant-checkbox-inner,
  .ant-checkbox-input {
    transform: scale(1.2);
  }

  span {
    font-size: ${(props) => props.theme.fontSize.body_md.value};
    color: ${(props) => props.theme.textColor.layout.primary.value};
    font-weight: 500;
  }
`;

export const LabelError = styled.span`
  margin-top: 8px;
  color: ${(props) => props.theme.colors.danger} !important;
`;
