'use client';

import styled from 'styled-components';

export const Container = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${(props) => props.theme.size['56px']};

  transition: all 0.3s ease-in-out;
`;

export const BaseFilters = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  align-items: flex-end;
`;
