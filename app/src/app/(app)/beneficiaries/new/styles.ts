'use client';

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

export const Title = styled.h1`
  font-weight: 400;
  color: ${(props) => props.theme.textColor.layout.primary.value};
  font-size: ${(props) => props.theme.fontSize.headline.value};
  line-height: ${(props) => props.theme.lineHeight.headline.value};
  letter-spacing: -0.026px;
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

export const TwoContent = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`;

export const TagContainer = styled.div`
  background-color: ${(props) =>
    props.theme.backgroundColor.layout['container-L0'].value};
  padding: ${(props) => props.theme.padding.xxs.value};
  width: 100%;
`;

export const TagTitle = styled.h1`
  color: ${(props) => props.theme.textColor.interactive.enabled.value};
  font-weight: 600;
  font-size: ${(props) => props.theme.fontSize.body_md.value};
  letter-spacing: 0.07px;
  line-height: 24px;
`;

export const TagSubtitle = styled.p`
  font-weight: 400;
  color: ${(props) => props.theme.textColor.layout.secondary.value};
  font-size: ${(props) => props.theme.fontSize.body_sm.value};
  line-height: 20px;
  letter-spacing: 0.07px;
`;

export const ActionContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 32px;
  margin-bottom: 100px;
`;
