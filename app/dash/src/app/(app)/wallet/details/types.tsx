import dayjs from 'dayjs';

interface IFiltersDate {
  start: string;
  end: string;
  dateType: 'created_at' | 'settles_at' | 'completed_at';
}

export const initFiltersDate: IFiltersDate = {
  start: dayjs(new Date()).format('YYYY-MM-DD'),
  end: dayjs(new Date()).format('YYYY-MM-DD'),
  dateType: 'created_at',
};
