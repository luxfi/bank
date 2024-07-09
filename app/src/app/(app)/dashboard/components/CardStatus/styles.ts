'use client';

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
  align-items: center;
  justify-content: center;

  user-select: none;

  cursor: pointer;

  border-radius: ${(props) => props.theme.borderRadius['radius-md'].value};

  background-color: ${(props) =>
    props.theme.backgroundColor.layout['container-L2'].value};

  transition:
    opacity 0.9s,
    transform 0.3s ease;

  &:hover {
    opacity: 0.9;

    transform: translateY(-3px);
    transition: transform 0.3s ease;
  }

  span.count {
    font-size: ${(props) => props.theme.fontSize.title_md.value};
    font-weight: 600;
    line-height: 28px;
    letter-spacing: -0.26;
  }
`;
