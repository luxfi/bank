import { useCallback, useEffect, useState } from 'react';

import { IColumnProps } from '@/components/Table';

export interface IColumnsCheckGroup {
  label: string;
  key: string;
  checked: boolean;
}

function useColumns<T>(sourceColumns: IColumnProps<T>[]) {
  const [checkboxGroup, setCheckboxGroup] = useState<IColumnsCheckGroup[]>([]);
  const [columns, setColumns] = useState<IColumnProps<T>[]>([]);

  const getCheckboxGroup = useCallback(() => {
    const group = sourceColumns
      .filter((col) => Object.prototype.hasOwnProperty.call(col, 'show'))
      .map((col) => ({
        label: col.title as string,
        key: col.dataIndex as string,
        checked: col.show as boolean,
      }));

    setCheckboxGroup(group);
  }, [sourceColumns]);

  const handleToggleColumn = (key: string, value: boolean) => {
    setCheckboxGroup((prev) => {
      return prev.map((item) => {
        if (item.key === key) {
          return {
            ...item,
            checked: value,
          };
        }
        return item;
      });
    });
  };

  const handleApply = useCallback(() => {
    const filteredColumns = sourceColumns.filter((col) => {
      const includedColumn = checkboxGroup.find(
        (colToShow) => colToShow.key === col.dataIndex && colToShow.checked
      );
      const fixedColumn = !checkboxGroup.some(
        (colToShow) => colToShow.key === col.dataIndex
      );
      return includedColumn || fixedColumn;
    });

    setColumns(filteredColumns);
  }, [checkboxGroup, sourceColumns]);

  useEffect(() => {
    getCheckboxGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceColumns]);

  useEffect(() => {
    handleApply();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkboxGroup, sourceColumns]);

  return { checkboxGroup, columns, handleToggleColumn, handleApply };
}

export default useColumns;
