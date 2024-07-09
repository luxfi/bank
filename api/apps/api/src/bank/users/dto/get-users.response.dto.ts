export class UsersResponse {
  id: string;
  name: string;
  status: string;
  role: string;
  email: string;
  client?: string;
}

export class UsersSelectResponse {
  id: string;
  name: string;
}
class PaginationsResponse {
  totalEntries?: number;
  totalPages?: number;
  page: number;
  limit: number;
}
export class ListUsersResponseDto {
  data: UsersResponse[];
  pagination?: PaginationsResponse;
}

export class ListUsersSelectResponseDto {
  data: UsersSelectResponse[];
  pagination?: PaginationsResponse;
}
