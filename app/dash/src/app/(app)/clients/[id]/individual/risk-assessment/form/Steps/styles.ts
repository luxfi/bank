'use client';

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-inline: 32px;
  width: 100%;
  gap: 24px;
`;

export const Title = styled.h3`
  font-size: ${(props) => props.theme.fontSize.headline.value};
  color: ${(props) => props.theme.textColor.layout.primary.value};
  font-weight: 400;
`;

export const Subtitle = styled.h3`
  font-size: ${(props) => props.theme.fontSize.body_md.value};
  color: ${(props) => props.theme.textColor.layout.secondary.value};
  font-weight: 400;
`;

export const StepContainer = styled.div`
  width: 900px;
`;

export const LabelCalc = styled.span`
  font-weight: 600;
  font-size: ${(props) => props.theme.fontSize.caption.value};
  color: ${(props) => props.theme.colors.label};
  line-height: 18px;
  letter-spacing: 0.17px;
`;

export const LabelValueCalc = styled.span`
  font-weight: 500;
  font-size: ${(props) => props.theme.fontSize.body_md.value};
  color: ${(props) => props.theme.textColor.layout.primary.value};
  line-height: 24px;
  letter-spacing: 0.08px;
`;

export const ContainerCalcCurrency = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  gap: 4px;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  width: 100%;
  padding-inline: 64px;
`;

export const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
`;

export const WrapperButton = styled.div`
  width: 240px;
  button {
    width: 100%;
  }
`;

export const ActionContainer = styled.div`
  display: flex;
  margin-top: 24px;
  gap: 16px;
`;

export const QuoteExpireContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 24px;
`;

export const QuoteExpireTitle = styled.span`
  font-size: ${(props) => props.theme.fontSize.headline.value};
  color: ${(props) => props.theme.textColor.layout.primary.value};
  font-weight: 500;
`;

export const QuoteExpireCounter = styled.span`
  color: ${(props) =>
    props.theme.backgroundColor.interactive['primary-default'].value};
  font-size: ${(props) => props.theme.fontSize.headline.value};
`;
