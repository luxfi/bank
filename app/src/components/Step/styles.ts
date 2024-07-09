'use client';

import styled from 'styled-components';

interface IProps {
  $active: boolean;
}

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: fit-content;
  width: 100%;
`;

export const ContainerLine = styled.div`
  display: flex;
  align-items: center;
  align-self: flex-end;
  width: 100%;
  height: ${(props) => props.theme.width.md.value};
  padding-inline: ${(props) => props.theme.padding.xxs.value};
`;

export const Line = styled.div<IProps>`
  height: 2px;
  min-width: 20px;
  width: 100%;
  background-color: ${(props) =>
    props.$active
      ? props.theme.backgroundColor.interactive['primary-default'].value
      : props.theme.borderColor.interactive.default.value};
`;

export const ContainerItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40px;
  gap: 4px;
`;

export const Label = styled.span`
  font-size: ${(props) => props.theme.fontSize.body_sm.value};
  color: ${(props) => props.theme.textColor.layout.secondary.value};
  font-weight: 400;
  white-space: nowrap;
`;

export const ContainerDot = styled.div<IProps>`
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${(props) =>
    props.$active
      ? props.theme.backgroundColor.interactive['primary-default'].value
      : props.theme.backgroundColor.layout['container-L1'].value};

  width: ${(props) => props.theme.width.md.value};
  height: ${(props) => props.theme.width.md.value};

  border: 1px solid
    ${(props) =>
      props.$active
        ? props.theme.backgroundColor.interactive['primary-default'].value
        : props.theme.borderColor.interactive.default.value};
  border-radius: 100%;
`;

export const LabelDot = styled.span<IProps>`
  font-size: ${(props) => props.theme.fontSize.body_sm.value};
  /* color: ${(props) => props.theme.textColor.layout.secondary.value}; */
  color: ${(props) =>
    props.$active
      ? props.theme.textColor.interactive['default-inverse'].value
      : props.theme.textColor.layout.secondary.value};
  font-weight: 400;
`;
