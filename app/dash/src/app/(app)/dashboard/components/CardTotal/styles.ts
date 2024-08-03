'use client';

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  cursor: pointer;

  border: 1px solid
    ${(props) => props.theme.borderColor.layout['border-subtle'].value};
  padding-inline: ${(props) => props.theme.padding.xxs.value};
  padding-block: ${(props) => props.theme.padding.sm.value};
  width: ${(props) => props.theme.width['60x'].value};
  height: ${(props) => props.theme.height.xl.value};
  border-radius: ${(props) => props.theme.borderRadius['radius-md'].value};

  user-select: none;

  transition:
    opacity 0.9s,
    transform 0.3s ease;

  &:hover {
    opacity: 0.9;

    transform: translateY(-3px);
    transition: transform 0.3s ease;
  }

  span.count {
    font-size: ${(props) => props.theme.fontSize.body_sm.value};
    font-weight: 600;
    line-height: 28px;
    letter-spacing: -0.26;
  }
`;
