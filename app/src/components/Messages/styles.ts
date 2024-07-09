'use client';

import styled from 'styled-components';

export const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-inline: ${(props) => props.theme.padding.lg.value};
  padding-block: ${(props) => props.theme.padding.xl.value};
`;

export const MessageTitle = styled.h1`
  font-weight: 700;
  font-size: ${(props) => props.theme.fontSize.title_md.value};
  color: ${(props) => props.theme.textColor.layout.primary.value};
  margin-bottom: ${(props) => props.theme.margin.xxs.value};
  letter-spacing: -0.42px;
  line-height: 40px;
  text-align: center;
`;

export const MessageDescription = styled.h4`
  font-weight: 400;
  letter-spacing: 0.08px;
  line-height: 24px;
  font-size: ${(props) => props.theme.fontSize.body_md.value};
  color: ${(props) => props.theme.textColor.layout.secondary.value};
  text-align: center;
`;

export const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-inline: 24px;
  padding-top: 24px;
`;

export const QuestionTitle = styled.h1`
  color: ${(props) => props.theme.textColor.layout.primary.value};
  font-size: ${(props) => props.theme.fontSize.body_md.value};
  letter-spacing: 0.08px;
  line-height: 24px;
`;

export const QuestionDescription = styled.h6`
  font-weight: 400;
  letter-spacing: 0.08px;
  line-height: 24px;
  font-size: ${(props) => props.theme.fontSize.caption.value};
  color: ${(props) => props.theme.textColor.layout.secondary.value};
  /* text-align: center; */
`;
