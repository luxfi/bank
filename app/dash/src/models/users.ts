import { UserRole } from './auth';

export type TUserStatus = 'approved' | 'pending' | 'archived';

export interface IUser {
  id: string;
  email: string;
  client: string;
  name: string;
  role: UserRole;
  status: TUserStatus;
}

export interface IUserDetails {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  role: UserRole;
  country: string;
  status: TUserStatus;
  phone: string;
}
