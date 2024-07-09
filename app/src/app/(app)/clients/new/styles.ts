'use client';

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const FormFullRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${(props) => props.theme.size['24px']};
`;

export const ActionContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.size['24px']};
`;

export const ButtonsContainer = styled.div`
  display: flex;
  gap: ${(props) => props.theme.size['24px']};
  width: ${(props) => props.theme.size['624px']};
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${(props) => props.theme.margin.lg.value};
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 808px;
  gap: 16px;
`;

export const TagContainer = styled.div`
  background-color: ${(props) =>
    props.theme.backgroundColor.layout['container-L0'].value};
  padding: ${(props) => props.theme.padding.xxs.value};
  border-radius: ${({ theme }) => theme.borderRadius['radius-md'].value};
  width: 100%;
`;

export const TagTitle = styled.h1`
  color: ${({ theme }) => theme.textColor.interactive.enabled.value};
  font-weight: 600;
  font-size: ${({ theme }) => theme.typography.body.md_semibold.value.fontSize};
  letter-spacing: 0.07px;
  line-height: ${({ theme }) =>
    theme.typography.body.md_semibold.value.lineHeight};
`;
