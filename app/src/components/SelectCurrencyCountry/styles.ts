'use client';

import { Input as InputAntd } from 'antd';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  .css-dev-only-do-not-override-2i2tap.ant-input:hover,
  .css-dev-only-do-not-override-2i2tap.ant-input-affix-wrapper:hover {
    border-color: ${(props) => props.theme.colors.primary};
  }

  .css-dev-only-do-not-override-2i2tap.ant-input-affix-wrapper:focus,
  .css-dev-only-do-not-override-2i2tap.ant-input-affix-wrapper:focus-within,
  .css-dev-only-do-not-override-2i2tap.ant-input:focus,
  .css-dev-only-do-not-override-2i2tap.ant-input:focus-within {
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
  }
`;

export const Label = styled.label`
  font-weight: ${({ theme }) =>
    theme.typography.caption.regular.value.fontWeight};
  font-size: ${({ theme }) => theme.typography.caption.regular.value.fontSize};
  margin-bottom: ${(props) => props.theme.size['8px']};
  color: ${({ theme }) => theme.textColor.interactive.enabled.value};
`;

export const LabelError = styled.span`
  font-size: 500;
  font-size: ${(props) => props.theme.size['16px']};
  margin-top: ${(props) => props.theme.size['8px']};
  margin-left: ${(props) => props.theme.size['16px']};
  color: ${(props) => props.theme.colors.danger};
`;

export const LabelHelper = styled.span`
  font-size: 400;
  font-size: ${(props) => props.theme.size['12px']};
  margin-top: ${(props) => props.theme.size['8px']};
  margin-left: ${(props) => props.theme.size['16px']};
  color: ${(props) => props.theme.textColor.layout.secondary.value};
`;

export const ContainerOption = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
`;

export const FlagContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 100%;
  width: 24px;
  height: 24px;
  margin-right: 16px;
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const LabelTitle = styled.span`
  font-size: ${(props) => props.theme.fontSize.body_md.value};
  line-height: 24px;
  letter-spacing: 0.08px;
  font-weight: 400;
  color: ${(props) => props.theme.textColor.layout.secondary.value};
`;

export const LabelSubtitle = styled.span`
  color: ${(props) => props.theme.textColor.layout.secondary.value};
  font-size: ${(props) => props.theme.fontSize.caption.value};
  line-height: 18px;
  letter-spacing: 0.18px;
  font-weight: 400;
`;

export const Input = styled(InputAntd)``;
