import { UserRole } from '@tools/models';

export interface GetUsersRequest {
  name?: string;
  userId?: string;
  status?: 'pending' | 'approved' | 'archived';
  role?: UserRole;
  client?: string;
  order?: 'asc' | 'desc';
  orderBy?: 'username' | 'role' | 'status';
  page?: number;
  limit?: number;
}
