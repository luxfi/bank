'use client';

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 56px;
  border-bottom: 1px solid
    ${(props) => props.theme.borderColor.layout['divider-subtle'].value};
`;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  border-bottom: 2px solid
    ${(props) => props.theme.borderColor.interactive.primary.value};
`;

export const Title = styled.h3`
  color: ${(props) => props.theme.textColor.layout.primary.value};
  font-size: ${(props) => props.theme.fontSize.body_md.value};
  font-weight: ${(props) => props.theme.fontWeight.semibold.value};
`;

export const UnderTitle = styled.h3`
  align-self: flex-start;
  color: ${(props) => props.theme.textColor.layout.secondary.value};
  font-size: ${(props) => props.theme.fontSize.caption.value};
  font-weight: ${(props) => props.theme.fontWeight.semibold.value};
`;
