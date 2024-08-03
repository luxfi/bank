'use client';

import styled from 'styled-components';

export const Label = styled.label`
  font-weight: ${({ theme }) =>
    theme.typography.caption.regular.value.fontWeight};
  font-size: ${({ theme }) => theme.typography.caption.regular.value.fontSize};
  margin-bottom: ${(props) => props.theme.size['8px']};
  color: ${({ theme }) => theme.textColor.interactive.enabled.value};
`;
