export interface Pagination {
  totalEntries?: number;
  totalPages?: number;
  page: number;
  limit: number;
}

export class PaginationDefault {
  totalEntries?: number;
  totalPages?: number;
  page: number;
  limit: number;
}
