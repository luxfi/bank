export interface UsersBySelectResponse {
    id: string;
    name: string;
    email: string;
}

interface PaginationsResponse {
    totalEntries?: number;
    totalPages?: number;
    page: number;
    limit: number;
}

export interface ListUsersSelectResponse {
    data: UsersBySelectResponse[];
    pagination?: PaginationsResponse;
}
  