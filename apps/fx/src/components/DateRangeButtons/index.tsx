'use client';
import { useEffect, useMemo, useState } from 'react';

import { Text } from '@cdaxfx/ui';
import dayjs from 'dayjs';
import styled from 'styled-components';

type TRange = {
  start: string;
  end: string;
};

interface IDateRangeButtons {
  value?: TRange;
  disabled?: boolean;
  onChange: (range: TRange) => void;
}
export function DateRangeButtons({
  onChange,
  value,
  disabled,
}: IDateRangeButtons) {
  const [valueSelected, setValueSelected] = useState('');
  const today = dayjs();
  const dates = useMemo(
    () => [
      {
        label: 'Day',
        key: 'day',
        start: today.subtract(1, 'day').format('YYYY-MM-DD'),
        end: today.endOf('day').format('YYYY-MM-DD'),
      },
      {
        label: 'Week',
        key: 'week',
        start: today.subtract(7, 'day').format('YYYY-MM-DD'),
        end: today.endOf('day').format('YYYY-MM-DD'),
      },
      {
        label: 'Month',
        key: 'month',
        start: today.subtract(1, 'month').format('YYYY-MM-DD'),
        end: today.endOf('day').format('YYYY-MM-DD'),
      },
      {
        label: 'Quarter',
        key: 'quarter',
        start: today.subtract(4, 'month').format('YYYY-MM-DD'),
        end: today.endOf('day').format('YYYY-MM-DD'),
      },
      {
        label: 'Year',
        key: 'year',
        start: today.subtract(1, 'year').format('YYYY-MM-DD'),
        end: today.endOf('day').format('YYYY-MM-DD'),
      },
    ],
    [today]
  );

  useEffect(() => {
    if (!value?.start || !value?.end) {
      setValueSelected('');
      return;
    }
    dates.map((date) => {
      if (value.start === date.start && value.end === date.end) {
        setValueSelected(date.key);
      }
    });
  }, [dates, value]);

  return (
    <ButtonsContainer>
      {dates.map((date) => (
        <RangeButton
          disabled={disabled}
          $active={valueSelected === date.key}
          key={date.key}
          onClick={() => {
            setValueSelected((prev) => {
              if (prev === date.key) {
                onChange({
                  start: '',
                  end: '',
                });
                return '';
              }
              onChange({
                start: dayjs(date.start).format('YYYY-MM-DD'),
                end: dayjs(date.end).format('YYYY-MM-DD'),
              });
              return date.key;
            });
          }}
        >
          <Text variant="body_md_regular">{date.label}</Text>
        </RangeButton>
      ))}
    </ButtonsContainer>
  );
}

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  min-height: 40px;
  border-radius: ${(props) => props.theme.borderRadius['radius-md'].value};
  border: 1px solid
    ${(props) => props.theme.borderColor.layout['border-subtle'].value};
`;

const RangeButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  height: 40px;
  cursor: pointer;
  padding-inline: ${(props) => props.theme.padding.sm.value};

  background: ${(props) =>
    props.$active
      ? props.theme.backgroundColor.interactive['secondary-hover'].value
      : 'none'};

  transition: all 0.2s ease-in-out;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:hover:not(:disabled) {
    background-color: ${(props) =>
      props.theme.backgroundColor.interactive['secondary-hover'].value};
  }

  &:not(:last-child) {
    border-right: 1px solid
      ${(props) => props.theme.borderColor.layout['border-subtle'].value};
  }

  &:first-child {
    border-top-left-radius: ${(props) =>
      props.theme.borderRadius['radius-md'].value};
  }

  &:last-child {
    border-top-right-radius: ${(props) =>
      props.theme.borderRadius['radius-md'].value};
  }
`;
