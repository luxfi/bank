'use client';

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  border: 1px solid
    ${(props) => props.theme.borderColor.layout['border-subtle'].value};
  border-radius: ${(props) => props.theme.borderRadius['radius-md'].value};
  padding-block: ${(props) => props.theme.padding.lg.value};
  padding-inline: ${(props) => props.theme.padding.xxl.value};

  user-select: none;

  transition:
    opacity 0.9s,
    transform 0.3s ease;

  &:hover {
    background-color: ${(props) =>
      props.theme.backgroundColor.layout['container-L1'].value};
    opacity: 0.9;

    transform: translateY(-3px);
    transition: transform 0.3s ease;
  }
`;
