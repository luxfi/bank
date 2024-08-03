'use client';
import { useEffect, useState } from 'react';

import { formatDateAndTime } from '@/utils/lib';

import styled from 'styled-components';

import { Badge } from '../Badge';

export interface IFilterTag<T> {
  label: string;
  key: keyof T | 'clear';
}

interface IFilterTagsGroup<T> {
  filters: T;
  dictionary?: {
    value: string;
    label: string;
  }[];
  show: boolean;
  filtersToIgnore?: Array<keyof T>;
  onRemove: (key: keyof T | 'clear', value?: string) => void;
}

export function FilterTagsGroup<T>({
  filters,
  dictionary,
  show = false,
  filtersToIgnore = [] as Array<keyof T>,
  onRemove,
}: IFilterTagsGroup<T>) {
  const [filtersGroup, setFiltersGroup] = useState<IFilterTag<T>[]>([]);

  const handleRemove = (key: keyof T | 'clear') => {
    if (key === 'clear') {
      setFiltersGroup([]);
    }
    setFiltersGroup((prev) => {
      return prev.filter((filter) => filter.key !== key);
    });
    return onRemove(key, undefined);
  };

  useEffect(() => {
    const filtersToShow = Object.entries(filters as any)
      .filter(([key]) => !filtersToIgnore.includes(key as any))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, value]) => value)
      .map(([key, value]) => {
        const v = key.includes('Date')
          ? formatDateAndTime(value as string)?.date
          : value;

        return {
          label: dictionary?.find((item) => item.value === value)?.label || v,
          key,
        };
      });

    setFiltersGroup(filtersToShow as IFilterTag<T>[]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, dictionary]);

  if (filtersGroup.length === 0) return null;
  return (
    <>
      {show && (
        <TagsWrapper>
          {filtersGroup?.map(
            (filter, index) =>
              filter.label && (
                <Badge
                  key={index}
                  label={filter.label}
                  variant="info"
                  icon="cross"
                  onClickIcon={() => {
                    handleRemove(filter.key);
                  }}
                />
              )
          )}
          <Badge
            label="Clear all"
            variant="negative"
            icon="cross"
            onClickIcon={() => {
              handleRemove('clear');
            }}
          />
        </TagsWrapper>
      )}
    </>
  );
}

const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.gap.xxs.value};
`;
