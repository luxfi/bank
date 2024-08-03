'use client';

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 24px;
`;

export const Title = styled.h3`
  font-size: ${(props) => props.theme.fontSize.headline.value};
  color: ${(props) => props.theme.textColor.layout.primary.value};
  font-weight: 400;
`;

export const StepContainer = styled.div`
  width: 900px;
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

  padding-bottom: 64px;
`;
