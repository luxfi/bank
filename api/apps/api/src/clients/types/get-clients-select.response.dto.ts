export class ClientSelectResponse {
  id: string;
  name: string;
}
class PaginationsResponse {
  totalEntries?: number;
  totalPages?: number;
  page: number;
  limit: number;
}
export class ListClientSelectResponseDto {
  data: ClientSelectResponse[];
  pagination?: PaginationsResponse;
}
