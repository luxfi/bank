'use client';

import styled from 'styled-components';

interface IProps {
  $onClick?: boolean;
}

export const Container = styled.div<IProps>`
  .ant-table-container {
    overflow-x: auto !important;
  }
  .ant-table-wrapper,
  .ant-table-column-sort {
    background-color: ${(props) =>
      props.theme.backgroundColor.layout['container-L1'].value} !important;
  }
  .ant-table-thead {
    min-height: 50px;
  }

  .ant-table-cell {
    border-bottom: 1px solid
      ${(props) => props.theme.borderColor.layout['divider-subtle'].value} !important;
  }
  .ant-table-cell-row-hover {
    background-color: ${(props) =>
      props.theme.backgroundColor.interactive['secondary-hover']
        .value} !important;
  }

  th.ant-table-cell {
    z-index: 0;
    border-top: 1px solid
      ${(props) => props.theme.borderColor.layout['divider-subtle'].value};
    border-bottom: 1px solid
      ${(props) => props.theme.borderColor.layout['border-strong'].value} !important;
    background-color: ${(props) =>
      props.theme.backgroundColor.layout['container-L1'].value} !important;
    color: ${(props) => props.theme.textColor.layout.primary.value} !important;
    border-radius: 0 !important;

    font-size: 16px;
    text-transform: uppercase;
    font-weight: 400 !important;
  }
  .ant-table-column-sorters {
    display: flex;
    align-items: center;
    justify-content: flex-start !important;
    gap: ${(props) => props.theme.gap.xs.value};
  }
  .ant-table-column-title {
    max-width: fit-content;
  }

  th.ant-table-column-sort {
    background-color: ${(props) =>
      props.theme.backgroundColor.interactive['secondary-hover']
        .value} !important;
  }
  .row {
    background-color: ${(props) =>
      props.theme.backgroundColor.layout['container-L1'].value} !important;
    min-height: 32px;
    font-weight: 400;
    font-size: 14px;
    color: ${(props) => props.theme.textColor.layout.primary.value} !important;
  }

  .ant-table-tbody .ant-table-row {
    cursor: ${(props) => (props.$onClick ? 'pointer' : 'default')};
  }

  .ant-table-tbody {
    border-bottom: 5px solid
      ${(props) => props.theme.borderColor.layout['border-strong'].value} !important;

    * .ant-table-cell {
      .column-min-width-01 {
        min-width: 327px;
      }
      .column-min-width-02 {
        min-width: 135px;
      }
      .column-min-width-03 {
        min-width: 150px;
      }
      .column-min-width-04 {
        min-width: 120px;
      }
    }
  }

  thead {
    tr {
      .ant-table-cell.ant-table-row-expand-icon-cell {
        background-color: ${(props) =>
          props.theme.backgroundColor.layout['container-L1'].value} !important;
      }
    }
  }
  .ant-pagination {
    margin: 0 !important;
    padding: 16px !important;
    border-top: 1px solid
      ${(props) => props.theme.borderColor.layout['border-strong'].value};
    border-bottom: 1px solid
      ${(props) => props.theme.borderColor.layout['divider-subtle'].value};

    li {
      background-color: ${(props) =>
        props.theme.backgroundColor.layout['container-L1'].value} !important;
      border: none !important;
    }

    .ant-pagination-item {
      border-radius: ${(props) => props.theme.borderRadius['radius-md'].value};
      background-color: ${(props) =>
        props.theme.backgroundColor.interactive['surface-hover']
          .value} !important;
    }

    .ant-pagination-item-active {
      background-color: ${(props) =>
        props.theme.backgroundColor.layout['container-L1'].value} !important;
      border: 2px solid
        ${(props) => props.theme.borderColor.interactive['focus-default'].value} !important;
    }

    * {
      color: ${(props) =>
        props.theme.textColor.layout.primary.value} !important;

      &:disabled {
        color: ${(props) =>
          props.theme.textColor.interactive.disabled.value} !important;
      }
    }
  }
`;
