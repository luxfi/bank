'use client';

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 24px;
`;

export const SelectPictureContainer = styled.div`
  display: flex;
  cursor: pointer;
  width: 100%;
  margin-block: 24px;
  padding: ${(props) => props.theme.padding.sm.value};
  gap: 16px;
  border-radius: ${(props) => props.theme.borderRadius['radius-md'].value};
  flex-direction: column;
  align-items: center;
  background-color: ${(props) =>
    props.theme.backgroundColor.layout['container-L0'].value};

  border: 1px solid
    ${(props) => props.theme.borderColor.interactive.default.value};
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const FileContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;

  align-items: center;
  padding: 4px;
  border: 1px solid
    ${(props) => props.theme.borderColor.layout['border-strong'].value};

  margin-top: 40px;
  border-radius: 8px;

  padding-inline: 12px;

  p {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
