'use client';

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  color: ${(props) => props.theme.textColor.layout.secondary.value};
  font-size: ${(props) => props.theme.fontSize.caption.value};
  letter-spacing: 0.18px;
  line-height: 18px;
`;

export const Value = styled.span`
  color: ${(props) => props.theme.textColor.layout.primary.value};
  font-size: ${(props) => props.theme.fontSize.body_md.value};
  letter-spacing: 0.08px;
  line-height: 24px;
  font-weight: 400;
`;
