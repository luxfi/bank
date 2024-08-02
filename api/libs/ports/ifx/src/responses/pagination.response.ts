export interface PaginationWrapper<T> {
    data: T[];
    meta: Pagination;
}
  
export interface Pagination {
    count: number;
    offset: number;
    limit: number;
    total: number;
}
  