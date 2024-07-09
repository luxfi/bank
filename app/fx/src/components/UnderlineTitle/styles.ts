'use client';

import styled from 'styled-components';

export const Container = styled.div`
  border-bottom: 2px solid
    ${(props) =>
      props.theme.backgroundColor.interactive['primary-default'].value};
  width: fit-content;
  padding-block: ${(props) => props.theme.padding.sm.value};
`;

export const Title = styled.h1`
  color: ${(props) => props.theme.textColor.layout.primary.value};
  letter-spacing: 0.08px;
  line-height: 24px;
  font-size: ${(props) => props.theme.fontSize.body_md.value};
  font-weight: 600;
`;
