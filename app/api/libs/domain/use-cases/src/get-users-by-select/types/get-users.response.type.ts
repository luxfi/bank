export interface UsersResponse {
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
  data: UsersResponse[];
  pagination?: PaginationsResponse;
}
