'use client';

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-inline: ${(props) => props.theme.padding.lg.value};
  padding-block: ${(props) => props.theme.padding.xl.value};
`;

export const Title = styled.h1`
  font-weight: 700;
  font-size: ${(props) => props.theme.fontSize.title_md.value};
  color: ${(props) => props.theme.textColor.layout.primary.value};
  margin-bottom: ${(props) => props.theme.margin.xxs.value};
  letter-spacing: -0.42px;
  line-height: 40px;
  text-align: center;
`;

export const Subtitle = styled.h4`
  font-weight: 400;
  letter-spacing: 0.08px;
  line-height: 24px;
  font-size: ${(props) => props.theme.fontSize.body_md.value};
  color: ${(props) => props.theme.textColor.layout.secondary.value};
  text-align: center;
`;
