'use client';

import styled from 'styled-components';

export const Container = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const EditUserForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.gap.xl.value};
  width: 810px;
`;

export const GrayCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: ${(props) =>
    props.theme.backgroundColor.layout['container-L2'].value};
  border-radius: ${(props) => props.theme.borderRadius['radius-lg'].value};
  padding: 16px;
`;

export const ContainerSimpleList = styled.div`
  border-bottom: 1px solid
    ${(props) => props.theme.borderColor.layout['border-strong'].value};
  padding-block: ${(props) => props.theme.padding.sm.value};
  padding-inline: ${(props) => props.theme.padding.xxs.value};
`;

export const TitleSimpleList = styled.h1`
  letter-spacing: 0.07px;
  line-height: 20px;
  font-size: ${(props) => props.theme.fontSize.body_sm.value};
  font-weight: 400;
  color: ${(props) => props.theme.textColor.layout.primary.value};
`;
