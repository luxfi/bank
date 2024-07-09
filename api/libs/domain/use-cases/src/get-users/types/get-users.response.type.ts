export interface UsersResponse {
  id: string;
  name: string;
  status: string;
  role: string;
  email: string;
  client?: string;
}
interface PaginationsResponse {
  totalEntries?: number;
  totalPages?: number;
  page: number;
  limit: number;
}
export interface ListUsersResponse {
  data: UsersResponse[];
  pagination?: PaginationsResponse;
}
