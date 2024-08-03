'use client';

import styled from 'styled-components';

interface IProps {
  $widthLabelTitle?: number;
}

export const LabelTile = styled.label<IProps>`
  font-size: ${(props) => props.theme.size['24px']};
  width: ${(props) =>
    props.$widthLabelTitle ? `${props.$widthLabelTitle}px` : 'fit-content'};
  font-weight: 600;
`;

export const LabelContent = styled.label`
  font-size: ${(props) => props.theme.size['24px']};
`;

export const LabelContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 16px;

  color: ${(props) => props.theme.colors.label};
  margin-block: ${(props) => props.theme.size['8px']};
`;
