'use client';

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${(props) => props.theme.width.xxxl.value};
  height: ${(props) => props.theme.height['20x'].value};
  cursor: pointer;
`;

export const ContainerRounded = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 100%;

  width: ${(props) => props.theme.width.xl.value};
  min-height: ${(props) => props.theme.height.xl.value};
  border: 1px solid
    ${(props) => props.theme.borderColor.interactive.primary.value};
  margin-bottom: ${(props) => props.theme.margin.xxxs.value};
`;

export const Text = styled.h3`
  font-size: ${(props) => props.theme.fontSize.body_sm.value};
  font-weight: ${(props) => props.theme.fontWeight.regular.value};
  line-height: ${(props) => props.theme.lineHeight.body_sm.value};
  letter-spacing: ${(props) => props.theme.letterSpacing.body.value};
  text-align: center;
  color: #0f244da3;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
`;

export const Title = styled.h1`
  font-size: ${(props) => props.theme.fontSize.body_md.value};
  font-weight: ${(props) => props.theme.fontWeight.regular.value};
  line-height: ${(props) => props.theme.lineHeight.body_sm.value};
  letter-spacing: ${(props) => props.theme.letterSpacing.body.value};
  text-align: center;
  color: #0b1936;
`;
