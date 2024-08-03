'use client';

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  cursor: pointer;
`;

export const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.theme.backgroundColor.interactive['primary-default'].value};
  border-radius: ${(props) => props.theme.borderRadius['radius-xl'].value};

  width: 80px;
  height: 80px;
  overflow: hidden;
`;

export const IconPhotoContainer = styled.div`
  display: flex;
  align-self: flex-end;
  align-items: center;
  justify-content: center;
  border-radius: ${(props) => props.theme.borderRadius['radius-full'].value};
  background-color: ${(props) =>
    props.theme.backgroundColor.layout['container-L0'].value};
  height: 32px;
  width: 32px;

  margin-left: -24px;
  margin-bottom: -8px;
`;

export const ModalContainer = styled.div`
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

  align-items: center;
  padding: 4px;
  border: 1px solid
    ${(props) => props.theme.borderColor.layout['border-strong'].value};

  margin-top: 40px;
  border-radius: 8px;

  p {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
