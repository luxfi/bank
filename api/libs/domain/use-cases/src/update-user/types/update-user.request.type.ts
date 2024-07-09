export interface UpdateUserRequest {
  id: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  role?: string;
  country?: string;
  password?: string;
}
