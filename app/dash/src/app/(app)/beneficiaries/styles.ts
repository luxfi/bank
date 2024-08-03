'use client';

import styled from 'styled-components';

interface IButton {
  variant?: 'negative' | 'positive' | 'neutral' | 'secondary';
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${(props) => props.theme.height['18x'].value};
  margin-right: ${(props) => props.theme.margin.lg.value};
`;

export const FiltersContainer = styled.div`
  display: flex;

  align-items: center;
  height: ${(props) => props.theme.height.xxxl.value};
  gap: 16px;
  margin-bottom: ${(props) => props.theme.margin.xxs.value};
`;

export const DrawerContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TitleFiltersContainer = styled.div`
  display: flex;
  width: 100%;
  padding-bottom: 8px;
  margin-bottom: 16px;
  border-bottom: 1px solid
    ${(props) => props.theme.borderColor.layout['divider-subtle'].value};
`;

export const FiltersContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${(props) => props.theme.gap.xxs.value};
`;

export const FiltersAction = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-top: ${(props) => props.theme.margin.sm.value};
  gap: ${(props) => props.theme.gap.xxs.value};
`;

export const TitleFilters = styled.h1`
  color: ${(props) => props.theme.textColor.layout.primary.value};
  font-weight: 400;
  font-size: ${(props) => props.theme.fontSize.title_sm.value};
  line-height: ${(props) => props.theme.lineHeight.headline.value};
  letter-spacing: 0.08px;
`;

export const Title = styled.h1`
  font-weight: 400;
  color: ${(props) => props.theme.textColor.layout.primary.value};
  font-size: ${(props) => props.theme.fontSize.headline.value};
  line-height: ${(props) => props.theme.lineHeight.headline.value};
  letter-spacing: -0.026px;
`;

export const MainContent = styled.div``;

export const IconButton = styled.button<IButton>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.8rem;
  width: 32px;
  height: 32px;
  transition: all 0.3s ease-in-out;

  &:hover {
    opacity: 0.7;
    scale: 1.05;
  }
  p {
    font-size: ${(props) => props.theme.size['16px']};
    font-weight: 600;
  }
`;

export const ErrorModalFooter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
