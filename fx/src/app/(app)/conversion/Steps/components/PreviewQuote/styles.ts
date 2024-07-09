'use client';
import styled from 'styled-components';

export const Container = styled.div`
  background-color: ${(props) =>
    props.theme.backgroundColor.layout['container-L0'].value};
  overflow: hidden;
  border-radius: ${(props) => props.theme.borderRadius['radius-md'].value};
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.theme.padding.lg.value};
  background-color: ${(props) =>
    props.theme.backgroundColor.layout['container-L2'].value};
`;

export const ContainerLabels = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Content = styled.div`
  padding: ${(props) => props.theme.padding.lg.value};
`;

export const Label = styled.label`
  font-weight: 400;
  font-size: ${(props) => props.theme.fontSize.caption.value};
  color: ${(props) => props.theme.textColor.layout.secondary.value};
  line-height: 18px;
  letter-spacing: 0.018px;
`;

export const LabelValue = styled.label`
  font-weight: 600;
  font-size: ${(props) => props.theme.fontSize.callout.value};
  color: ${(props) => props.theme.textColor.layout.primary.value};
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0.08px;
`;
