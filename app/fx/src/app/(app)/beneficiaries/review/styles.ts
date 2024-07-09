'use client';

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const Title = styled.h1`
  font-weight: 400;
  color: ${(props) => props.theme.textColor.layout.primary.value};
  font-size: ${(props) => props.theme.fontSize.headline.value};
  line-height: ${(props) => props.theme.lineHeight.headline.value};
  letter-spacing: -0.026px;
`;

export const TabContainer = styled.div``;

export const BeneficiaryContainerCard = styled.div`
  border-radius: ${(props) => props.theme.borderRadius['radius-md'].value};
  overflow: hidden;
  width: 638px;
`;

export const BeneficiaryHeaderCard = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  background-color: ${(props) =>
    props.theme.backgroundColor.layout['container-L0'].value};
  padding: ${(props) => props.theme.padding.lg.value};
`;

export const BeneficiaryContentCard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) =>
    props.theme.backgroundColor.layout['container-L2'].value};
  gap: ${(props) => props.theme.gap.sm.value};
  padding: ${(props) => props.theme.padding.sm.value};
`;

export const BeneficiaryCardTitle = styled.h1`
  color: ${(props) => props.theme.textColor.layout.primary.value};
  font-size: ${(props) => props.theme.fontSize.headline.value};
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0.07px;
`;

export const BeneficiaryCardSubtitle = styled.h3`
  color: ${(props) => props.theme.textColor.layout.secondary.value};
  font-size: ${(props) => props.theme.fontSize.caption.value};
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0.07px;
`;
