import { UserRole } from '@tools/models';
import { IsOptional, IsUUID, MinLength } from 'class-validator';

export enum Status {
  Pending = 'pending',
  Approved = 'approved',
  Archived = 'archived',
}

export enum Order {
  Asc = 'asc',
  Desc = 'desc',
}

export enum OrderBy {
  Username = 'username',
  Role = 'role',
  Status = 'status',
}

export class GetUsersRequestDto {
  name?: string;
  userId?: string;
  status?: Status;
  role?: UserRole;
  client?: string;
  order?: Order;
  orderBy?: OrderBy;
  page?: number;
  limit?: number;
}

export class GetUsersSelectRequestDto {
  @IsOptional()
  @MinLength(3)
  name?: string;
}

export class GetRequestDto {
  @IsOptional()
  @IsUUID()
  clientId?: string;
}
