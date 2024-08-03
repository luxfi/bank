'use client';

import styled from 'styled-components';

export const Container = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const LabelBackButton = styled.div`
  font-weight: 400;
  color: ${(props) => props.theme.textColor.layout.primary.value};
  font-size: ${(props) => props.theme.fontSize.headline.value};
  line-height: ${(props) => props.theme.lineHeight.headline.value};
  letter-spacing: -0.026px;
`;

export const MainContent = styled.div``;

export const Title = styled.p`
  color: ${(props) => props.theme.textColor.layout.primary.value};
  opacity: 0.6;
  font-size: ${(props) => props.theme.fontSize.body_sm.value};
  letter-spacing: ${(props) => props.theme.letterSpacing.body.value};
  line-height: ${(props) => props.theme.lineHeight.body_sm.value};
`;

export const FilterContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: flex-end;
`;
