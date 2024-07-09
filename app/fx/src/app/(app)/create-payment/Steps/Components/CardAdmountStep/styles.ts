'use client';

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  min-width: 368px;

  border-radius: ${(props) => props.theme.borderRadius['radius-lg'].value};
  border: 1px solid
    ${(props) => props.theme.borderColor.layout['divider-strong'].value};

  padding: ${(props) => props.theme.padding.sm.value};
  gap: ${(props) => props.theme.gap.xxs.value};
`;

export const Label = styled.label`
  font-size: ${(props) => props.theme.fontSize.caption.value};
  color: ${(props) => props.theme.textColor.layout.secondary.value};
`;

export const Value = styled.span`
  font-size: ${(props) => props.theme.fontSize.body_md.value};
  color: ${(props) => props.theme.textColor.layout.primary.value};
`;

export const ValueContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
