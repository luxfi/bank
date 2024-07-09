'use client';

import Lottie from 'react-lottie';

import { IPaginationResponse } from '@/models/pagination';

import loadingTable from '@/animations/loadingTable.json';
import { Column, Icon, Text } from '@cdaxfx/ui';
import { Table as TableAntd } from 'antd';
import { AnyObject } from 'antd/es/_util/type';
import { ColumnsType } from 'antd/es/table';
import { ExpandableConfig, GetRowKey } from 'antd/es/table/interface';

import { Container } from './styles';

export interface IColumnProps<T> extends Omit<ColumnsType<T>[number], 'show'> {
  show?: boolean;
  dataIndex?: keyof T | string;
  orderBy?: string;
}

export interface ITablePagination {
  totalPage: number;
  defaultPageSize?: number;
  defaultCurrentPage?: number;
  currentPageSize?: number;
  currentPage?: number;
  onChangePage(page: number, pageSize: number): void;
}

export interface ITableProps<T> {
  columns: IColumnProps<T>[];
  dataSource: Array<T>;
  showHeader?: boolean;
  pagination?: ITablePagination;
  containerStyles?: React.CSSProperties;
  actionsContainer?(value: AnyObject): React.ReactNode;
  expandable?: ExpandableConfig<T> | undefined;
  onRowClick?(row: T, column?: ColumnsType, index?: number): void;
  rowKey?: string | GetRowKey<any>;
  loading?: boolean;
  onSortChange?({
    field,
    sort,
  }: {
    field: string | undefined;
    sort: TOrder;
  }): void;
}

export type TOrder = 'asc' | 'desc' | undefined;
export interface ISorting {
  orderBy?: string;
  order?: TOrder;
}

export interface ISortingPagination
  extends ISorting,
    Pick<IPaginationResponse, 'page' | 'limit'> {}

const animationOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingTable,
};

export default function Table<T extends object>({
  columns,
  dataSource,
  loading,
  rowKey,
  showHeader,
  onRowClick,
  expandable,
  pagination,
  actionsContainer,
  containerStyles,
  onSortChange,
}: ITableProps<T>) {
  return (
    <Container style={containerStyles} $onClick={!!onRowClick}>
      <TableAntd
        showHeader={showHeader}
        size="large"
        onRow={(record) => {
          return {
            onClick: () => onRowClick && onRowClick(record),
          };
        }}
        rowClassName={'row'}
        columns={columns.map((col: any) => {
          if (col?.title === 'Actions' && actionsContainer) {
            return {
              ...col,
              render: actionsContainer,
            };
          }
          if (!col.sorter) return col;

          return {
            ...col,
            title: col.title,
            showSorterTooltip: false,
            sortIcon: (e: { sortOrder: 'ascend' | 'descend' }) => {
              const { sortOrder } = e;
              if (sortOrder === 'ascend') {
                return <Icon variant="arrow-up" size="xs" />;
              }
              if (sortOrder === 'descend') {
                return <Icon variant="arrow-down" size="xs" />;
              }
            },
            sorter: (a: T, b: T, sort: 'ascend' | 'descend') => {
              if (sort === 'ascend') {
                return onSortChange?.({
                  field: col.orderBy || col.dataIndex,
                  sort: 'asc',
                });
              }
              if (sort === 'descend') {
                return onSortChange?.({
                  field: col.orderBy || col.dataIndex,
                  sort: 'desc',
                });
              }
              return onSortChange?.({
                field: undefined,
                sort: undefined,
              });
            },
          };
        })}
        rowKey={rowKey}
        loading={
          loading && {
            indicator: (
              <Column
                gap="xxxs"
                width="100%"
                align="center"
                style={{ marginTop: '200px' }}
              >
                <Lottie options={animationOptions} width={110} />
                <Text variant="body_md_regular">Loading...</Text>
              </Column>
            ),
          }
        }
        locale={{
          emptyText: loading ? (
            <></>
          ) : (
            <Column
              gap="xxxs"
              width="100%"
              align="center"
              justify="center"
              height="400px"
            >
              <Icon variant="filter" size="xl" color="#002C52A3" />
              <Text variant="body_md_regular" color="#002C52A3">
                No data found.
              </Text>
            </Column>
          ),
        }}
        expandable={expandable}
        dataSource={dataSource}
        style={containerStyles}
        pagination={
          !pagination
            ? false
            : {
                total: pagination?.totalPage,
                onChange: pagination?.onChangePage,
                defaultPageSize: 10,
                pageSize: pagination?.currentPageSize,
                current: pagination?.currentPage,
              }
        }
      />
    </Container>
  );
}
