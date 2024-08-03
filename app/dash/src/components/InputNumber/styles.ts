'use client';

import { InputNumber } from 'antd';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  .ant-input-number-lg {
    width: 100%;
  }
`;

export const Label = styled.label`
  font-weight: 600;
  font-size: ${(props) => props.theme.size['20px']};
  margin-bottom: ${(props) => props.theme.size['8px']};
  padding-left: ${(props) => props.theme.size['16px']};
  color: ${(props) => props.theme.colors.label};
`;

export const LabelError = styled.span`
  font-size: 500;
  font-size: ${(props) => props.theme.size['16px']};
  margin-top: ${(props) => props.theme.size['8px']};
  margin-left: ${(props) => props.theme.size['16px']};
  color: ${(props) => props.theme.colors.danger};
`;

export const StyledInput = styled(InputNumber)`
  .ant-input-number-handler-wrap {
    display: none !important;
  }
`;
