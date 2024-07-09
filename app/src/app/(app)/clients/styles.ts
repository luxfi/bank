'use client';

import styled from 'styled-components';

const Container = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const TableContainer = styled.div`
  &.ant-table-expanded-row tr {
    background-color: ${(props) =>
      props.theme.backgroundColor.layout['container-L1'].value} !important;
  }

  .ant-table-row,
  tr {
    background-color: ${(props) =>
      props.theme.backgroundColor.layout['container-L0'].value} !important;
  }

  .expandableTable {
    background-color: ${(props) =>
      props.theme.backgroundColor.layout['container-L1'].value} !important;

    td {
      padding: 8px !important;
    }
  }

  min-width: 1200px;
  overflow-x: auto;
`;

export const TableContainerExpandable = styled.div`
  .ant-table-row,
  tr {
    background-color: ${(props) =>
      props.theme.backgroundColor.layout['container-L1'].value} !important;
  }
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

const ActionContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 24px;
  margin-bottom: ${(props) => props.theme.size['48px']};
`;

const ButtonContainer = styled.div`
  min-width: 128px;
`;

const IconButton = styled.button`
  color: ${(props) => props.theme.colors.detail};
  background-color: ${(props) => props.theme.colors.gray};
  border: 1px solid;
  border-color: ${(props) => props.theme.colors.detail};
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
`;

const ButtonActionDetails = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  user-select: none;
`;

// display: 'flex',
// alignItems: 'center',
// justifyContent: 'flex-end',
// cursor: 'pointer',
// width: '100%',
// gap: 32,
// userSelect: 'none',

const ContainerActionDetails = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
  width: 100%;
  gap: 32px;
  user-select: none;
`;

export {
  Container,
  ContainerActionDetails,
  ButtonActionDetails,
  ActionContainer,
  ButtonContainer,
  IconButton,
};
// eslint-disable-next-line prettier/prettier

