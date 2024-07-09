'use client';

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
`;

export const CurrencyContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
`;

export const Title = styled.h1`
  font-weight: 500;
  color: ${(props) => props.theme.textColor.layout.primary.value};
  font-size: ${(props) => props.theme.fontSize.headline.value};
  line-height: ${(props) => props.theme.lineHeight.headline.value};
  letter-spacing: ${(props) => props.theme.letterSpacing.caption.value};
`;

export const TextLink = styled.a`
  color: ${(props) => props.theme.textColor.layout.primary.value};
  opacity: 0.6;
  font-size: ${(props) => props.theme.fontSize.body_md.value};
  letter-spacing: 0.08px;
  line-height: 24px;
  text-decoration: underline;
`;

export const Content = styled.div`
  display: flex;

  flex-direction: column;
  padding: 16px;
`;

export const LabelValue = styled.h1`
  font-weight: 700;
  font-size: ${(props) => props.theme.fontSize.title_md.value};
  color: ${(props) => props.theme.textColor.layout.primary.value};
  line-height: 40px;
  letter-spacing: -0.42px;
`;

export const ContainerFilters = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-block: 24px;
`;

export const MainContent = styled.div``;

export const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ModalHeader = styled.div``;

export const ModalTitle = styled.h1`
  font-weight: 500;
  font-size: ${(props) => props.theme.fontSize.callout.value};
  line-height: 24px;
  letter-spacing: 0.09px;
`;

export const ModalSubtitle = styled.h3`
  font-weight: 400;
  font-size: ${(props) => props.theme.fontSize.body_sm.value};
  color: ${(props) => props.theme.textColor.layout.secondary.value};
  line-height: 20px;
  letter-spacing: 0.07px;
`;

export const ModalCardContent = styled.div`
  width: 100%;
  margin: 16px;
  padding: 8px;
  background-color: ${(props) =>
    props.theme.backgroundColor.layout['container-L0'].value};
  border: 1px solid
    ${(props) => props.theme.borderColor.layout['border-subtle'].value};
  border-radius: ${(props) => props.theme.borderRadius['radius-lg'].value};
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const GridContent = styled.div`
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(2, 1fr);
`;

export const ModalLabel = styled.label`
  font-weight: 400;
  font-size: ${(props) => props.theme.fontSize.caption.value};
  color: ${(props) => props.theme.textColor.layout.secondary.value};
  line-height: 18px;
  letter-spacing: 0.18px;
`;

export const ModalValue = styled.label`
  font-weight: 400;
  color: ${(props) => props.theme.textColor.layout.primary.value};
  font-size: ${(props) => props.theme.fontSize.body_md.value};
  line-height: 24px;
  letter-spacing: 0.08px;
`;

export const ModalLabelContainer = styled.div`
  display: flex;
  flex-direction: row;

  span {
    cursor: pointer;
  }
`;

export const ModalContainerLabels = styled.div`
  display: flex;
  flex-direction: column;
`;
