'use client';

import styled from 'styled-components';

export const Container = styled.div`
  cursor: pointer;

  min-width: ${(props) => props.theme.width['60x'].value};
  background-color: ${(props) =>
    props.theme.backgroundColor.layout['container-L2'].value};
  border-radius: ${(props) => props.theme.borderRadius['radius-md'].value};
  padding-inline: ${(props) => props.theme.padding.sm.value};
  padding-block: ${(props) => props.theme.padding.lg.value};

  transition:
    opacity 0.9s,
    transform 0.3s ease;

  user-select: none;

  &:hover {
    opacity: 0.9;

    transform: translateY(-3px);
    transition: transform 0.3s ease;
  }

  span.count {
    font-size: ${(props) => props.theme.fontSize.headline.value};
    font-weight: 600;
    line-height: 28px;
    letter-spacing: -0.26;
  }
`;

export const TextWithEllipsis = styled.div`
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const LabelCount = styled.span``;
