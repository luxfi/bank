import styled from 'styled-components';

export const Container = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
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

export const Title = styled.h1`
  font-weight: 400;
  color: ${(props) => props.theme.textColor.layout.primary.value};
  font-size: ${(props) => props.theme.fontSize.headline.value};
  line-height: ${(props) => props.theme.lineHeight.headline.value};
  letter-spacing: -0.026px;
`;

export const TitleCurrency = styled.div`
  font-weight: 400;
  font-size: ${(props) => props.theme.fontSize.body_sm.value};
  color: ${(props) => props.theme.textColor.layout.primary.value};
  line-height: ${(props) => props.theme.lineHeight.body_sm.value};
  letter-spacing: ${(props) => props.theme.letterSpacing.body.value};
`;

export const FlagContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 100%;
  overflow: hidden;

  border: 1px solid ${(props) => props.theme.colors.borderLabel};
`;

export const MainContent = styled.div``;
